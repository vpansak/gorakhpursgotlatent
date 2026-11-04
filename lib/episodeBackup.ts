import { deflateRawSync } from 'node:zlib';
import { createHash } from 'node:crypto';

export const BACKUP_GROUPS = [
  { folder: '01-Performers', table: 'performer_applications', expected: 113, keepOnWebsite: false },
  { folder: '02-Booked-Tickets', table: 'tickets', expected: 11, keepOnWebsite: false },
  { folder: '03-Sponsors', table: 'sponsor_applications', expected: 2, keepOnWebsite: false },
  { folder: '04-Join-Team', table: 'team_applications', expected: null, keepOnWebsite: true },
  { folder: '05-Judges-and-VIP', table: 'guest_applications', expected: 3, keepOnWebsite: false },
  { folder: '06-GGL-Talent-Trip', table: 'ggl_talent_trip_registrations', expected: 8, keepOnWebsite: true },
  { folder: '07-Computer-Ji', table: 'computerji_scores', expected: 9, keepOnWebsite: false },
  { folder: '08-Leads', table: 'abandoned_leads', expected: 385, keepOnWebsite: false },
] as const;
export const BACKUP_RELATED_TABLES = ['performer_details', 'performer_payment_links', 'guest_payment_links', 'ticket_application', 'orders', 'order_items', 'payments', 'application_status_history', 'ggl_talent_trip_documents'] as const;

export function backupCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
  // CSV is for safe viewing. JSON retains the byte-for-byte values, including formula-like text.
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}
export function backupCsv(rows: Record<string, unknown>[], columns?: string[]) {
  const keys = columns || [...new Set(rows.flatMap(row => Object.keys(row)))];
  const quote = (v: string) => '"' + v.replace(/"/g, '""') + '"';
  return '\uFEFF' + [keys.map(quote).join(','), ...rows.map(row => keys.map(key => quote(backupCell(row[key]))).join(','))].join('\r\n');
}
export function crc32(bytes: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of bytes) { crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
  return (crc ^ 0xffffffff) >>> 0;
}
export function backupZip(files: { name: string; data: Buffer }[]): Buffer {
  const chunks: Buffer[] = []; const directory: Buffer[] = []; let offset = 0;
  for (const file of files) {
    const name = Buffer.from(file.name, 'utf8'); const packed = deflateRawSync(file.data); const checksum = crc32(file.data);
    const header = Buffer.alloc(30); header.writeUInt32LE(0x04034b50); header.writeUInt16LE(20, 4); header.writeUInt16LE(0x800, 6); header.writeUInt16LE(8, 8); header.writeUInt32LE(checksum, 14); header.writeUInt32LE(packed.length, 18); header.writeUInt32LE(file.data.length, 22); header.writeUInt16LE(name.length, 26);
    chunks.push(header, name, packed);
    const central = Buffer.alloc(46); central.writeUInt32LE(0x02014b50); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x800, 8); central.writeUInt16LE(8, 10); central.writeUInt32LE(checksum, 16); central.writeUInt32LE(packed.length, 20); central.writeUInt32LE(file.data.length, 24); central.writeUInt16LE(name.length, 28); central.writeUInt32LE(offset, 42);
    directory.push(central, name); offset += header.length + name.length + packed.length;
  }
  const directoryBytes = Buffer.concat(directory); const end = Buffer.alloc(22); end.writeUInt32LE(0x06054b50); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10); end.writeUInt32LE(directoryBytes.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...chunks, directoryBytes, end]);
}
export function fileHash(data: Buffer) { return createHash('sha256').update(data).digest('hex'); }
