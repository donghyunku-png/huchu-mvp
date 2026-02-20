/**
 * 후추(Huchu) v4.0 - 계층적 RBAC (Role-Based Access Control)
 *
 * 역할 계층:
 *   super_admin > company_owner > company_admin > dept_head > team_lead > employee
 *   기능 특화 역할: hr, finance, sales, executive
 *
 * 데이터 접근 범위:
 *   self: 본인 데이터만
 *   team: 소속 팀원 데이터
 *   department: 소속 부서 전체
 *   company: 전사 데이터
 */

// ── 역할 계층 레벨 (높을수록 상위) ──────────────
export const ROLE_HIERARCHY: Record<string, number> = {
  super_admin: 100,
  company_owner: 90,
  company_admin: 80,
  executive: 70,
  dept_head: 60,
  team_lead: 50,
  hr: 45,
  finance: 45,
  sales: 40,
  employee: 10,
};

// ── 리소스별 기본 권한 매트릭스 ──────────────
export type ResourceAction = 'read' | 'write' | 'approve' | 'delete';
export type DataScope = 'self' | 'team' | 'department' | 'company';

interface PermissionRule {
  actions: ResourceAction[];
  scope: DataScope;
}

// 각 역할이 각 리소스에 대해 가지는 기본 권한
const DEFAULT_PERMISSIONS: Record<string, Record<string, PermissionRule>> = {
  // ── 팀원 ──
  employee: {
    attendance: { actions: ['read'], scope: 'self' },
    vacation: { actions: ['read', 'write'], scope: 'self' },
    salary: { actions: ['read'], scope: 'self' },
    tasks: { actions: ['read', 'write'], scope: 'self' },
    calendar: { actions: ['read', 'write'], scope: 'self' },
    crm: { actions: ['read', 'write'], scope: 'self' },
    messenger: { actions: ['read', 'write'], scope: 'company' },
    ai_chat: { actions: ['read', 'write'], scope: 'self' },
    bookmarks: { actions: ['read', 'write', 'delete'], scope: 'self' },
    notifications: { actions: ['read'], scope: 'self' },
    settings: { actions: ['read', 'write'], scope: 'self' },
    profile: { actions: ['read', 'write'], scope: 'self' },
    performance: { actions: ['read'], scope: 'self' },
    organization: { actions: ['read'], scope: 'company' },
  },

  // ── 팀장 ──
  team_lead: {
    attendance: { actions: ['read'], scope: 'team' },
    vacation: { actions: ['read', 'write', 'approve'], scope: 'team' },
    salary: { actions: ['read'], scope: 'self' },
    tasks: { actions: ['read', 'write'], scope: 'team' },
    calendar: { actions: ['read', 'write'], scope: 'team' },
    crm: { actions: ['read', 'write'], scope: 'team' },
    messenger: { actions: ['read', 'write'], scope: 'company' },
    ai_chat: { actions: ['read', 'write'], scope: 'self' },
    bookmarks: { actions: ['read', 'write', 'delete'], scope: 'self' },
    notifications: { actions: ['read'], scope: 'self' },
    settings: { actions: ['read', 'write'], scope: 'self' },
    profile: { actions: ['read', 'write'], scope: 'self' },
    performance: { actions: ['read'], scope: 'team' },
    organization: { actions: ['read'], scope: 'company' },
    approval: { actions: ['read', 'approve'], scope: 'team' },
  },

  // ── 부서장 ──
  dept_head: {
    attendance: { actions: ['read'], scope: 'department' },
    vacation: { actions: ['read', 'write', 'approve'], scope: 'department' },
    salary: { actions: ['read'], scope: 'self' },
    tasks: { actions: ['read', 'write', 'delete'], scope: 'department' },
    calendar: { actions: ['read', 'write'], scope: 'department' },
    crm: { actions: ['read', 'write', 'delete'], scope: 'department' },
    messenger: { actions: ['read', 'write'], scope: 'company' },
    ai_chat: { actions: ['read', 'write'], scope: 'self' },
    bookmarks: { actions: ['read', 'write', 'delete'], scope: 'self' },
    notifications: { actions: ['read'], scope: 'self' },
    settings: { actions: ['read', 'write'], scope: 'self' },
    profile: { actions: ['read', 'write'], scope: 'self' },
    performance: { actions: ['read'], scope: 'department' },
    organization: { actions: ['read'], scope: 'company' },
    approval: { actions: ['read', 'approve'], scope: 'department' },
  },

  // ── 대표/Owner ──
  company_owner: {
    attendance: { actions: ['read', 'write', 'delete'], scope: 'company' },
    vacation: { actions: ['read', 'write', 'approve', 'delete'], scope: 'company' },
    salary: { actions: ['read', 'write'], scope: 'company' },
    tasks: { actions: ['read', 'write', 'delete'], scope: 'company' },
    calendar: { actions: ['read', 'write', 'delete'], scope: 'company' },
    crm: { actions: ['read', 'write', 'delete'], scope: 'company' },
    messenger: { actions: ['read', 'write', 'delete'], scope: 'company' },
    ai_chat: { actions: ['read', 'write'], scope: 'company' },
    bookmarks: { actions: ['read', 'write', 'delete'], scope: 'self' },
    notifications: { actions: ['read', 'delete'], scope: 'company' },
    settings: { actions: ['read', 'write', 'delete'], scope: 'company' },
    profile: { actions: ['read', 'write'], scope: 'company' },
    performance: { actions: ['read'], scope: 'company' },
    organization: { actions: ['read', 'write', 'delete'], scope: 'company' },
    approval: { actions: ['read', 'write', 'approve', 'delete'], scope: 'company' },
    modules: { actions: ['read', 'write'], scope: 'company' },
    delegation: { actions: ['read', 'write', 'delete'], scope: 'company' },
    finance: { actions: ['read', 'write', 'approve'], scope: 'company' },
  },

  // ── 관리자 (위임받은 권한) ──
  company_admin: {
    attendance: { actions: ['read', 'write'], scope: 'company' },
    vacation: { actions: ['read', 'write', 'approve'], scope: 'company' },
    salary: { actions: ['read'], scope: 'company' },
    tasks: { actions: ['read', 'write', 'delete'], scope: 'company' },
    calendar: { actions: ['read', 'write'], scope: 'company' },
    crm: { actions: ['read', 'write', 'delete'], scope: 'company' },
    messenger: { actions: ['read', 'write', 'delete'], scope: 'company' },
    ai_chat: { actions: ['read', 'write'], scope: 'company' },
    bookmarks: { actions: ['read', 'write', 'delete'], scope: 'self' },
    notifications: { actions: ['read', 'delete'], scope: 'company' },
    settings: { actions: ['read', 'write'], scope: 'company' },
    profile: { actions: ['read', 'write'], scope: 'company' },
    performance: { actions: ['read'], scope: 'company' },
    organization: { actions: ['read', 'write'], scope: 'company' },
    approval: { actions: ['read', 'write', 'approve'], scope: 'company' },
    modules: { actions: ['read'], scope: 'company' },
    finance: { actions: ['read', 'write'], scope: 'company' },
  },

  // ── HR 담당 (기능 특화) ──
  hr: {
    attendance: { actions: ['read', 'write'], scope: 'company' },
    vacation: { actions: ['read', 'write', 'approve'], scope: 'company' },
    salary: { actions: ['read', 'write'], scope: 'company' },
    tasks: { actions: ['read', 'write'], scope: 'self' },
    calendar: { actions: ['read', 'write'], scope: 'self' },
    crm: { actions: ['read'], scope: 'self' },
    messenger: { actions: ['read', 'write'], scope: 'company' },
    ai_chat: { actions: ['read', 'write'], scope: 'self' },
    bookmarks: { actions: ['read', 'write', 'delete'], scope: 'self' },
    notifications: { actions: ['read'], scope: 'self' },
    settings: { actions: ['read', 'write'], scope: 'self' },
    profile: { actions: ['read', 'write'], scope: 'company' },
    performance: { actions: ['read', 'write'], scope: 'company' },
    organization: { actions: ['read', 'write'], scope: 'company' },
  },

  // ── 재무 담당 (기능 특화) ──
  finance: {
    attendance: { actions: ['read'], scope: 'self' },
    vacation: { actions: ['read', 'write'], scope: 'self' },
    salary: { actions: ['read', 'write'], scope: 'company' },
    tasks: { actions: ['read', 'write'], scope: 'self' },
    calendar: { actions: ['read', 'write'], scope: 'self' },
    crm: { actions: ['read'], scope: 'company' },
    messenger: { actions: ['read', 'write'], scope: 'company' },
    ai_chat: { actions: ['read', 'write'], scope: 'self' },
    bookmarks: { actions: ['read', 'write', 'delete'], scope: 'self' },
    notifications: { actions: ['read'], scope: 'self' },
    settings: { actions: ['read', 'write'], scope: 'self' },
    profile: { actions: ['read', 'write'], scope: 'self' },
    finance: { actions: ['read', 'write', 'approve'], scope: 'company' },
    organization: { actions: ['read'], scope: 'company' },
  },
};

