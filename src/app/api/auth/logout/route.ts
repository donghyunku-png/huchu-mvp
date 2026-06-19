import { success } from '@/lib/api-helpers';
import { deleteSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  await deleteSession();
  return success({ message: '로그아웃 되었습니다.' });
}
