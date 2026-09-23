import crypto from 'crypto';
import { db } from './db';
import { sendAdminLoginOtpEmail } from './emailjs';
import { UserSession } from './auth';

const OTP_SECRET_SALT = process.env.JWT_SECRET || 'ggl_otp_secure_salt_2026';

// List of pre-authorized administrator emails
const AUTHORIZED_ADMIN_EMAILS = [
  'admin@gorakhpurgotlatent.com',
  'admin@ggllive.in',
  'staff@ggllive.in',
  'scanner@ggllive.in',
  'alooksingh1@gmail.com',
  'help@gkpgotlatent.in',
  ...(process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : [])
];

function hashOtp(email: string, otp: string): string {
  return crypto
    .createHmac('sha256', OTP_SECRET_SALT)
    .update(`${email.toLowerCase()}:${otp}`)
    .digest('hex');
}

/**
 * Check if an email address is authorized for admin access
 */
export async function isAuthorizedAdminEmail(email: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Check in static/env authorized list
  if (AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail)) {
    return true;
  }

  // 2. Check in database users table for admin roles
  try {
    const user = await db.queryOne<any>(
      'SELECT id, role FROM users WHERE LOWER(email) = ?',
      [cleanEmail]
    );
    if (user && ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'TICKET_STAFF'].includes(user.role)) {
      return true;
    }
  } catch (err) {
    console.error('Error verifying admin authorization in database:', err);
  }

  return false;
}

export interface SendOtpResult {
  success: boolean;
  error?: string;
  cooldownSeconds?: number;
  expiresInSeconds?: number;
}

/**
 * Generate secure 6-digit OTP and send via EmailJS
 */
