/**
 * GET /api/notifications - 알림 목록 (항상 본인 것만, DB 연동)
 * PATCH /api/notifications - 알림 읽음 처리
 */
import { NextRequest } from 'next/server';
import { success, error, withAuth } from '@/lib/api-helpers';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  return withAuth(async (user) => {
    try {
      // 항상 본인의 알림만 반환 (RBAC self-scoped)
      const notificationList = await db
        .select({
          id: notifications.id,
          userId: notifications.userId,
          title: notifications.title,
          content: notifications.content,
          type: notifications.type,
          link: notifications.link,
          isRead: notifications.isRead,
          createdAt: notifications.createdAt,
        })
        .from(notifications)
        .where(eq(notifications.userId, user.id))
        .orderBy(desc(notifications.createdAt));

      const stats = {
        total: notificationList.length,
        unread: notificationList.filter((n) => !n.isRead).length,
      };

      return success({
        notifications: notificationList,
        stats,
      });
    } catch (err) {
      console.error('GET /api/notifications error:', err);
      return error('알림 조회 중 오류가 발생했습니다.', 500);
    }
  });
}

export async function PATCH(request: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await request.json();
      const { notificationId, isRead } = body;

      if (!notificationId) {
        return error('알림 ID는 필수입니다.');
      }

      // 알림이 본인의 것인지 확인
      const notification = await db
        .select({ id: notifications.id })
        .from(notifications)
        .where(
          eq(notifications.id, notificationId) &&
          eq(notifications.userId, user.id)
        )
        .limit(1);

      if (notification.length === 0) {
        return error('알림을 찾을 수 없습니다.');
      }

      // 알림 상태 업데이트
      await db
        .update(notifications)
        .set({ isRead: isRead ?? true })
        .where(eq(notifications.id, notificationId));

      return success({
        id: notificationId,
        isRead: isRead ?? true,
        message: '알림이 업데이트되었습니다.',
      });
    } catch (err) {
      console.error('PATCH /api/notifications error:', err);
      return error('알림 업데이트 중 오류가 발생했습니다.', 500);
    }
  });
}
