import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { authOptions } from '@/lib/auth/next-auth';
import { success, error } from '@/lib/api-helpers';
import { db } from '@/db';
import { companies, departments, users } from '@/db/schema';
import { createSignedAppSession, DEFAULT_ACTIVE_MODULES } from '@/lib/auth/app-session';

export const dynamic = 'force-dynamic';

const DEFAULT_STORAGE_LIMIT = 5 * 1024 * 1024 * 1024;

export async function POST(request: Request) {
  const googleSession = await getServerSession(authOptions);
  const email = googleSession?.user?.email;

  if (!email) {
    return error('Google 로그인이 필요합니다.', 401);
  }

  const body = await request.json();
  const companyName = String(body.name ?? '').trim();

  if (!companyName) {
    return error('회사명을 입력해주세요.', 400);
  }

  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return error('이미 등록된 Google 계정입니다. 다시 로그인해주세요.', 409);
  }

  const employeeCount = Number.isFinite(Number(body.employeeCount))
    ? Math.max(1, Number(body.employeeCount))
    : 1;

  const result = await db.transaction(async (tx) => {
    const [company] = await tx
      .insert(companies)
      .values({
        name: companyName,
        businessNumber: body.businessNumber ? String(body.businessNumber).trim() : null,
        representativeName: body.representativeName
          ? String(body.representativeName).trim()
          : googleSession.user?.name ?? null,
        address: body.address ? String(body.address).trim() : null,
        phone: body.phone ? String(body.phone).trim() : null,
        email,
        industry: body.industry ? String(body.industry).trim() : null,
        employeeCount,
        subscriptionPlan: 'free',
        aiTokenLimit: 1000,
        storageLimit: DEFAULT_STORAGE_LIMIT,
        activeModules: DEFAULT_ACTIVE_MODULES,
      })
      .returning();

    const [department] = await tx
      .insert(departments)
      .values({
        companyId: company.id,
        name: '경영진',
        depth: 0,
        sortOrder: 1,
        isActive: true,
      })
      .returning();

    const [user] = await tx
      .insert(users)
      .values({
        companyId: company.id,
        departmentId: department.id,
        email,
        name: googleSession.user?.name || email.split('@')[0],
        profileImageUrl: googleSession.user?.image ?? null,
        authProvider: 'google',
        authProviderId: email,
        role: 'company_owner',
        positionTitle: '대표/관리자',
        positionLevel: 7,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        lastLoginAt: new Date(),
      })
      .returning();

    await tx
      .update(departments)
      .set({ headUserId: user.id })
      .where(eq(departments.id, department.id));

    return { company, user };
  });

  const appSession = await createSignedAppSession(result.user, result.company);

  return success({
    status: 'ready',
    ...appSession,
  }, 201);
}
