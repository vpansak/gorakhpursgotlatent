import { getSession } from '@/lib/auth';
import AdminOtpLogin from '@/components/AdminOtpLogin';
import TalentTripAdminClient from '@/components/TalentTripAdminClient';

export const dynamic = 'force-dynamic';

export default async function TalentTripAdminPage() {
  const session = await getSession();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.role)) return <AdminOtpLogin />;
  return <TalentTripAdminClient />;
}
