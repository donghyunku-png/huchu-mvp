/**
 * POST /api/auth/login
 * 로그인 API - JWT 세션 생성 (Supabase DB 연동)
 */
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { success, error } from '@/lib/api-helpers';
import { createSession } from '@/lib/auth/session';
import { db } from '@/db';
import { users, companies } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getDemoUser } from '@/lib/demo-auth';

export const dynamic = 'force-dynamic';

async function createLoginResponse(user: {
  id: string;
  companyId: string;
  departmentId?: string | null;
  role: string;
  positionLevel?: number | null;
  positionTitle?: string | null;
  reportsTo?: string | null;
  name: string;
  email: string;
  profileImageUrl?: string | null;
  activeModules: string[];
}) {
  const token = await createSession({
    id: user.id,
    companyId: user.companyId,
    departmentId: user.departmentId,
    role: user.role,
    positionLevel: user.positionLevel ?? 1,
    reportsTo: user.reportsTo,
    name: user.name,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    activeModules: user.activeModules,
  });

  return success({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      positionTitle: user.positionTitle,
      positionLevel: user.positionLevel,
      companyId: user.companyId,
      departmentId: user.departmentId,
    },
  });
}

export async function POST(request: NextRequest) {
  let email = '';
  let password = '';

  try {
    const body = await request.json();
    email = body.email;
    password = body.password;

    if (!email || !password) {
      return error('이메일과 비밀번호를 입력해주세요.', 400);
    }

    const demoUser = getDemoUser(email, password);
    if (demoUser) {
      return createLoginResponse(demoUser);
    }

    // DB에서 사용자 조회 (회사 정보 포함)
    const userRows = await db
      .select({
        id: users.id,
        companyId: users.companyId,
        departmentId: users.departmentId,
        email: users.email,
        passwordHash: users.passwordHash,
        name: users.name,
        role: users.role,
        positionLevel: users.positionLevel,
        positionTitle: users.positionTitle,
        reportsTo: users.reportsTo,
        profileImageUrl: users.profileImageUrl,
        status: users.status,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = userRows[0];

    if (!user) {
      return error('이메일 또는 비밀번호가 올바르지 않습니다.', 401);
    }

    if (user.status !== 'active') {
      return error('비활성화된 계정입니다. 관리자에게 문의하세요.', 403);
    }

    // 비밀번호 검증
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, user.passwordHash);
    } catch {
      // bcrypt 형식이 아닌 경우 demo 비밀번호 체크
      isValidPassword = password === '1234';
    }

    if (!isValidPassword) {
      return error('이메일 또는 비밀번호가 올바르지 않습니다.', 401);
    }

    // 회사의 활성 모듈 조회
    const companyRows = await db
      .select({ activeModules: companies.activeModules })
      .from(companies)
      .where(eq(companies.id, user.companyId))
      .limit(1);

    const activeModules = (companyRows[0]?.activeModules as string[]) || ['M01', 'M02', 'M03', 'M04', 'M12', 'M15'];

    // 마지막 로그인 시간 업데이트
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    return createLoginResponse({ ...user, activeModules });
  } catch (err) {
    const demoUser = email && password
      ? getDemoUser(email, password)
      : null;

    if (demoUser) {
      console.warn('Login DB unavailable; using preview demo account fallback.');
      return createLoginResponse(demoUser);
    }

    console.error('Login error:', err);
    return error('로그인 처리 중 오류가 발생했습니다.', 500);
  }
}
