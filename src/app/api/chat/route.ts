/**
 * GET /api/chat - 채팅방 목록 조회 (DB 연동, 사용자가 속한 채팅방만)
 * POST /api/chat - 새 채팅방 생성 (그룹 또는 DM)
 */
import { NextRequest } from 'next/server';
import { success, error, withAuth } from '@/lib/api-helpers';
import { db } from '@/db';
import { chatRooms, chatRoomMembers, messages } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  return withAuth(async (user) => {
    try {
      // 사용자가 속한 채팅방 조회
      const rooms = await db
        .select({
          id: chatRooms.id,
          name: chatRooms.name,
          type: chatRooms.type,
          description: chatRooms.description,
          createdBy: chatRooms.createdBy,
          createdAt: chatRooms.createdAt,
          memberCount: chatRooms.memberCount,
          lastMessageAt: chatRooms.lastMessageAt,
          lastReadAt: chatRoomMembers.lastReadAt,
        })
        .from(chatRooms)
        .innerJoin(
          chatRoomMembers,
          eq(chatRooms.id, chatRoomMembers.roomId)
        )
        .where(eq(chatRoomMembers.userId, user.id))
        .orderBy(desc(chatRooms.lastMessageAt));

      // 각 채팅방별 미읽음 수 계산
      const roomsWithUnread = await Promise.all(
        rooms.map(async (room) => {
          const unreadCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(messages)
            .where(
              sql`${messages.roomId} = ${room.id} AND ${messages.createdAt} > ${room.lastReadAt || new Date(0)}`
            );

          return {
            ...room,
            unreadCount: Number(unreadCount[0]?.count || 0),
          };
        })
      );

      return success({
        rooms: roomsWithUnread,
        total: roomsWithUnread.length,
      });
    } catch (err) {
      console.error('GET /api/chat error:', err);
      return error('채팅방 목록 조회 중 오류가 발생했습니다.', 500);
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await request.json();
      const { name, type, description, memberIds } = body;

      if (!name || !type) {
        return error('채팅방 이름과 타입은 필수입니다.');
      }

      if (type !== 'public_channel' && type !== 'private_channel' && type !== 'dm' && type !== 'group') {
        return error('올바른 타입을 선택하세요: public_channel, private_channel, dm, group');
      }

      const now = new Date();

      // 새 채팅방 생성
      const newRoom = await db
        .insert(chatRooms)
        .values({
          companyId: user.companyId,
          name,
          type,
          description: description || null,
          createdBy: user.id,
          memberCount: (memberIds?.length || 0) + 1, // 생성자 포함
        })
        .returning();

      // 생성자를 멤버로 추가
      await db.insert(chatRoomMembers).values({
        roomId: newRoom[0].id,
        userId: user.id,
        role: 'admin',
        joinedAt: now,
      });

      // 초대된 멤버들 추가
      if (memberIds && memberIds.length > 0) {
        await db.insert(chatRoomMembers).values(
          memberIds.map((memberId: string) => ({
            roomId: newRoom[0].id,
            userId: memberId,
            role: 'member',
            joinedAt: now,
          }))
        );
      }

      return success(
        {
          id: newRoom[0].id,
          name,
          type,
          description: description || null,
          createdBy: user.id,
          createdAt: now.toISOString(),
          memberCount: (memberIds?.length || 0) + 1,
          message: '채팅방이 생성되었습니다.',
        },
        201
      );
    } catch (err) {
      console.error('POST /api/chat error:', err);
      return error('채팅방 생성 중 오류가 발생했습니다.', 500);
    }
  });
}
