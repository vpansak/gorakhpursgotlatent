import crypto from 'crypto';

export function generateAppId(prefix: 'PER' | 'GST' | 'SPN' | 'EVT'): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `GGL-${year}-${randomNum}`;
}

export function generatePerformerAppId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `GGL-${year}-${randomNum}`;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const randomStr = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `GGL-ORD-${timestamp}-${randomStr}`;
}

export function generateTicketNumber(): string {
  const randomStr = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `GGL-TKT-${randomStr}`;
}

export function generateQrHash(ticketNumber: string, orderId: string): string {
  return crypto.createHash('sha256').update(`${ticketNumber}:${orderId}:${Date.now()}`).digest('hex');
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function validateFileUpload(file: File, allowedTypes: string[], maxMB: number = 10): { valid: boolean; error?: string } {
  if (!file) return { valid: false, error: 'No file provided' };
  
  if (file.size > maxMB * 1024 * 1024) {
    return { valid: false, error: `File size exceeds maximum allowed size of ${maxMB}MB` };
  }

  const mime = file.type.toLowerCase();
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  const isValidType = allowedTypes.some(type => {
    if (type.startsWith('.')) return `.${ext}` === type.toLowerCase();
    return mime.includes(type.toLowerCase());
  });

  if (!isValidType) {
    return { valid: false, error: `Invalid file type. Allowed formats: ${allowedTypes.join(', ')}` };
  }

  return { valid: true };
}
