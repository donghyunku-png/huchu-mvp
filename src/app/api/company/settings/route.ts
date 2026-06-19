import { eq } from 'drizzle-orm';
import { success, error, withAuth } from '@/lib/api-helpers';
import { db } from '@/db';
import { companies } from '@/db/schema';
import { toCompanyPayload } from '@/lib/auth/app-session';

export const dynamic = 'force-dynamic';

export async function GET() {
  return withAuth(async (user) => {
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, user.companyId))
      .limit(1);

    if (!company) return error('회사 정보를 찾을 수 없습니다.', 404);
    return success({ company: toCompanyPayload(company) });
  });
}

export async function POST(request: Request) {
  return withAuth(async (user) => {
    if (!['company_owner', 'company_admin', 'super_admin'].includes(user.role)) {
      return error('회사 설정 권한이 없습니다.', 403);
    }

    const body = await request.json();
    const name = String(body.name ?? '').trim();
    if (!name) return error('회사명을 입력해주세요.', 400);

    const employeeCount = Number.isFinite(Number(body.employeeCount))
      ? Math.max(1, Number(body.employeeCount))
      : undefined;

    const [company] = await db
      .update(companies)
      .set({
        name,
        businessNumber: body.businessNumber ? String(body.businessNumber).trim() : null,
        representativeName: body.representative ? String(body.representative).trim() : null,
        address: body.address ? String(body.address).trim() : null,
        phone: body.phone ? String(body.phone).trim() : null,
        industry: body.industry ? String(body.industry).trim() : null,
        employeeCount,
        updatedAt: new Date(),
      })
      .where(eq(companies.id, user.companyId))
      .returning();

    return success({ company: toCompanyPayload(company) });
  });
}
