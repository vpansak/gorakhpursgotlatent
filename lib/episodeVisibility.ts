/** Read-only website archive boundary. Original records remain in Neon and full backups. */
export const ACTIVE_EPISODE = 3;
export const WEBSITE_ARCHIVE_BEFORE = '2026-11-04T04:13:28.000Z';
const cutoff = Date.parse(WEBSITE_ARCHIVE_BEFORE);
export function currentEpisodeRows<T extends { created_at?: unknown; updated_at?: unknown }>(rows: T[], category: string): T[] {
  if (category === 'team' || category === 'talentTrip') return rows;
  return rows.filter(row => {
    const value = category === 'computerji' ? (row.updated_at || row.created_at) : row.created_at;
    const time = value instanceof Date ? value.getTime() : Date.parse(String(value || ''));
    return Number.isFinite(time) && time > cutoff;
  });
}
