/**
 * GET /api/modules - 모듈 목록 + 활성화 상태 (DB 연동)
 * POST /api/modules - 모듈 활성화/비활성화 (Owner만)
 */
import { NextRequest } from 'next/server';
import { success, error, withAuth, withPermission } from '@/lib/api-helpers';
import { db } from '@/db';
import { companies } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// 전체 모듈 카탈로그
const MODULE_CATALOG = [
  // 코어 서비스 (항상 활성화)
  { code: 'M01', name: 'AI 채팅 허브', category: 'core', description: '자연어 업무처리, 기업 RAG, AI 선택형 과금', icon: 'bot', price: 0, isCore: true },
  { code: 'M02', name: '사내 메신저', category: 'core', description: 'DM/그룹/채널 채팅, @AI 멘션, 파일 공유', icon: 'message-circle', price: 0, isCore: true },
  { code: 'M03', name: '인사/근태 관리', category: 'core', description: '조직도, 출퇴근, 휴가, 급여 관리', icon: 'users', price: 0, isCore: true },
  { code: 'M04', name: '일정/프로젝트/할일', category: 'core', description: '캘린더, 칸반 보드, 프로젝트 관리', icon: 'calendar', price: 0, isCore: true },
  { code: 'M12', name: '개인 워크스페이스', category: 'core', description: '북마크, 메모, 개인 대시보드', icon: 'bookmark', price: 0, isCore: true },
  { code: 'M15', name: '알림 관리', category: 'core', description: '통합 알림, 파일 업로드 관리', icon: 'bell', price: 0, isCore: true },

  // 무료 확장
  { code: 'M05', name: '재무/경비 관리', category: 'free_extension', description: '자금일보, 경비 청구, 세금계산서', icon: 'dollar-sign', price: 0, isCore: false },
  { code: 'M08', name: '스마트 드라이브/위키', category: 'free_extension', description: '파일 관리, AI 자동분류, 기업 위키', icon: 'folder', price: 0, isCore: false },
  { code: 'M11', name: '스마트 게시판', category: 'free_extension', description: '공지, 업무, 자유, 익명 게시판', icon: 'layout', price: 0, isCore: false },

  // 유료 확장
  { code: 'M06', name: '영업/CRM', category: 'paid_extension', description: '고객관리, 파이프라인, 통화녹취 AI', icon: 'trending-up', price: 29000, isCore: false },
  { code: 'M07', name: '전자계약', category: 'paid_extension', description: '계약 생성, 전자서명, AI 리뷰', icon: 'file-text', price: 19000, isCore: false },
  { code: 'M09', name: '홈페이지 빌더', category: 'paid_extension', description: '드래그&드롭, 커스텀 도메인, SEO', icon: 'globe', price: 29000, isCore: false },
  { code: 'M10', name: '전문가 상담', category: 'paid_extension', description: '세무/법무/노무 전문가 연결', icon: 'headphones', price: 0, isCore: false, priceNote: '건별 과금' },
  { code: 'M16', name: '전문 서비스 마켓플레이스', category: 'paid_extension', description: '법무/회계/노무 등 외부 전문가 연결', icon: 'store', price: 0, isCore: false, priceNote: '기본 무료' },
  { code: 'M17', name: '이메일 서비스', category: 'paid_extension', description: 'Gmail/Naver 연동 + 자체 이메일', icon: 'mail', price: 9000, isCore: false, priceNote: '인당' },
  { code: 'M18', name: '클라우드 드라이브', category: 'paid_extension', description: 'Google Drive/Naver Box 연동 + 자체 드라이브', icon: 'hard-drive', price: 5000, isCore: false, priceNote: '인당' },
  { code: 'M19', name: '도메인 관리', category: 'paid_extension', description: '커스텀 도메인, DNS, SSL 자동화', icon: 'link', price: 15000, isCore: false, priceNote: '연간' },

  // 시스템 관리
  { code: 'M13', name: 'AI 관리 시스템', category: 'system', description: 'AI 엔진 설정, 토큰 관리, RAG', icon: 'cpu', price: 0, isCore: true },
  { code: 'M14', name: '시스템 설정', category: 'system', description: '회사 설정, 권한, 모듈 활성화', icon: 'settings', price: 0, isCore: true },
];

export async function GET() {
  return withAuth(async (user) => {
    try {
      // DB에서 회사의 활성 모듈 조회
      const companyData = await db
        .select({ activeModules: companies.activeModules })
        .from(companies)
        .where(eq(companies.id, user.companyId))
        .limit(1);

      const activeModulesCodes = (companyData[0]?.activeModules as string[]) || [];

      const modules = MODULE_CATALOG.map((m) => ({
        ...m,
        isActive: m.isCore || activeModulesCodes.includes(m.code),
      }));

      const categories = {
        core: modules.filter((m) => m.category === 'core'),
        free_extension: modules.filter((m) => m.category === 'free_extension'),
        paid_extension: modules.filter((m) => m.category === 'paid_extension'),
        system: modules.filter((m) => m.category === 'system'),
      };

      return success({ modules, categories });
    } catch (err) {
      console.error('GET /api/modules error:', err);
      return success({
        modules: MODULE_CATALOG.map((m) => ({
          ...m,
          isActive: m.isCore,
        })),
        categories: {
          core: MODULE_CATALOG.filter((m) => m.category === 'core'),
          free_extension: MODULE_CATALOG.filter((m) => m.category === 'free_extension'),
          paid_extension: MODULE_CATALOG.filter((m) => m.category === 'paid_extension'),
          system: MODULE_CATALOG.filter((m) => m.category === 'system'),
        },
      });
    }
  });
}

export async function POST(request: NextRequest) {
  return withPermission('modules', 'write', async (user) => {
    try {
      const body = await request.json();
      const { moduleCode, action } = body; // action: 'activate' | 'deactivate'

      const targetModule = MODULE_CATALOG.find((m) => m.code === moduleCode);
      if (!targetModule) {
        return error('존재하지 않는 모듈입니다.');
      }

      if (targetModule.isCore) {
        return error('코어 서비스는 비활성화할 수 없습니다.');
      }

      // Owner만 모듈 활성화/비활성화 가능
      if (user.role !== 'company_owner' && user.role !== 'super_admin') {
        return error('모듈 관리 권한이 없습니다. (대표만 가능)', 403);
      }

      // DB에서 현재 활성 모듈 조회
      const companyData = await db
        .select({ activeModules: companies.activeModules })
        .from(companies)
        .where(eq(companies.id, user.companyId))
        .limit(1);

      const activeModules = (companyData[0]?.activeModules as string[]) || [];
      let updatedModules: string[];

      if (action === 'activate') {
        // 모듈 활성화
        updatedModules = Array.from(new Set([...activeModules, moduleCode]));
      } else if (action === 'deactivate') {
        // 모듈 비활성화
        updatedModules = activeModules.filter((m) => m !== moduleCode);
      } else {
        return error('올바른 action을 선택하세요: activate, deactivate');
      }

      // 회사의 활성 모듈 업데이트
      await db
        .update(companies)
        .set({ activeModules: updatedModules })
        .where(eq(companies.id, user.companyId));

      return success({
        moduleCode,
        action,
        activeModules: updatedModules,
        message: action === 'activate'
          ? `${targetModule.name} 모듈이 활성화되었습니다.`
          : `${targetModule.name} 모듈이 비활성화되었습니다.`,
      });
    } catch (err) {
      console.error('POST /api/modules error:', err);
      return error('모듈 관리 중 오류가 발생했습니다.', 500);
    }
  });
}
