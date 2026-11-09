import { getSession } from '@/lib/auth';
import { scopedSession } from '@/lib/scopedSession';
export async function hasOperatorAccess(): Promise<boolean> {
  const user = await getSession();
  return Boolean(user && ['SUPER_ADMIN','ADMIN','STAFF'].includes(user.role)) || Boolean(await scopedSession('computerji'));
}
