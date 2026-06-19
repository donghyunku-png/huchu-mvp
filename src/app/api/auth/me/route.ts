/**
 * GET /api/auth/me
 * 현재 로그인된 사용자 정보 반환 + 회사의 활성 모듈 조회
 */
import { success, error } from '@/lib/api-helpers';
import { getCurrentUser } from '@/lib/auth/session';
import { getDashboardWidgets, getNavigationItems } from '@/lib/auth/rbac';
import { db } from '@/db';
import { companies } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { toCompanyPayload, toUserPayload } from '@/lib/auth/app-session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return error('인증이 필요합니다.', 401);
    }

    // DB에서 회사의 활성 모듈 조회
    const companyData = await db
      .select()
      .from(companies)
      .where(eq(companies.id, user.companyId))
      .limit(1);

    const company = companyData[0];
    if (!company) {
      return error('회사 정보를 찾을 수 없습니다.', 404);
    }

    const activeModules = (company.activeModules as string[]) || user.activeModules;

    return success({
      user: toUserPayload({
        ...user,
        status: 'active',
      }),
      company: toCompanyPayload(company),
      dashboardWidgets: getDashboardWidgets(user.role),
      navigationItems: getNavigationItems(user.role, activeModules),
      activeModules,
    });
  } catch (err) {
    console.error('GET /api/auth/me error:', err);
    return error('서버 오류가 발생했습니다.', 500);
  }
}