export async function requestAdminOtp(email: string): Promise<SendOtpResult> {
  const cleanEmail = email.trim().toLowerCase();

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return {
      success: false,
      error: 'Please enter a valid email address.',
    };
  }

  // Check authorization
  const isAuthorized = await isAuthorizedAdminEmail(cleanEmail);
  if (!isAuthorized) {
    // Security: generic message without revealing authorized status
    return {
      success: false,
      error: 'Unable to send verification code. Please check your administrator access.',
    };
  }

  // Rate Limiting Check:
  // 1. Minimum 60-second cooldown between consecutive OTP requests for same email
  try {
    const recentOtp = await db.queryOne<any>(
      `SELECT created_at FROM admin_otps 
       WHERE LOWER(email) = ? 
       ORDER BY created_at DESC LIMIT 1`,
      [cleanEmail]
    );

    if (recentOtp && recentOtp.created_at) {
      const elapsedMs = Date.now() - new Date(recentOtp.created_at).getTime();
      const cooldownMs = 60 * 1000;
      if (elapsedMs < cooldownMs) {
        const remainingSec = Math.ceil((cooldownMs - elapsedMs) / 1000);
        return {
          success: false,
          error: `Please wait ${remainingSec}s before requesting a new OTP.`,
          cooldownSeconds: remainingSec,
        };
      }
    }

    // 2. Maximum 5 OTP requests per 15 minutes window
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const countRow = await db.queryOne<any>(
      `SELECT COUNT(*) as count FROM admin_otps 
       WHERE LOWER(email) = ? AND created_at > ?`,
      [cleanEmail, fifteenMinsAgo]
    );
    if (countRow && Number(countRow.count) >= 5) {
      return {
        success: false,
        error: 'Too many verification attempts. Please wait 15 minutes before trying again.',
      };
    }
  } catch (err) {
    console.error('Rate limit query warning:', err);
  }

  // Invalidate any previous unused OTPs for this email (ensure new OTP is generated)
  try {
    await db.execute(
      'UPDATE admin_otps SET is_used = 1 WHERE LOWER(email) = ? AND is_used = 0',
      [cleanEmail]
    );
  } catch (err) {
    console.error('Failed to invalidate previous OTPs:', err);
  }

  // Generate secure 6-digit OTP (e.g. 100000 to 999999)
  const otpNumber = crypto.randomInt(100000, 1000000).toString();
  const otpHashed = hashOtp(cleanEmail, otpNumber);
  const otpId = `otp-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes validity

  // Save to database with explicit UTC timestamps
  await db.execute(
    `INSERT INTO admin_otps (id, email, otp_hash, attempts, max_attempts, expires_at, is_used, created_at)
     VALUES (?, ?, ?, 0, 5, ?, 0, ?)`,
    [otpId, cleanEmail, otpHashed, expiresAt.toISOString(), now.toISOString()]
  );

  // Send through EmailJS
  const emailRes = await sendAdminLoginOtpEmail({
    toEmail: cleanEmail,
    otp: otpNumber,
  });

  if (!emailRes.success) {
    // Invalidate if email sending failed
    await db.execute('UPDATE admin_otps SET is_used = 1 WHERE id = ?', [otpId]);
    return {
      success: false,
      error: 'Failed to deliver verification email. Please check your EmailJS service or try again.',
    };
  }

  return {
    success: true,
    expiresInSeconds: 300,
    cooldownSeconds: 60,
  };
}

export interface VerifyOtpResult {
  success: boolean;
  error?: string;
  session?: UserSession;
}

/**
 * Verify OTP entered by admin and return authenticated session
 */
export async function verifyAdminOtp(email: string, enteredOtp: string): Promise<VerifyOtpResult> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = (enteredOtp || '').trim().replace(/[^0-9]/g, '');

  if (cleanOtp.length !== 6) {
    return {
      success: false,
      error: 'Please enter a valid 6-digit verification code.',
    };
  }

  // Retrieve active OTP record
  const otpRecord = await db.queryOne<any>(
    `SELECT * FROM admin_otps 
     WHERE LOWER(email) = ? AND is_used = 0 
     ORDER BY created_at DESC LIMIT 1`,
    [cleanEmail]
  );

  if (!otpRecord) {
    return {
      success: false,
      error: 'No active verification code found. Please request a new OTP.',
    };
  }

  // Check Expiry (5 minutes)
  const expiresTime = new Date(otpRecord.expires_at).getTime();
  if (Date.now() > expiresTime) {
    // Mark as used/expired
    await db.execute('UPDATE admin_otps SET is_used = 1 WHERE id = ?', [otpRecord.id]);
    return {
      success: false,
      error: 'OTP EXPIRED. Please request a new verification code.',
    };
  }

  // Check Maximum Attempts Limit
  const maxAttempts = Number(otpRecord.max_attempts) || 5;
  const currentAttempts = Number(otpRecord.attempts) || 0;
  if (currentAttempts >= maxAttempts) {
    await db.execute('UPDATE admin_otps SET is_used = 1 WHERE id = ?', [otpRecord.id]);
    return {
      success: false,
      error: 'Maximum verification attempts exceeded. Code has been invalidated. Please request a new OTP.',
    };
  }

  // Compare hash
  const expectedHash = otpRecord.otp_hash;
  const givenHash = hashOtp(cleanEmail, cleanOtp);

  if (expectedHash !== givenHash) {
    const nextAttempts = currentAttempts + 1;
    const remaining = maxAttempts - nextAttempts;
    await db.execute('UPDATE admin_otps SET attempts = attempts + 1 WHERE id = ?', [otpRecord.id]);

    if (remaining <= 0) {
      await db.execute('UPDATE admin_otps SET is_used = 1 WHERE id = ?', [otpRecord.id]);
      return {
        success: false,
        error: 'Incorrect OTP. Maximum attempts reached. Please request a new verification code.',
      };
    }

    return {
      success: false,
      error: `Invalid verification code. ${remaining} attempt(s) remaining.`,
    };
  }

  // Success: Mark OTP as used immediately (one-time-use only)
  await db.execute('UPDATE admin_otps SET is_used = 1 WHERE id = ?', [otpRecord.id]);

  // Find or provision authorized user session
  let user = await db.queryOne<any>(
    'SELECT * FROM users WHERE LOWER(email) = ?',
    [cleanEmail]
  );

  if (!user) {
    // Auto-provision authorized admin in users table
    const newUserId = `usr-${Date.now()}`;
    const defaultName = cleanEmail.includes('alook') ? 'Alok Singh' : 'Administrator';
    const role = 'SUPER_ADMIN';

    await db.execute(
      `INSERT INTO users (id, email, password_hash, full_name, role, created_at, updated_at)
       VALUES (?, ?, 'OTP_AUTHENTICATED', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [newUserId, cleanEmail, defaultName, role]
    );

    user = {
      id: newUserId,
      email: cleanEmail,
      full_name: defaultName,
      role,
    };
  }

  const session: UserSession = {
    id: user.id,
    email: user.email,
    full_name: user.full_name || 'Administrator',
    role: user.role || 'SUPER_ADMIN',
  };

  return {
    success: true,
    session,
  };
}
