/**
 * GET /api/chat/[roomId]/messages - 특정 채팅방의 메시지 조회 (DB 연동)
 * POST /api/chat/[roomId]/messages - 새 메시지 전송
 */
import { NextRequest } from 'next/server';
import { success, error, withAuth } from '@/lib/api-helpers';
import { db } from '@/db';
import { messages, users, chatRoomMembers } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  return withAuth(async (user) => {
    try {
      const { roomId } = await params;

      // 쿼리 파라미터로 페이지네이션 지원
      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = parseInt(url.searchParams.get('offset') || '0');

      // 사용자가 해당 채팅방에 속해있는지 확인
      const membership = await db
        .select({ id: chatRoomMembers.id })
        .from(chatRoomMembers)
        .where(
          eq(chatRoomMembers.roomId, roomId) &&
          eq(chatRoomMembers.userId, user.id)
        )
        .limit(1);

      if (membership.length === 0) {
        return error('채팅방 접근 권한이 없습니다.', 403);
      }

      // 메시지 조회 (최신순, 페이지네이션 적용)
      const result = await db
        .select({
          id: messages.id,
          roomId: messages.roomId,
          senderId: messages.senderId,
          senderName: users.name,
          content: messages.content,
          type: messages.type,
          timestamp: messages.createdAt,
          fileUrl: messages.fileUrl,
          fileName: messages.fileName,
          isPinned: messages.isPinned,
          isEdited: messages.isEdited,
        })
        .from(messages)
        .leftJoin(users, eq(messages.senderId, users.id))
        .where(eq(messages.roomId, roomId))
        .orderBy(desc(messages.createdAt))
        .limit(limit)
        .offset(offset);

      // 메시지 목록 역순으로 정렬 (오래된 것부터)
      result.reverse();

      // 총 메시지 수
      const countResult = await db
        .select({ count: messages.id })
        .from(messages)
        .where(eq(messages.roomId, roomId));

      const total = countResult.length;

      return success({
        roomId,
        messages: result,
        total,
        limit,
        offset,
      });
    } catch (err) {
      console.error('GET /api/chat/[roomId]/messages error:', err);
      return error('메시지 조회 중 오류가 발생했습니다.', 500);
    }
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  return withAuth(async (user) => {
    try {
      const { roomId } = await params;
      const body = await request.json();
      const { content, type } = body;

      if (!content) {
        return error('메시지는 필수입니다.');
      }

      // 사용자가 해당 채팅방에 속해있는지 확인
      const membership = await db
        .select({ id: chatRoomMembers.id })
        .from(chatRoomMembers)
        .where(
          eq(chatRoomMembers.roomId, roomId) &&
          eq(chatRoomMembers.userId, user.id)
        )
        .limit(1);

      if (membership.length === 0) {
        return error('채팅방 접근 권한이 없습니다.', 403);
      }

      const now = new Date();

      // 새 메시지 저장
      const newMessage = await db
        .insert(messages)
        .values({
          roomId,
          senderId: user.id,
          content,
          type: (type || 'text') as 'text' | 'file' | 'image' | 'system' | 'ai_response',
        })
        .returning();

      return success(
        {
          id: newMessage[0].id,
          roomId,
          senderId: user.id,
          senderName: user.name,
          content,
          type: type || 'text',
          timestamp: now.toISOString(),
          message: '메시지가 전송되었습니다.',
        },
        201
      );
    } catch (err) {
      console.error('POST /api/chat/[roomId]/messages error:', err);
      return error('메시지 전송 중 오류가 발생했습니다.', 500);
    }
  });
}
