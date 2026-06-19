/**
 * GET /api/vacations - 휴가 목록 (RBAC 범위 적용, DB 연동)
 * POST /api/vacations - 휴가 신청
 */
import { NextRequest } from 'next/server';
import { success, error, withScopedAccess, withAuth } from '@/lib/api-helpers';
import { db } from '@/db';
import { vacations, vacationBalances, users } from '@/db/schema';
import { eq, and, type SQL } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  return withScopedAccess('vacation', 'read', async (user, scope) => {
    try {
      const currentYear = new Date().getFullYear();

      // 휴가 목록 WHERE 조건
      const vacConditions: SQL[] = [eq(vacations.companyId, user.companyId)];
      if (scope.type === 'self') {
        vacConditions.push(eq(vacations.userId, user.id));
      } else if ((scope.type === 'department' || scope.type === 'team') && user.departmentId) {
        vacConditions.push(eq(users.departmentId, user.departmentId));
      }

      const vacationList = await db
        .select({
          id: vacations.id,
          userId: vacations.userId,
          userName: users.name,
          departmentId: users.departmentId,
          type: vacations.type,
          startDate: vacations.startDate,
          endDate: vacations.endDate,
          days: vacations.days,
          reason: vacations.reason,
          status: vacations.status,
          approverId: vacations.approverId,
        })
        .from(vacations)
        .innerJoin(users, eq(vacations.userId, users.id))
        .where(and(...vacConditions));

      // 잔여 현황 WHERE 조건
      const balConditions: SQL[] = [
        eq(vacationBalances.companyId, user.companyId),
        eq(vacationBalances.year, currentYear),
      ];
      if (scope.type === 'self') {
        balConditions.push(eq(vacationBalances.userId, user.id));
      }

      const balanceList = await db
        .select({
          userId: vacationBalances.userId,
          userName: users.name,
          year: vacationBalances.year,
          totalDays: vacationBalances.totalDays,
          usedDays: vacationBalances.usedDays,
          remainingDays: vacationBalances.remainingDays,
          carriedOverDays: vacationBalances.carriedOverDays,
        })
        .from(vacationBalances)
        .innerJoin(users, eq(vacationBalances.userId, users.id))
        .where(and(...balConditions));

      return success({ vacations: vacationList, balances: balanceList, scope: scope.type });
    } catch (err) {
      console.error('GET /api/vacations error:', err);
      return error('휴가 정보 조회 중 오류가 발생했습니다.', 500);
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await request.json();
      const { type, startDate, endDate, days, reason } = body;

      if (!type || !startDate || !endDate || !days) {
        return error('필수 항목을 입력해주세요.');
      }

      const currentYear = new Date().getFullYear();

      // 잔여 연차 확인
      const balance = await db
        .select({
          id: vacationBalances.id,
          remainingDays: vacationBalances.remainingDays,
        })
        .from(vacationBalances)
        .where(
          and(
            eq(vacationBalances.userId, user.id),
            eq(vacationBalances.year, currentYear),
            eq(vacationBalances.companyId, user.companyId)
          )
        )
        .limit(1);

      if (balance.length === 0) {
        return error('휴가 잔여 현황을 찾을 수 없습니다.');
      }

      const remainingDays = Number(balance[0].remainingDays);
      const requestedDays = Number(days);

      if (remainingDays < requestedDays) {
        return error(`잔여 연차가 부족합니다. (잔여: ${remainingDays}일)`);
      }

      const newVacation = await db
        .insert(vacations)
        .values({
          companyId: user.companyId,
          userId: user.id,
          type,
          startDate,
          endDate,
          days: String(days),
          reason: reason || null,
          status: 'pending',
        })
        .returning();

      return success(
        {
          id: newVacation[0].id,
          userId: user.id,
          type,
          startDate,
          endDate,
          days: Number(days),
          reason,
          status: 'pending',
          message: '휴가 신청이 완료되었습니다.',
        },
        201
      );
    } catch (err) {
      console.error('POST /api/vacations error:', err);
      return error('휴가 신청 중 오류가 발생했습니다.', 500);
    }
  });
}
