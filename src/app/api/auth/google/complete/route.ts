import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { authOptions } from '@/lib/auth/next-auth';
import { success, error } from '@/lib/api-helpers';
import { db } from '@/db';
import { companies, users } from '@/db/schema';
import { createSignedAppSession } from '@/lib/auth/app-session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const googleSession = await getServerSession(authOptions);
  const email = googleSession?.user?.email;

  if (!email) {
    return error('Google 로그인이 필요합니다.', 401);
  }

  const rows = await db
    .select({
      user: {
        id: users.id,
        companyId: users.companyId,
        departmentId: users.departmentId,
        email: users.email,
        name: users.name,
        role: users.role,
        positionLevel: users.positionLevel,
        positionTitle: users.positionTitle,
        reportsTo: users.reportsTo,
        profileImageUrl: users.profileImageUrl,
        status: users.status,
      },
      company: {
        id: companies.id,
        name: companies.name,
        businessNumber: companies.businessNumber,
        representativeName: companies.representativeName,
        address: companies.address,
        phone: companies.phone,
        industry: companies.industry,
        employeeCount: companies.employeeCount,
        subscriptionPlan: companies.subscriptionPlan,
        logoUrl: companies.logoUrl,
        aiTokenLimit: companies.aiTokenLimit,
        storageLimit: companies.storageLimit,
        activeModules: companies.activeModules,
      },
    })
    .from(users)
    .innerJoin(companies, eq(users.companyId, companies.id))
    .where(eq(users.email, email))
    .limit(1);

  const existing = rows[0];
  if (!existing) {
    return success({
      status: 'needs_company',
      googleUser: {
        name: googleSession.user?.name ?? '',
        email,
        image: googleSession.user?.image ?? '',
      },
    });
  }

  if (existing.user.status !== 'active') {
    return error('비활성화된 계정입니다. 관리자에게 문의하세요.', 403);
  }

  await db
    .update(users)
    .set({
      lastLoginAt: new Date(),
      authProvider: 'google',
      authProviderId: email,
      profileImageUrl: existing.user.profileImageUrl ?? googleSession.user?.image ?? null,
    })
    .where(eq(users.id, existing.user.id));

  const appSession = await createSignedAppSession(
    {
      ...existing.user,
      profileImageUrl: existing.user.profileImageUrl ?? googleSession.user?.image ?? null,
    },
    existing.company,
  );

  return success({
    status: 'ready',
    ...appSession,
  });
}
