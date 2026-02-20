/**
 * GET /api/departments - 부서 목록 및 트리 구조 조회 (DB 연동)
 */
import { success, withAuth } from '@/lib/api-helpers';
import { db } from '@/db';
import { departments, users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

// 부서 트리 구조 생성
function buildDepartmentTree(deptList: Record<string, unknown>[]) {
  const tree = deptList
    .filter((dept) => dept.parentId === null)
    .map((rootDept) => ({
      ...rootDept,
      children: deptList
        .filter((dept) => dept.parentId === rootDept.id)
        .map((childDept) => ({
          ...childDept,
          children: [],
        })),
    }));

  return tree;
}

export async function GET() {
  return withAuth(async (user) => {
    try {
      // 부서 목록 조회 (부서장 정보 포함)
      const deptList = await db
        .select({
          id: departments.id,
          name: departments.name,
          parentId: departments.parentId,
          headUserId: departments.headUserId,
          headName: users.name,
          isActive: departments.isActive,
          depth: departments.depth,
          createdAt: departments.createdAt,
        })
        .from(departments)
        .leftJoin(users, eq(departments.headUserId, users.id))
        .where(eq(departments.companyId, user.companyId));

      // 각 부서의 멤버 수 계산
      const deptWithMemberCount = await Promise.all(
        deptList.map(async (dept) => {
          const memberCountResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(users)
            .where(
              eq(users.departmentId, dept.id)
            );

          return {
            ...dept,
            memberCount: Number(memberCountResult[0]?.count || 0),
          };
        })
      );

      // 부서 트리 구조로 반환
      const tree = buildDepartmentTree(deptWithMemberCount);

      return success({
        departments: deptWithMemberCount,
        tree,
        total: deptWithMemberCount.length,
      });
    } catch (err) {
      console.error('GET /api/departments error:', err);
      return success({
        departments: [],
        tree: [],
        total: 0,
        error: '부서 정보 조회 중 오류가 발생했습니다.',
      });
    }
  });
}
