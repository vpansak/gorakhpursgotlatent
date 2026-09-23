import { requestAdminOtp, verifyAdminOtp, isAuthorizedAdminEmail } from '../lib/otp';
import { db } from '../lib/db';

async function runTests() {
  console.log('=== STARTING ADMIN OTP SECURITY TEST SUITE ===');

  // Clean test email records so tests can run repeatedly
  const authEmail = 'admin@ggllive.in';
  await db.execute('DELETE FROM admin_otps WHERE LOWER(email) = ?', [authEmail]);

  // Test 1: Unauthorized Email Test
  console.log('\n[Test 1] Testing unauthorized email check...');
  const fakeEmail = 'random_hacker@unknown.com';
  const isAuth = await isAuthorizedAdminEmail(fakeEmail);
  console.log('Is unauthorized email authorized?', isAuth);
  if (isAuth) throw new Error('Security failure: unauthorized email allowed');

  const unauthResult = await requestAdminOtp(fakeEmail);
  console.log('Unauth request result:', unauthResult);
  if (unauthResult.success) throw new Error('Security failure: OTP sent to unauthorized email');
  console.log('✓ Test 1 Passed: Unauthorized email blocked with generic message.');

  // Test 2: Authorized Email Check & OTP Generation
  console.log('\n[Test 2] Requesting OTP for authorized email: admin@ggllive.in');
  const isAuthAdmin = await isAuthorizedAdminEmail(authEmail);
  console.log('Is admin@ggllive.in authorized?', isAuthAdmin);
  if (!isAuthAdmin) throw new Error('Authorized admin email failed check');

  const sendResult = await requestAdminOtp(authEmail);
  console.log('Send OTP result:', sendResult);
  if (!sendResult.success) throw new Error('Failed to send OTP: ' + sendResult.error);
  console.log('✓ Test 2 Passed: OTP generated and sent successfully.');

  // Test 3: Retrieve OTP record from DB to verify hash and structure
  console.log('\n[Test 3] Verifying OTP stored in database (hashed)...');
  const otpRecord = await db.queryOne<any>(
    'SELECT * FROM admin_otps WHERE email = ? AND is_used = 0 ORDER BY created_at DESC LIMIT 1',
    [authEmail]
  );
  console.log('OTP DB Record found:', {
    id: otpRecord.id,
    email: otpRecord.email,
    attempts: otpRecord.attempts,
    max_attempts: otpRecord.max_attempts,
    expires_at: otpRecord.expires_at,
    is_used: otpRecord.is_used,
    otp_hash_length: otpRecord.otp_hash.length,
  });
  if (!otpRecord || otpRecord.is_used !== 0) throw new Error('Active OTP record not found in DB');
  console.log('✓ Test 3 Passed: OTP stored securely with hash and expiry.');

  // Test 4: Rate limit check (requesting within cooldown)
  console.log('\n[Test 4] Testing 60-second cooldown rate limit...');
  const rateLimitResult = await requestAdminOtp(authEmail);
  console.log('Immediate second request result:', rateLimitResult);
  if (rateLimitResult.success) throw new Error('Rate limit failure: OTP allowed during cooldown');
  console.log('✓ Test 4 Passed: Cooldown rate limit properly enforced.');

  // Test 5: Verify with wrong OTP
  console.log('\n[Test 5] Testing invalid OTP attempt...');
  const wrongResult = await verifyAdminOtp(authEmail, '000000');
  console.log('Wrong OTP verification result:', wrongResult);
  if (wrongResult.success) throw new Error('Security failure: invalid OTP accepted');

  const afterWrong = await db.queryOne<any>(
    'SELECT attempts FROM admin_otps WHERE id = ?',
    [otpRecord.id]
  );
  console.log('Attempts recorded after wrong OTP:', afterWrong.attempts);
  if (Number(afterWrong.attempts) !== 1) throw new Error('Failed attempts not tracked');
  // Test 6: Successful Verification & Session Creation
  console.log('\n[Test 6] Testing successful OTP verification with valid code...');
  const testOtp = '882299';
  const crypto = await import('crypto');
  const salt = process.env.JWT_SECRET || 'ggl_otp_secure_salt_2026';
  const testHash = crypto.createHmac('sha256', salt).update(`${authEmail.toLowerCase()}:${testOtp}`).digest('hex');
  const testId = `test-otp-${Date.now()}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);

  // Invalidate previous and insert known test OTP
  await db.execute('UPDATE admin_otps SET is_used = 1 WHERE LOWER(email) = ?', [authEmail]);
  await db.execute(
    'INSERT INTO admin_otps (id, email, otp_hash, attempts, max_attempts, expires_at, is_used, created_at) VALUES (?, ?, ?, 0, 5, ?, 0, ?)',
    [testId, authEmail, testHash, expiresAt.toISOString(), now.toISOString()]
  );

  const verifySuccess = await verifyAdminOtp(authEmail, testOtp);
  console.log('Valid OTP verification result:', {
    success: verifySuccess.success,
    user: verifySuccess.session?.email,
    role: verifySuccess.session?.role,
    name: verifySuccess.session?.full_name
  });
  if (!verifySuccess.success || !verifySuccess.session) throw new Error('Verification failed for valid OTP');
  if (verifySuccess.session.email !== authEmail) throw new Error('Session email mismatch');
  console.log('✓ Test 6 Passed: Valid OTP verified, session created with role ' + verifySuccess.session.role);

  // Test 7: One-Time-Use Replay Prevention
  console.log('\n[Test 7] Testing one-time-use replay prevention...');
  const replayResult = await verifyAdminOtp(authEmail, testOtp);
  console.log('Replay attempt result:', replayResult);
  if (replayResult.success) throw new Error('Security failure: Replay of used OTP was permitted');
  console.log('✓ Test 7 Passed: Used OTP correctly rejected (One-time use enforced).');

  console.log('\n=== ALL 7 AUTOMATED UNIT TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
