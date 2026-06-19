/**
 * GET /api/crm/clients - 고객 목록 조회 (RBAC 범위 적용, DB 연동)
 * POST /api/crm/clients - 새 고객 등록
 */
import { NextRequest } from 'next/server';
import { success, error, withScopedAccess, withAuth } from '@/lib/api-helpers';
import { db } from '@/db';
import { clients, users } from '@/db/schema';
import { eq, and, type SQL } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  return withScopedAccess('crm', 'read', async (user, scope) => {
    try {
      const conditions: SQL[] = [eq(clients.companyId, user.companyId)];

      if (scope.type === 'self') {
        conditions.push(eq(clients.assignedTo, user.id));
      } else if ((scope.type === 'department' || scope.type === 'team') && user.departmentId) {
        conditions.push(eq(users.departmentId, user.departmentId));
      }

      const filtered = await db
        .select({
          id: clients.id,
          name: clients.name,
          type: clients.type,
          industry: clients.industry,
          phone: clients.phone,
          email: clients.email,
          address: clients.address,
          website: clients.website,
          assignedTo: clients.assignedTo,
          assignedName: users.name,
          note: clients.note,
          tags: clients.tags,
          createdAt: clients.createdAt,
        })
        .from(clients)
        .leftJoin(users, eq(clients.assignedTo, users.id))
        .where(and(...conditions));

      const stats = {
        total: filtered.length,
        active: filtered.filter((c) => c.type === 'customer').length,
        potential: filtered.filter((c) => c.type === 'prospect').length,
        partner: filtered.filter((c) => c.type === 'partner').length,
      };

      return success({
        clients: filtered,
        stats,
        scope: scope.type,
      });
    } catch (err) {
      console.error('GET /api/crm/clients error:', err);
      return error('고객 정보 조회 중 오류가 발생했습니다.', 500);
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await request.json();
      const { name, type, industry, email, phone, address, website, note, tags } = body;

      if (!name || !email) {
        return error('고객명과 이메일은 필수입니다.');
      }

      const newClient = await db
        .insert(clients)
        .values({
          companyId: user.companyId,
          name,
          type: type || 'customer',
          industry: industry || null,
          phone: phone || null,
          email,
          address: address || null,
          website: website || null,
          assignedTo: user.id,
          note: note || null,
          tags: tags || [],
        })
        .returning();

      return success(
        {
          id: newClient[0].id,
          name,
          type: type || 'customer',
          assignedTo: user.id,
          createdAt: new Date().toISOString(),
          message: '고객이 등록되었습니다.',
        },
        201
      );
    } catch (err) {
      console.error('POST /api/crm/clients error:', err);
      return error('고객 등록 중 오류가 발생했습니다.', 500);
    }
  });
}