// ── 타입 정의 ──────────────
export interface UserContext {
  id: string;
  companyId: string;
  departmentId?: string | null;
  role: string;
  positionLevel: number;
  reportsTo?: string | null;
}

export interface PermissionCheck {
  resource: string;
  action: ResourceAction;
  targetUserId?: string;
  targetDepartmentId?: string;
}

// ── 핵심 함수들 ──────────────

/**
 * 사용자의 특정 리소스/액션에 대한 권한 확인
 */
export function hasPermission(user: UserContext, check: PermissionCheck): boolean {
  const rolePerms = DEFAULT_PERMISSIONS[user.role];
  if (!rolePerms) return false;

  const resourcePerm = rolePerms[check.resource];
  if (!resourcePerm) return false;

  return resourcePerm.actions.includes(check.action);
}

/**
 * 사용자의 데이터 접근 범위 반환
 * 이 범위에 따라 API 쿼리의 WHERE 조건이 결정됨
 */
export function getDataScope(user: UserContext, resource: string): DataScope {
  const rolePerms = DEFAULT_PERMISSIONS[user.role];
  if (!rolePerms) return 'self';

  const resourcePerm = rolePerms[resource];
  if (!resourcePerm) return 'self';

  return resourcePerm.scope;
}

/**
 * 역할 계층 비교 - 상위 역할인지 확인
 */
