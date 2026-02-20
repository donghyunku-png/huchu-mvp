/**
 * GET /api/tasks - 업무 목록 조회 (RBAC 범위 적용, DB 연동)
 * POST /api/tasks - 새 업무 생성
 */
import { NextRequest } from 'next/server';
import { success, error, withScopedAccess, withAuth } from '@/lib/api-helpers';
import { db } from '@/db';
import { tasks, users } from '@/db/schema';
import { eq, and, type SQL } from 'drizzle-orm';

export async function GET() {
  return withScopedAccess('tasks', 'read', async (user, scope) => {
    try {
      // 범위별 WHERE 조건 구성
      const conditions: SQL[] = [eq(tasks.companyId, user.companyId)];

      if (scope.type === 'self') {
        conditions.push(eq(tasks.assigneeId, user.id));
      } else if ((scope.type === 'department' || scope.type === 'team') && user.departmentId) {
        conditions.push(eq(users.departmentId, user.departmentId));
      }

      const filtered = await db
        .select({
          id: tasks.id,
          title: tasks.title,
          description: tasks.description,
          assigneeId: tasks.assigneeId,
          assigneeName: users.name,
          departmentId: users.departmentId,
          status: tasks.status,
          priority: tasks.priority,
          dueDate: tasks.dueDate,
          createdAt: tasks.createdAt,
          createdBy: tasks.createdBy,
        })
        .from(tasks)
        .leftJoin(users, eq(tasks.assigneeId, users.id))
        .where(and(...conditions));

      // 상태별 통계
      const stats = {
        total: filtered.length,
        todo: filtered.filter((t) => t.status === 'todo').length,
        in_progress: filtered.filter((t) => t.status === 'in_progress').length,
        review: filtered.filter((t) => t.status === 'review').length,
        done: filtered.filter((t) => t.status === 'done').length,
      };

      return success({
        tasks: filtered,
        stats,
        scope: scope.type,
      });
    } catch (err) {
      console.error('GET /api/tasks error:', err);
      return error('업무 정보 조회 중 오류가 발생했습니다.', 500);
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await request.json();
      const { title, description, assigneeId, dueDate, priority } = body;

      if (!title || !assigneeId) {
        return error('제목과 할당자는 필수입니다.');
      }

      const assignee = await db
        .select({ name: users.name, departmentId: users.departmentId })
        .from(users)
        .where(eq(users.id, assigneeId))
        .limit(1);

      if (assignee.length === 0) {
        return error('할당자를 찾을 수 없습니다.');
      }

      const newTask = await db
        .insert(tasks)
        .values({
          companyId: user.companyId,
          title,
          description: description || null,
          assigneeId,
          createdBy: user.id,
          dueDate: dueDate || null,
          priority: priority || 'medium',
          status: 'todo',
        })
        .returning();

      return success(
        {
          id: newTask[0].id,
          title,
          description,
          assigneeId,
          assigneeName: assignee[0].name,
          departmentId: assignee[0].departmentId,
          status: 'todo',
          priority: priority || 'medium',
          dueDate,
          createdAt: new Date().toISOString(),
          createdBy: user.id,
        },
        201
      );
    } catch (err) {
      console.error('POST /api/tasks error:', err);
      return error('업무 생성 중 오류가 발생했습니다.', 500);
    }
  });
}
