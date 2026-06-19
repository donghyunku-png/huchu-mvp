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

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return error('인증이 필요합니다.', 401);
    }

    // DB에서 회사의 활성 모듈 조회
    const companyData = await db
      .select({ activeModules: companies.activeModules })
      .from(companies)
      .where(eq(companies.id, user.companyId))
      .limit(1);

    const activeModules = (companyData[0]?.activeModules as string[]) || user.activeModules || ['M01', 'M02', 'M03', 'M04', 'M12', 'M15'];

    return success({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        positionLevel: user.positionLevel,
        companyId: user.companyId,
        departmentId: user.departmentId,
        profileImageUrl: user.profileImageUrl,
      },
      dashboardWidgets: getDashboardWidgets(user.role),
      navigationItems: getNavigationItems(user.role, activeModules),
      activeModules,
    });
  } catch (err) {
    const user = await getCurrentUser();
    if (user) {
      console.warn('GET /api/auth/me DB unavailable; returning signed session data.');
      return success({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          positionLevel: user.positionLevel,
          companyId: user.companyId,
          departmentId: user.departmentId,
          profileImageUrl: user.profileImageUrl,
        },
        dashboardWidgets: getDashboardWidgets(user.role),
        navigationItems: getNavigationItems(user.role, user.activeModules),
        activeModules: user.activeModules,
      });
    }

    console.error('GET /api/auth/me error:', err);
    return error('서버 오류가 발생했습니다.', 500);
  }
}
