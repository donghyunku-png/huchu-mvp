import { eq } from 'drizzle-orm';
import { success, withAuth } from '@/lib/api-helpers';
import { db } from '@/db';
import { users } from '@/db/schema';
import { toUserPayload } from '@/lib/auth/app-session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return withAuth(async (sessionUser) => {
    const body = await request.json();
    const name = String(body.name ?? sessionUser.name).trim();
    const positionTitle = body.position ? String(body.position).trim() : null;

    const [user] = await db
      .update(users)
      .set({
        name,
        positionTitle,
        updatedAt: new Date(),
      })
      .where(eq(users.id, sessionUser.id))
      .returning();

    return success({ user: toUserPayload(user) });
  });
}
