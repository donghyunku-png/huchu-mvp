/**
 * 후추(Huchu) v4.0 - Session & Authentication
 * JWT 기반 세션 관리 + NextAuth.js 호환
 */
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { UserContext } from './rbac';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'huchu-dev-secret-key-change-in-production'
);

const SESSION_COOKIE_NAME = 'huchu_session';
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload extends UserContext {
  name: string;
  email: string;
  profileImageUrl?: string | null;
  activeModules: string[];
  exp?: number;
  iat?: number;
}

/**
 * JWT 토큰 생성
 */
export async function createToken(payload: Omit<SessionPayload, 'exp' | 'iat'>): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET);
}

/**
 * JWT 토큰 검증 및 디코드
 */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * 세션 쿠키에서 현재 사용자 정보 가져오기
 */
export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * 세션 생성 (로그인 시)
 */
export async function createSession(user: Omit<SessionPayload, 'exp' | 'iat'>): Promise<string> {
  const token = await createToken(user);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION,
  });

  return token;
}

/**
 * 세션 삭제 (로그아웃 시)
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * API 라우트에서 인증된 사용자 정보 가져오기
 * 인증되지 않으면 null 반환
 */
export async function getAuthenticatedUser(): Promise<SessionPayload | null> {
  return getCurrentUser();
}

/**
 * API 라우트에서 인증 필수 체크
 * 인증되지 않으면 에러를 throw
 */
export async function requireAuth(): Promise<SessionPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}