export function isHigherRole(role1: string, role2: string): boolean {
  return (ROLE_HIERARCHY[role1] || 0) > (ROLE_HIERARCHY[role2] || 0);
}

/**
 * 데이터 접근 범위에 따른 사용자 ID 필터 조건 생성
 * API에서 이 함수를 사용하여 쿼리 범위를 제한
 */
export function getScopeFilter(
  user: UserContext,
  resource: string,
): {
  type: 'self' | 'team' | 'department' | 'company';
  userId?: string;
  departmentId?: string;
  companyId: string;
} {
  const scope = getDataScope(user, resource);

  switch (scope) {
    case 'company':
      return { type: 'company', companyId: user.companyId };
    case 'department':
      return {
        type: 'department',
        departmentId: user.departmentId || undefined,
        companyId: user.companyId,
      };
    case 'team':
      return {
        type: 'team',
        userId: user.id,
        departmentId: user.departmentId || undefined,
        companyId: user.companyId,
      };
    case 'self':
    default:
      return { type: 'self', userId: user.id, companyId: user.companyId };
  }
}

/**
 * 사용자가 특정 대상의 데이터를 볼 수 있는지 확인
 * (비공개 개인일정 등은 본인만 열람 가능)
 */
export function canAccessUserData(
  viewer: UserContext,
  targetUserId: string,
  targetDepartmentId: string | null,
  resource: string,
  isPrivate: boolean = false,
): boolean {
  // 비공개 데이터는 본인만
  if (isPrivate && viewer.id !== targetUserId) return false;

  // 본인 데이터는 항상 OK
  if (viewer.id === targetUserId) return true;

  const scope = getDataScope(viewer, resource);

  switch (scope) {
    case 'company':
      return true;
    case 'department':
      return viewer.departmentId === targetDepartmentId;
    case 'team':
      // 팀 범위: 같은 부서이고 뷰어가 상위자일 때
      return viewer.departmentId === targetDepartmentId;
    case 'self':
    default:
      return false;
  }
}

