/**
 * GET /api/crm/deals - 영업 기회(딜) 조회 (RBAC 범위 적용, DB 연동)
 * POST /api/crm/deals - 새 딜 생성
 */
import { NextRequest } from 'next/server';
import { success, error, withScopedAccess, withAuth } from '@/lib/api-helpers';
import { db } from '@/db';
import { deals, clients, users } from '@/db/schema';
import { eq, and, type SQL } from 'drizzle-orm';

// 딜 스테이지 파이프라인
const DEAL_STAGES = [
  { stage: 'lead', label: '리드', order: 1 },
  { stage: 'qualified', label: '검증됨', order: 2 },
  { stage: 'proposal', label: '제안', order: 3 },
  { stage: 'negotiation', label: '협상', order: 4 },
  { stage: 'closed_won', label: '성약', order: 5 },
  { stage: 'closed_lost', label: '실패', order: 6 },
];

export async function GET() {
  return withScopedAccess('crm', 'read', async (user, scope) => {
    try {
      const conditions: SQL[] = [eq(deals.companyId, user.companyId)];

      if (scope.type === 'self') {
        conditions.push(eq(deals.assignedTo, user.id));
      } else if ((scope.type === 'department' || scope.type === 'team') && user.departmentId) {
        conditions.push(eq(users.departmentId, user.departmentId));
      }

      const filtered = await db
        .select({
          id: deals.id,
          title: deals.title,
          clientId: deals.clientId,
          clientName: clients.name,
          stage: deals.stage,
          amount: deals.amount,
          probability: deals.probability,
          expectedCloseDate: deals.expectedCloseDate,
          assignedTo: deals.assignedTo,
          ownerName: users.name,
          note: deals.note,
          createdAt: deals.createdAt,
        })
        .from(deals)
        .leftJoin(clients, eq(deals.clientId, clients.id))
        .leftJoin(users, eq(deals.assignedTo, users.id))
        .where(and(...conditions));

      // 파이프라인 뷰
      const pipeline = DEAL_STAGES.map((stage) => ({
        ...stage,
        deals: filtered.filter((d) => d.stage === stage.stage),
        totalValue: filtered
          .filter((d) => d.stage === stage.stage)
          .reduce((sum, d) => sum + Number(d.amount || 0), 0),
        count: filtered.filter((d) => d.stage === stage.stage).length,
      }));

      const stats = {
        total: filtered.length,
        totalPipeline: filtered.reduce((sum, d) => sum + Number(d.amount || 0), 0),
        avgProbability:
          filtered.length > 0
            ? Math.round(
                filtered.reduce((sum, d) => sum + (d.probability || 0), 0) /
                  filtered.length
              )
            : 0,
        stageBreakdown: pipeline,
      };

      return success({
        deals: filtered,
        pipeline,
        stats,
        scope: scope.type,
      });
    } catch (err) {
      console.error('GET /api/crm/deals error:', err);
      return error('딜 정보 조회 중 오류가 발생했습니다.', 500);
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await request.json();
      const { title, clientId, stage, amount, probability, expectedCloseDate, note } = body;

      if (!title || !clientId || !amount) {
        return error('제목, 고객ID, 금액은 필수입니다.');
      }

      const clientData = await db
        .select({ name: clients.name })
        .from(clients)
        .where(eq(clients.id, clientId))
        .limit(1);

      if (clientData.length === 0) {
        return error('고객을 찾을 수 없습니다.');
      }

      const newDeal = await db
        .insert(deals)
        .values({
          companyId: user.companyId,
          clientId,
          title,
          amount: String(amount),
          stage: stage || 'lead',
          probability: probability || 0,
          expectedCloseDate: expectedCloseDate || null,
          assignedTo: user.id,
          note: note || null,
        })
        .returning();

      return success(
        {
          id: newDeal[0].id,
          title,
          clientName: clientData[0].name,
          stage: stage || 'lead',
          amount,
          assignedTo: user.id,
          createdAt: new Date().toISOString(),
          message: '딜이 생성되었습니다.',
        },
        201
      );
    } catch (err) {
      console.error('POST /api/crm/deals error:', err);
      return error('딜 생성 중 오류가 발생했습니다.', 500);
    }
  });
}
