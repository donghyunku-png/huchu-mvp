import type { SessionPayload } from '@/lib/auth/session';

type DemoUser = Omit<SessionPayload, 'exp' | 'iat'> & {
  positionTitle: string;
  password: string;
};

const DEMO_COMPANY_ID = '00000000-0000-4000-8000-000000000001';
const DEMO_ACTIVE_MODULES = ['M01', 'M02', 'M03', 'M04', 'M06', 'M12', 'M15'];

const demoUsers: Record<string, DemoUser> = {
  'ceo@forlena.com': {
    id: '00000000-0000-4000-8000-000000000201',
    companyId: DEMO_COMPANY_ID,
    departmentId: '00000000-0000-4000-8000-000000000101',
    role: 'company_owner',
    positionLevel: 7,
    reportsTo: null,
    name: '김대표',
    email: 'ceo@forlena.com',
    profileImageUrl: null,
    activeModules: DEMO_ACTIVE_MODULES,
    positionTitle: '대표이사',
    password: '1234',
  },
  'manager@forlena.com': {
    id: '00000000-0000-4000-8000-000000000202',
    companyId: DEMO_COMPANY_ID,
    departmentId: '00000000-0000-4000-8000-000000000104',
    role: 'company_admin',
    positionLevel: 5,
    reportsTo: '00000000-0000-4000-8000-000000000201',
    name: '정매니저',
    email: 'manager@forlena.com',
    profileImageUrl: null,
    activeModules: DEMO_ACTIVE_MODULES,
    positionTitle: '운영매니저',
    password: '1234',
  },
  'lead@forlena.com': {
    id: '00000000-0000-4000-8000-000000000203',
    companyId: DEMO_COMPANY_ID,
    departmentId: '00000000-0000-4000-8000-000000000103',
    role: 'team_lead',
    positionLevel: 4,
    reportsTo: '00000000-0000-4000-8000-000000000201',
    name: '이팀장',
    email: 'lead@forlena.com',
    profileImageUrl: null,
    activeModules: DEMO_ACTIVE_MODULES,
    positionTitle: '팀장',
    password: '1234',
  },
  'staff@forlena.com': {
    id: '00000000-0000-4000-8000-000000000204',
    companyId: DEMO_COMPANY_ID,
    departmentId: '00000000-0000-4000-8000-000000000103',
    role: 'employee',
    positionLevel: 1,
    reportsTo: '00000000-0000-4000-8000-000000000203',
    name: '최스태프',
    email: 'staff@forlena.com',
    profileImageUrl: null,
    activeModules: DEMO_ACTIVE_MODULES,
    positionTitle: '사원',
    password: '1234',
  },
};

export function isDemoAuthEnabled() {
  return (
    process.env.HUCHU_DEMO_MODE === 'true' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.NODE_ENV === 'development'
  );
}

export function getDemoUser(email: string, password: string) {
  if (!isDemoAuthEnabled()) return null;

  const user = demoUsers[email.toLowerCase()];
  if (!user || user.password !== password) return null;

  return {
    id: user.id,
    companyId: user.companyId,
    departmentId: user.departmentId,
    role: user.role,
    positionLevel: user.positionLevel,
    reportsTo: user.reportsTo,
    name: user.name,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    activeModules: user.activeModules,
    positionTitle: user.positionTitle,
  };
}
