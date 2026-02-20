/**
 * GET /api/attendance - 출퇴근 목록 조회 (RBAC 범위 적용, DB 연동)
 * POST /api/attendance - 출퇴근 기록 (체크인/체크아웃)
 */
import { NextRequest } from 'next/server';
import { success, withScopedAccess, withAuth, error } from '@/lib/api-helpers';
import { db } from '@/db';
import { attendances, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  return withScopedAccess('attendance', 'read', async (user, scope) => {
    try {
      // 쿼리 파라미터에서 날짜 조회 (기본값: 오늘)
      const today = new Date().toISOString().split('T')[0];

      // 범위에 따른 WHERE 조건 구성
      const conditions = [
        eq(attendances.companyId, user.companyId),
        eq(attendances.date, today),
      ];

      if (scope.type === 'self') {
        conditions.push(eq(attendances.userId, user.id));
      } else if ((scope.type === 'department' || scope.type === 'team') && user.departmentId) {
        conditions.push(eq(users.departmentId, user.departmentId));
      }

      const results = await db
        .select({
          id: attendances.id,
          userId: attendances.userId,
          userName: users.name,
          departmentId: users.departmentId,
          date: attendances.date,
          checkInTime: attendances.checkInTime,
          checkOutTime: attendances.checkOutTime,
          checkInMethod: attendances.checkInMethod,
          checkOutMethod: attendances.checkOutMethod,
          workHours: attendances.workHours,
          status: attendances.status,
        })
        .from(attendances)
        .innerJoin(users, eq(attendances.userId, users.id))
        .where(and(...conditions));

      const summary = {
        total: results.length,
        normal: results.filter((a) => a.status === 'normal').length,
        late: results.filter((a) => a.status === 'late').length,
        working: results.filter((a) => a.status === 'working').length,
        vacation: results.filter((a) => a.status === 'vacation').length,
        absent: results.filter((a) => a.status === 'absent').length,
        overtime: results.filter((a) => a.status === 'overtime').length,
      };

      return success({ attendances: results, summary, scope: scope.type });
    } catch (err) {
      console.error('GET /api/attendance error:', err);
      return error('출퇴근 정보 조회 중 오류가 발생했습니다.', 500);
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await request.json();
      const { type } = body; // 'check_in' or 'check_out'

      if (!type || (type !== 'check_in' && type !== 'check_out')) {
        return error('type은 check_in 또는 check_out이어야 합니다.');
      }

      const now = new Date();
      const today = now.toISOString().split('T')[0];

      // 오늘 기록 조회
      const existing = await db
        .select({ id: attendances.id })
        .from(attendances)
        .where(
          and(
            eq(attendances.userId, user.id),
            eq(attendances.date, today),
            eq(attendances.companyId, user.companyId)
          )
        )
        .limit(1);

      if (type === 'check_in') {
        if (existing.length > 0) {
          return error('오늘 이미 출근 기록이 있습니다.');
        }

        const isLate = now.getHours() >= 9 && now.getMinutes() > 10;
        const newAttendance = await db
          .insert(attendances)
          .values({
            companyId: user.companyId,
            userId: user.id,
            date: today,
            checkInTime: now,
            checkInMethod: 'manual',
            status: isLate ? 'late' : 'normal',
          })
          .returning();

        return success({
          id: newAttendance[0].id,
          userId: user.id,
          date: today,
          checkInTime: now.toISOString(),
          status: isLate ? 'late' : 'normal',
          message: '출근이 기록되었습니다.',
        }, 201);
      }

      // check_out
      if (existing.length === 0) {
        return error('출근 기록이 없습니다. 먼저 출근을 기록해주세요.');
      }

      await db
        .update(attendances)
        .set({
          checkOutTime: now,
          checkOutMethod: 'manual',
          updatedAt: now,
        })
        .where(eq(attendances.id, existing[0].id));

      return success({
        id: existing[0].id,
        userId: user.id,
        date: today,
        checkOutTime: now.toISOString(),
        message: '퇴근이 기록되었습니다.',
      }, 201);
    } catch (err) {
      console.error('POST /api/attendance error:', err);
      return error('출퇴근 기록 중 오류가 발생했습니다.', 500);
    }
  });
}
