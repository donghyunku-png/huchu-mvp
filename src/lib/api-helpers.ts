/**
 * API Route Helper Functions
 */
import { NextResponse } from 'next/server';
import { getCurrentUser, type SessionPayload } from './auth/session';
import { hasPermission, getScopeFilter, type ResourceAction } from './auth/rbac';

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

/**
 * 인증 + 권한 체크를 포함한 API 핸들러 래퍼
 */
export async function withAuth(
  handler: (user: SessionPayload) => Promise<NextResponse>,
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return error('인증이 필요합니다.', 401);
    }
    return handler(user);
  } catch (err) {
    console.error('API Error:', err);
    return error('서버 오류가 발생했습니다.', 500);
  }
}

/**
 * 인증 + 특정 리소스/액션 권한 체크
 */
export async function withPermission(
  resource: string,
  action: ResourceAction,
  handler: (user: SessionPayload) => Promise<NextResponse>,
): Promise<NextResponse> {
  return withAuth(async (user) => {
    if (!hasPermission(user, { resource, action })) {
      return error('접근 권한이 없습니다.', 403);
    }
    return handler(user);
  });
}

/**
 * 범위 필터링된 API 핸들러
 */
export async function withScopedAccess(
  resource: string,
  action: ResourceAction,
  handler: (
    user: SessionPayload,
    scope: ReturnType<typeof getScopeFilter>,
  ) => Promise<NextResponse>,
): Promise<NextResponse> {
  return withAuth(async (user) => {
    if (!hasPermission(user, { resource, action })) {
      return error('접근 권한이 없습니다.', 403);
    }
    const scope = getScopeFilter(user, resource);
    return handler(user, scope);
  });
}
