import { createSession } from '@/lib/auth/session';
import type { Company, User } from '@/types';

export const DEFAULT_ACTIVE_MODULES = ['M01', 'M02', 'M03', 'M04', 'M12', 'M15'];
const BYTES_PER_GB = 1024 * 1024 * 1024;

export interface AppUserRow {
  id: string;
  companyId: string;
  departmentId?: string | null;
  email: string;
  name: string;
  role: string;
  positionLevel?: number | null;
  positionTitle?: string | null;
  reportsTo?: string | null;
  profileImageUrl?: string | null;
  status: string;
}

export interface AppCompanyRow {
  id: string;
  name: string;
  businessNumber?: string | null;
  representativeName?: string | null;
  address?: string | null;
  phone?: string | null;
  industry?: string | null;
  employeeCount?: number | null;
  subscriptionPlan?: string | null;
  logoUrl?: string | null;
  aiTokenLimit?: number | null;
  storageLimit?: number | string | null;
  activeModules?: string[] | null;
}

function normalizePlan(plan?: string | null): Company['plan'] {
  if (plan === 'starter' || plan === 'business' || plan === 'enterprise') return plan;
  return 'free';
}

export function toCompanyPayload(company: AppCompanyRow): Company {
  return {
    id: company.id,
    name: company.name,
    businessNumber: company.businessNumber ?? '',
    representative: company.representativeName ?? '',
    address: company.address ?? '',
    phone: company.phone ?? '',
    industry: company.industry ?? '',
    employeeCount: company.employeeCount ?? 0,
    plan: normalizePlan(company.subscriptionPlan),
    logoUrl: company.logoUrl ?? undefined,
    aiTokenLimit: company.aiTokenLimit ?? 1000,
    storageLimitGb: Math.max(1, Math.round(Number(company.storageLimit ?? BYTES_PER_GB) / BYTES_PER_GB)),
  };
}

export function toUserPayload(user: AppUserRow): User {
  return {
    id: user.id,
    companyId: user.companyId,
    email: user.email,
    name: user.name,
    profileImageUrl: user.profileImageUrl ?? undefined,
    departmentId: user.departmentId ?? undefined,
    position: user.positionTitle ?? undefined,
    role: user.role as User['role'],
    status: user.status === 'inactive' ? 'inactive' : 'active',
  };
}

export async function createSignedAppSession(user: AppUserRow, company: AppCompanyRow) {
  const activeModules = company.activeModules?.length ? company.activeModules : DEFAULT_ACTIVE_MODULES;
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
    activeModules,
  });

  return {
    token,
    user: toUserPayload(user),
    company: toCompanyPayload(company),
    activeModules,
  };
}
