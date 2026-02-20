/**
 * GET /api/dashboard - 대시보드 데이터 (역할별 위젯 및 데이터, DB 연동)
 * owner는 전사 통계, employee는 개인 통계
 */
import { success, withAuth } from '@/lib/api-helpers';
import { getDashboardWidgets } from '@/lib/auth/rbac';
import { db } from '@/db';
import { users, departments, attendances, vacationBalances, tasks } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function GET() {
  return withAuth(async (user) => {
    try {
      const widgets = getDashboardWidgets(user.role);
      const today = new Date().toISOString().split('T')[0];
      const currentYear = new Date().getFullYear();

      let dashboardData: Record<string, unknown> = {
        widgets,
        role: user.role,
        lastUpdated: new Date().toISOString(),
      };

      // 역할별 대시보드 데이터
      if (
        ['company_owner', 'company_admin', 'super_admin'].includes(user.role)
      ) {
        // 경영진/관리자: 전사 통계
        const totalEmployeesResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(users)
          .where(
            and(
              eq(users.companyId, user.companyId),
              eq(users.status, 'active')
            )
          );

        const departmentCountResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(departments)
          .where(eq(departments.companyId, user.companyId));

        const todayAttendanceResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(attendances)
          .where(
            and(
              eq(attendances.companyId, user.companyId),
              eq(attendances.date, today)
            )
          );

        const companyStats = {
          totalEmployees: Number(totalEmployeesResult[0]?.count || 0),
          departmentCount: Number(departmentCountResult[0]?.count || 0),
          todayAttendance: Number(todayAttendanceResult[0]?.count || 0),
          attendanceRate: 87.5, // 계산 필요
          pendingApprovals: 0,
        };

        dashboardData = {
          ...dashboardData,
          companyStats,
        };
      } else if (['dept_head', 'team_lead'].includes(user.role)) {
        // 부서장/팀장: 부서 통계
        if (user.departmentId) {
          const deptMembersResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(users)
            .where(
              and(
                eq(users.departmentId, user.departmentId),
                eq(users.status, 'active')
              )
            );

          const deptTodayAttendanceResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(attendances)
            .where(
              and(
                eq(attendances.companyId, user.companyId),
                eq(attendances.date, today)
              )
            );

          const departmentStats = {
            memberCount: Number(deptMembersResult[0]?.count || 0),
            todayAttendance: Number(deptTodayAttendanceResult[0]?.count || 0),
            attendanceRate: 85,
          };

          dashboardData = {
            ...dashboardData,
            departmentStats,
          };
        }
      }

      // 모든 역할에게 본인의 개인 통계 제공
      const userTodayAttendance = await db
        .select({
          checkInTime: attendances.checkInTime,
          checkOutTime: attendances.checkOutTime,
          status: attendances.status,
        })
        .from(attendances)
        .where(
          and(
            eq(attendances.userId, user.id),
            eq(attendances.date, today)
          )
        )
        .limit(1);

      const userTasksResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(
          and(
            eq(tasks.assigneeId, user.id),
            eq(tasks.companyId, user.companyId)
          )
        );

      const userCompletedTasksResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(
          and(
            eq(tasks.assigneeId, user.id),
            eq(tasks.companyId, user.companyId),
            eq(tasks.status, 'done')
          )
        );

      const userVacationBalance = await db
        .select({
          remainingDays: vacationBalances.remainingDays,
        })
        .from(vacationBalances)
        .where(
          and(
            eq(vacationBalances.userId, user.id),
            eq(vacationBalances.year, currentYear)
          )
        )
        .limit(1);

      const personalStats = {
        name: user.name,
        todayAttendance: userTodayAttendance[0] || { status: 'not_checked' },
        assignedTasks: Number(userTasksResult[0]?.count || 0),
        completedTasks: Number(userCompletedTasksResult[0]?.count || 0),
        remainingVacationDays: Number(
          userVacationBalance[0]?.remainingDays || 0
        ),
      };

      dashboardData = {
        ...dashboardData,
        personalStats,
      };

      return success(dashboardData);
    } catch (err) {
      console.error('GET /api/dashboard error:', err);
      return success({
        widgets: getDashboardWidgets(user.role),
        role: user.role,
        error: 'Dashboard data partially unavailable',
      });
    }
  });
}
