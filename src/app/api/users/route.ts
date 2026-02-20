/**
 * GET /api/users - 사용자 목록 조회 (RBAC 범위 적용, DB 연동)
 */
import { success, withScopedAccess } from '@/lib/api-helpers';
import { db } from '@/db';
import { users, departments } from '@/db/schema';
import { eq, and, type SQL } from 'drizzle-orm';

export async function GET() {
  return withScopedAccess('organization', 'read', async (user, scope) => {
    try {
      const conditions: SQL[] = [eq(users.companyId, user.companyId)];

      if (scope.type === 'self') {
        conditions.push(eq(users.id, user.id));
      } else if ((scope.type === 'team' || scope.type === 'department') && user.departmentId) {
        conditions.push(eq(users.departmentId, user.departmentId));
      }

      const filtered = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          departmentId: users.departmentId,
          departmentName: departments.name,
          positionTitle: users.positionTitle,
          positionLevel: users.positionLevel,
          status: users.status,
          joinDate: users.joinDate,
          profileImageUrl: users.profileImageUrl,
        })
        .from(users)
        .leftJoin(departments, eq(users.departmentId, departments.id))
        .where(and(...conditions));

      return success({
        users: filtered,
        total: filtered.length,
        scope: scope.type,
      });
    } catch (err) {
      console.error('GET /api/users error:', err);
      return success({
        users: [],
        total: 0,
        scope: scope.type,
      });
    }
  });
}