/**
 * 모듈 접근 권한 확인
 */
export function canAccessModule(
  activeModules: string[],
  moduleCode: string,
): boolean {
  // 코어 모듈은 항상 접근 가능
  const CORE_MODULES = ['M01', 'M02', 'M03', 'M04', 'M12', 'M15'];
  if (CORE_MODULES.includes(moduleCode)) return true;

  return activeModules.includes(moduleCode);
}

/**
 * 역할에 따른 대시보드 위젯 목록 반환
 */
export function getDashboardWidgets(role: string): string[] {
  const baseWidgets = ['my_tasks', 'my_schedule', 'notifications', 'quick_actions'];

  switch (role) {
    case 'company_owner':
    case 'super_admin':
      return [
        'company_overview', 'revenue_summary', 'attendance_overview',
        'approval_queue', 'team_performance', ...baseWidgets,
        'module_status', 'ai_usage',
      ];
    case 'company_admin':
      return [
        'company_overview', 'attendance_overview',
        'approval_queue', 'team_performance', ...baseWidgets,
      ];
    case 'dept_head':
      return [
        'dept_overview', 'dept_attendance', 'approval_queue',
        'dept_performance', ...baseWidgets,
      ];
    case 'team_lead':
      return [
        'team_overview', 'team_attendance', 'approval_queue',
        'team_tasks', ...baseWidgets,
      ];
    case 'hr':
      return [
        'hr_overview', 'attendance_overview', 'vacation_requests',
        'approval_queue', ...baseWidgets,
      ];
    case 'finance':
      return [
        'finance_overview', 'expense_requests',
        'approval_queue', ...baseWidgets,
      ];
    default:
      return ['my_attendance', 'my_vacation_balance', ...baseWidgets];
  }
}

/**
 * 역할에 따른 네비게이션 메뉴 필터링
 */
export function getNavigationItems(role: string, activeModules: string[]): string[] {
  const coreNav = ['dashboard', 'messenger', 'ai_chat', 'hr', 'schedule', 'bookmarks'];
  const extendedNav: string[] = [];

  // 역할에 따른 추가 네비게이션
  if (['company_owner', 'company_admin', 'super_admin'].includes(role)) {
    extendedNav.push('settings', 'admin');
  }

  // 활성화된 모듈에 따른 네비게이션
  if (activeModules.includes('M05')) extendedNav.push('finance');
  if (activeModules.includes('M06')) extendedNav.push('crm');
  if (activeModules.includes('M07')) extendedNav.push('contracts');
  if (activeModules.includes('M08')) extendedNav.push('drive', 'wiki');
  if (activeModules.includes('M09')) extendedNav.push('sites');
  if (activeModules.includes('M11')) extendedNav.push('board');
  if (activeModules.includes('M16')) extendedNav.push('marketplace');
  if (activeModules.includes('M17')) extendedNav.push('email');

  return [...coreNav, ...extendedNav];
}
