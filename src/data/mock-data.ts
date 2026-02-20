import { User, Company, Department, ChatRoom, ChatMessage, Attendance, Vacation, VacationBalance, CalendarEvent, Task, Project, Client, Deal, AIConversation, AIMessage, Bookmark, BookmarkFolder, Notification } from '@/types';

export const mockCompany: Company = {
  id: 'comp-1',
  name: '주식회사 포르레나',
  businessNumber: '123-45-67890',
  representative: '김대표',
  address: '서울특별시 강남구 테헤란로 123',
  phone: '02-1234-5678',
  industry: 'IT/소프트웨어',
  employeeCount: 12,
  plan: 'starter',
  logoUrl: undefined,
  domain: 'forlena.huchu.site',
  aiTokenLimit: 10000,
  storageLimitGb: 50,
};

export const mockUsers: User[] = [
  { id: 'user-1', companyId: 'comp-1', email: 'ceo@forlena.com', name: '김대표', position: '대표이사', role: 'company_admin', status: 'active', department: '경영진', departmentId: 'dept-1', hireDate: '2020-03-01' },
  { id: 'user-2', companyId: 'comp-1', email: 'park@forlena.com', name: '박영업', position: '과장', role: 'sales', status: 'active', department: '영업팀', departmentId: 'dept-2', hireDate: '2021-06-15' },
  { id: 'user-3', companyId: 'comp-1', email: 'lee@forlena.com', name: '이개발', position: '대리', role: 'employee', status: 'active', department: '개발팀', departmentId: 'dept-3', hireDate: '2022-01-10' },
  { id: 'user-4', companyId: 'comp-1', email: 'choi@forlena.com', name: '최디자인', position: '사원', role: 'employee', status: 'active', department: '디자인팀', departmentId: 'dept-4', hireDate: '2023-03-20' },
  { id: 'user-5', companyId: 'comp-1', email: 'jung@forlena.com', name: '정인사', position: '팀장', role: 'hr', status: 'active', department: '경영지원', departmentId: 'dept-5', hireDate: '2021-02-01' },
  { id: 'user-6', companyId: 'comp-1', email: 'han@forlena.com', name: '한재무', position: '과장', role: 'finance', status: 'active', department: '경영지원', departmentId: 'dept-5', hireDate: '2021-09-01' },
  { id: 'user-7', companyId: 'comp-1', email: 'kang@forlena.com', name: '강마케팅', position: '대리', role: 'employee', status: 'active', department: '마케팅팀', departmentId: 'dept-6', hireDate: '2023-07-15' },
  { id: 'user-8', companyId: 'comp-1', email: 'yoon@forlena.com', name: '윤백엔드', position: '선임', role: 'employee', status: 'active', department: '개발팀', departmentId: 'dept-3', hireDate: '2022-05-01' },
];

export const mockDepartments: Department[] = [
  { id: 'dept-1', companyId: 'comp-1', name: '경영진', depth: 0, sortOrder: 1, color: '#6366F1' },
  { id: 'dept-2', companyId: 'comp-1', name: '영업팀', depth: 1, sortOrder: 2, color: '#F59E0B', parentId: 'dept-1' },
  { id: 'dept-3', companyId: 'comp-1', name: '개발팀', depth: 1, sortOrder: 3, color: '#10B981', parentId: 'dept-1' },
  { id: 'dept-4', companyId: 'comp-1', name: '디자인팀', depth: 1, sortOrder: 4, color: '#EC4899', parentId: 'dept-1' },
  { id: 'dept-5', companyId: 'comp-1', name: '경영지원', depth: 1, sortOrder: 5, color: '#8B5CF6', parentId: 'dept-1' },
  { id: 'dept-6', companyId: 'comp-1', name: '마케팅팀', depth: 1, sortOrder: 6, color: '#EF4444', parentId: 'dept-1' },
];

export const mockChatRooms: ChatRoom[] = [
  { id: 'room-1', companyId: 'comp-1', type: 'public_channel', name: '전사공지', topic: '전사 공지사항', createdBy: 'user-1', unreadCount: 2, members: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[3]], lastMessage: { id: 'msg-1', roomId: 'room-1', senderId: 'user-1', senderName: '김대표', content: '이번 주 금요일 워크숍 공지드립니다.', type: 'text', isPinned: false, createdAt: '2026-02-19T09:00:00' } },
  { id: 'room-2', companyId: 'comp-1', type: 'public_channel', name: '영업팀', topic: '영업팀 업무 채널', createdBy: 'user-2', unreadCount: 5, members: [mockUsers[0], mockUsers[1]], lastMessage: { id: 'msg-2', roomId: 'room-2', senderId: 'user-2', senderName: '박영업', content: '삼성전자 건 미팅 다녀왔습니다. 긍정적 반응이었어요', type: 'text', isPinned: false, createdAt: '2026-02-19T14:32:00' } },
  { id: 'room-3', companyId: 'comp-1', type: 'public_channel', name: '개발팀', topic: '개발팀 업무 채널', createdBy: 'user-3', unreadCount: 0, members: [mockUsers[2], mockUsers[7]], lastMessage: { id: 'msg-3', roomId: 'room-3', senderId: 'user-3', senderName: '이개발', content: 'API 배포 완료했습니다', type: 'text', isPinned: false, createdAt: '2026-02-19T16:20:00' } },
  { id: 'room-4', companyId: 'comp-1', type: 'dm', name: undefined, createdBy: 'user-1', unreadCount: 1, members: [mockUsers[0], mockUsers[1]], lastMessage: { id: 'msg-4', roomId: 'room-4', senderId: 'user-2', senderName: '박영업', content: '내일 미팅 자료 보내드렸습니다', type: 'text', isPinned: false, createdAt: '2026-02-19T17:00:00' } },
  { id: 'room-5', companyId: 'comp-1', type: 'dm', name: undefined, createdBy: 'user-3', unreadCount: 0, members: [mockUsers[0], mockUsers[2]], lastMessage: { id: 'msg-5', roomId: 'room-5', senderId: 'user-3', senderName: '이개발', content: '서버 점검 일정 잡았습니다', type: 'text', isPinned: false, createdAt: '2026-02-18T11:30:00' } },
];

export const mockMessages: ChatMessage[] = [
  { id: 'msg-10', roomId: 'room-2', senderId: 'user-2', senderName: '박영업', content: '삼성전자 건 미팅 다녀왔습니다.\n긍정적 반응이었어요!', type: 'text', isPinned: false, createdAt: '2026-02-19T09:12:00' },
  { id: 'msg-11', roomId: 'room-2', senderId: 'user-1', senderName: '김대표', content: '좋은 소식이네요! 견적서 보냈나요?', type: 'text', isPinned: false, createdAt: '2026-02-19T09:15:00' },
  { id: 'msg-12', roomId: 'room-2', senderId: 'user-2', senderName: '박영업', content: '@AI 삼성전자 최근 거래내역 보여줘', type: 'text', isPinned: false, createdAt: '2026-02-19T09:16:00' },
  { id: 'msg-13', roomId: 'room-2', senderId: 'ai', senderName: 'AI 비서', content: '삼성전자 최근 3개월 거래내역:\n• 2026.01 견적 ₩50,000,000 (진행중)\n• 2025.12 납품 ₩30,000,000 (완료)\n• 2025.11 유지보수 ₩5,000,000 (완료)', type: 'ai_response', isPinned: false, createdAt: '2026-02-19T09:16:05' },
  { id: 'msg-14', roomId: 'room-2', senderId: 'user-2', senderName: '박영업', content: '네, 오늘 중으로 수정 견적서 보내겠습니다', type: 'text', isPinned: false, createdAt: '2026-02-19T09:18:00' },
  { id: 'msg-15', roomId: 'room-2', senderId: 'user-1', senderName: '김대표', content: '좋습니다. 기술 미팅도 빨리 잡아주세요', type: 'text', isPinned: false, createdAt: '2026-02-19T09:20:00' },
];

const today = '2026-02-19';
export const mockAttendances: Attendance[] = [
  { id: 'att-1', userId: 'user-1', userName: '김대표', date: today, checkIn: '2026-02-19T08:55:00', checkOut: undefined, checkInMethod: 'web', workHours: undefined, overtimeHours: 0, status: 'normal' },
  { id: 'att-2', userId: 'user-2', userName: '박영업', date: today, checkIn: '2026-02-19T09:02:00', checkOut: undefined, checkInMethod: 'gps', workHours: undefined, overtimeHours: 0, status: 'normal' },
  { id: 'att-3', userId: 'user-3', userName: '이개발', date: today, checkIn: '2026-02-19T09:32:00', checkOut: undefined, checkInMethod: 'web', workHours: undefined, overtimeHours: 0, status: 'late' },
  { id: 'att-4', userId: 'user-4', userName: '최디자인', date: today, checkIn: undefined, checkOut: undefined, checkInMethod: 'web', workHours: undefined, overtimeHours: 0, status: 'vacation' },
  { id: 'att-5', userId: 'user-5', userName: '정인사', date: today, checkIn: '2026-02-19T08:50:00', checkOut: undefined, checkInMethod: 'web', workHours: undefined, overtimeHours: 0, status: 'normal' },
  { id: 'att-6', userId: 'user-6', userName: '한재무', date: today, checkIn: '2026-02-19T09:00:00', checkOut: undefined, checkInMethod: 'ip', workHours: undefined, overtimeHours: 0, status: 'normal' },
  { id: 'att-7', userId: 'user-7', userName: '강마케팅', date: today, checkIn: '2026-02-19T09:15:00', checkOut: undefined, checkInMethod: 'web', workHours: undefined, overtimeHours: 0, status: 'late' },
  { id: 'att-8', userId: 'user-8', userName: '윤백엔드', date: today, checkIn: '2026-02-19T08:45:00', checkOut: undefined, checkInMethod: 'web', workHours: undefined, overtimeHours: 0, status: 'normal' },
];

export const mockVacations: Vacation[] = [
  { id: 'vac-1', userId: 'user-4', userName: '최디자인', type: 'annual', startDate: '2026-02-19', endDate: '2026-02-19', days: 1, reason: '개인 사유', status: 'approved', approverId: 'user-1', approverName: '김대표' },
  { id: 'vac-2', userId: 'user-2', userName: '박영업', type: 'half_pm', startDate: '2026-02-20', endDate: '2026-02-20', days: 0.5, reason: '병원 방문', status: 'pending', approverId: 'user-1', approverName: '김대표' },
  { id: 'vac-3', userId: 'user-3', userName: '이개발', type: 'annual', startDate: '2026-02-25', endDate: '2026-02-26', days: 2, reason: '가족 행사', status: 'pending', approverId: 'user-1', approverName: '김대표' },
];

export const mockVacationBalances: VacationBalance[] = [
  { id: 'vb-1', userId: 'user-1', year: 2026, totalDays: 20, usedDays: 3, remainingDays: 17 },
  { id: 'vb-2', userId: 'user-2', year: 2026, totalDays: 15, usedDays: 4, remainingDays: 11 },
  { id: 'vb-3', userId: 'user-3', year: 2026, totalDays: 15, usedDays: 2, remainingDays: 13 },
  { id: 'vb-4', userId: 'user-4', year: 2026, totalDays: 11, usedDays: 5, remainingDays: 6 },
  { id: 'vb-5', userId: 'user-5', year: 2026, totalDays: 15, usedDays: 1, remainingDays: 14 },
  { id: 'vb-6', userId: 'user-6', year: 2026, totalDays: 15, usedDays: 2, remainingDays: 13 },
  { id: 'vb-7', userId: 'user-7', year: 2026, totalDays: 11, usedDays: 0, remainingDays: 11 },
  { id: 'vb-8', userId: 'user-8', year: 2026, totalDays: 15, usedDays: 3, remainingDays: 12 },
];

export const mockEvents: CalendarEvent[] = [
  { id: 'evt-1', companyId: 'comp-1', creatorId: 'user-1', title: '삼성전자 미팅', description: 'ERP 도입 프로젝트 협의', startAt: '2026-02-19T14:00:00', endAt: '2026-02-19T15:30:00', allDay: false, scope: 'team', category: '미팅', color: '#3B82F6', location: '삼성전자 서초사옥' },
  { id: 'evt-2', companyId: 'comp-1', creatorId: 'user-1', title: '팀 주간회의', description: '주간 업무 공유', startAt: '2026-02-19T16:00:00', endAt: '2026-02-19T17:00:00', allDay: false, scope: 'company', category: '회의', color: '#8B5CF6' },
  { id: 'evt-3', companyId: 'comp-1', creatorId: 'user-5', title: '전사 워크숍', description: '2026 상반기 전략 수립', startAt: '2026-02-21T09:00:00', endAt: '2026-02-21T18:00:00', allDay: true, scope: 'company', category: '행사', color: '#EF4444' },
  { id: 'evt-4', companyId: 'comp-1', creatorId: 'user-2', title: 'LG전자 제안 발표', startAt: '2026-02-20T10:00:00', endAt: '2026-02-20T11:30:00', allDay: false, scope: 'team', category: '미팅', color: '#3B82F6', location: 'LG사이언스파크' },
  { id: 'evt-5', companyId: 'comp-1', creatorId: 'user-3', title: '스프린트 회고', startAt: '2026-02-20T15:00:00', endAt: '2026-02-20T16:00:00', allDay: false, scope: 'team', category: '회의', color: '#10B981' },
];

export const mockTasks: Task[] = [
  { id: 'task-1', companyId: 'comp-1', title: '삼성전자 수정 견적서 작성', assigneeId: 'user-2', assigneeName: '박영업', creatorId: 'user-1', status: 'in_progress', priority: 'high', dueDate: '2026-02-20', type: 'my', source: 'chat_ai' },
  { id: 'task-2', companyId: 'comp-1', title: '기술 미팅 스케줄링', assigneeId: 'user-2', assigneeName: '박영업', creatorId: 'user-1', status: 'todo', priority: 'medium', dueDate: '2026-02-21', type: 'my', source: 'chat_ai' },
  { id: 'task-3', companyId: 'comp-1', title: 'API v2 문서 작성', assigneeId: 'user-3', assigneeName: '이개발', creatorId: 'user-3', status: 'in_progress', priority: 'medium', dueDate: '2026-02-22', type: 'my', source: 'manual' },
  { id: 'task-4', companyId: 'comp-1', title: '월간 매출 보고서 제출', assigneeId: 'user-6', assigneeName: '한재무', creatorId: 'user-1', status: 'todo', priority: 'high', dueDate: '2026-02-28', type: 'requested', source: 'manual' },
  { id: 'task-5', companyId: 'comp-1', title: '경비청구 3건 처리', assigneeId: 'user-1', assigneeName: '김대표', creatorId: 'user-6', status: 'todo', priority: 'medium', dueDate: '2026-02-20', type: 'my', source: 'manual' },
  { id: 'task-6', companyId: 'comp-1', title: '신규 브랜딩 시안 완성', assigneeId: 'user-4', assigneeName: '최디자인', creatorId: 'user-1', status: 'review', priority: 'high', dueDate: '2026-02-21', type: 'my', source: 'manual' },
  { id: 'task-7', companyId: 'comp-1', title: '마케팅 캠페인 기획서', assigneeId: 'user-7', assigneeName: '강마케팅', creatorId: 'user-1', status: 'todo', priority: 'low', dueDate: '2026-03-01', type: 'my', source: 'manual' },
];

export const mockProjects: Project[] = [
  { id: 'proj-1', companyId: 'comp-1', name: '후추 MVP 개발', description: 'AI 기반 통합 비즈니스 플랫폼 MVP', status: 'active', startDate: '2026-01-06', endDate: '2026-03-31', budget: 300000000, managerId: 'user-3', managerName: '이개발', taskCount: 24, completedTaskCount: 12 },
  { id: 'proj-2', companyId: 'comp-1', name: '삼성전자 ERP 도입', description: '삼성전자 ERP 커스텀 구축 프로젝트', status: 'planning', startDate: '2026-03-01', endDate: '2026-08-31', budget: 200000000, managerId: 'user-2', managerName: '박영업', taskCount: 8, completedTaskCount: 0 },
];

export const mockClients: Client[] = [
  { id: 'client-1', companyId: 'comp-1', name: '삼성전자', type: 'customer', classification: 'sales', businessNumber: '124-81-00998', phone: '02-2255-0114', email: 'partner@samsung.com', industry: '전자/반도체', assignedTo: 'user-2', assignedToName: '박영업', tags: ['대기업', 'ERP', '핵심고객'] },
  { id: 'client-2', companyId: 'comp-1', name: 'LG전자', type: 'prospect', classification: 'sales', businessNumber: '107-86-14075', phone: '02-3777-1114', email: 'biz@lg.com', industry: '전자/가전', assignedTo: 'user-2', assignedToName: '박영업', tags: ['대기업', 'AI솔루션'] },
  { id: 'client-3', companyId: 'comp-1', name: '네이버', type: 'partner', classification: 'both', businessNumber: '220-81-62517', phone: '1588-3830', industry: 'IT/플랫폼', assignedTo: 'user-1', assignedToName: '김대표', tags: ['파트너', 'API연동'] },
  { id: 'client-4', companyId: 'comp-1', name: '세무법인 한길', type: 'vendor', classification: 'purchase', phone: '02-555-1234', industry: '세무/회계', assignedTo: 'user-6', assignedToName: '한재무', tags: ['세무', '외부전문가'] },
  { id: 'client-5', companyId: 'comp-1', name: '카카오엔터프라이즈', type: 'prospect', classification: 'sales', phone: '1577-3754', industry: 'IT/플랫폼', assignedTo: 'user-2', assignedToName: '박영업', tags: ['IT', '그룹웨어'] },
];

export const mockDeals: Deal[] = [
  { id: 'deal-1', companyId: 'comp-1', clientId: 'client-1', clientName: '삼성전자', title: 'ERP 도입 프로젝트', amount: 250000000, stage: 'negotiation', probability: 70, ownerId: 'user-2', ownerName: '박영업', expectedClose: '2026-03-15' },
  { id: 'deal-2', companyId: 'comp-1', clientId: 'client-2', clientName: 'LG전자', title: 'AI 솔루션 제안', amount: 80000000, stage: 'proposal', probability: 40, ownerId: 'user-2', ownerName: '박영업', expectedClose: '2026-04-01' },
  { id: 'deal-3', companyId: 'comp-1', clientId: 'client-5', clientName: '카카오엔터프라이즈', title: '워크플로우 자동화 컨설팅', amount: 50000000, stage: 'qualified', probability: 30, ownerId: 'user-2', ownerName: '박영업', expectedClose: '2026-05-01' },
  { id: 'deal-4', companyId: 'comp-1', clientId: 'client-3', clientName: '네이버', title: 'API 연동 개발', amount: 30000000, stage: 'closed_won', probability: 100, ownerId: 'user-1', ownerName: '김대표' },
];

export const mockAIConversations: AIConversation[] = [
  { id: 'ai-conv-1', userId: 'user-1', companyId: 'comp-1', title: '이번 달 경비 정리', createdAt: '2026-02-19T10:00:00', updatedAt: '2026-02-19T10:05:00' },
  { id: 'ai-conv-2', userId: 'user-1', companyId: 'comp-1', title: '연차 관련 질문', createdAt: '2026-02-18T14:00:00', updatedAt: '2026-02-18T14:10:00' },
  { id: 'ai-conv-3', userId: 'user-1', companyId: 'comp-1', title: '삼성전자 거래 현황', createdAt: '2026-02-17T09:00:00', updatedAt: '2026-02-17T09:15:00' },
];

export const mockAIMessages: AIMessage[] = [
  { id: 'ai-msg-1', conversationId: 'ai-conv-1', role: 'user', content: '이번 달 우리 회사 경비 현황 알려줘', createdAt: '2026-02-19T10:00:00' },
  { id: 'ai-msg-2', conversationId: 'ai-conv-1', role: 'assistant', content: '2026년 2월 현재 경비 현황을 정리해드리겠습니다.\n\n**총 경비:** ₩3,450,000\n- 교통비: ₩850,000 (24.6%)\n- 식비: ₩620,000 (18.0%)\n- 사무용품: ₩430,000 (12.5%)\n- 접대비: ₩1,200,000 (34.8%)\n- 기타: ₩350,000 (10.1%)\n\n전월 대비 12% 증가했습니다. 접대비가 가장 큰 비중을 차지하고 있으며, 삼성전자 미팅 관련 경비가 대부분입니다.\n\n미처리 경비청구가 3건 있습니다. 처리하시겠습니까?', model: 'gpt-4o', tokensUsed: 245, createdAt: '2026-02-19T10:00:05' },
  { id: 'ai-msg-3', conversationId: 'ai-conv-1', role: 'user', content: '미처리 경비 상세 보여줘', createdAt: '2026-02-19T10:01:00' },
  { id: 'ai-msg-4', conversationId: 'ai-conv-1', role: 'assistant', content: '미처리 경비청구 3건입니다:\n\n1. **박영업** - 삼성전자 미팅 택시비 ₩35,000 (2/18)\n2. **이개발** - 서버 장비 구매 ₩280,000 (2/17)\n3. **강마케팅** - 광고 소재 제작비 ₩150,000 (2/15)\n\n승인 처리하시겠습니까? "모두 승인" 또는 개별 건번호를 말씀해주세요.', model: 'gpt-4o', tokensUsed: 180, createdAt: '2026-02-19T10:01:05' },
];

export const mockBookmarks: Bookmark[] = [
  { id: 'bm-1', userId: 'user-1', folderId: 'bmf-1', type: 'page', title: '영업 대시보드', url: '/crm/pipeline', icon: '📊', sortOrder: 1 },
  { id: 'bm-2', userId: 'user-1', folderId: 'bmf-1', type: 'page', title: '이번달 경비청구', url: '/finance/expense', icon: '💰', sortOrder: 2 },
  { id: 'bm-3', userId: 'user-1', folderId: 'bmf-1', type: 'page', title: '삼성전자 고객 상세', url: '/crm/customers/client-1', icon: '🏢', sortOrder: 3 },
  { id: 'bm-4', userId: 'user-1', folderId: 'bmf-2', type: 'external', title: '홈택스', url: 'https://hometax.go.kr', icon: '🏛️', sortOrder: 1 },
  { id: 'bm-5', userId: 'user-1', folderId: 'bmf-2', type: 'external', title: '4대보험 정보연계센터', url: 'https://www.4insure.or.kr', icon: '🔗', sortOrder: 2 },
  { id: 'bm-6', userId: 'user-1', folderId: 'bmf-3', type: 'feature', title: '연차 신청', url: '/hr/vacation', icon: '🏖️', sortOrder: 1 },
  { id: 'bm-7', userId: 'user-1', folderId: 'bmf-3', type: 'feature', title: '경비 청구', url: '/finance/expense', icon: '🧾', sortOrder: 2 },
];

export const mockBookmarkFolders: BookmarkFolder[] = [
  { id: 'bmf-1', userId: 'user-1', name: '업무 관련', sortOrder: 1 },
  { id: 'bmf-2', userId: 'user-1', name: '외부 링크', sortOrder: 2 },
  { id: 'bmf-3', userId: 'user-1', name: '자주 쓰는 기능', sortOrder: 3 },
];

export const mockNotifications: Notification[] = [
  { id: 'noti-1', userId: 'user-1', type: 'approval', title: '휴가 승인 요청', body: '박영업님이 2/20 오후 반차를 신청했습니다.', link: '/hr/vacation', isRead: false, createdAt: '2026-02-19T09:30:00' },
  { id: 'noti-2', userId: 'user-1', type: 'task', title: '할일 마감 임박', body: '경비청구 3건 처리 (내일 마감)', link: '/schedule', isRead: false, createdAt: '2026-02-19T08:00:00' },
  { id: 'noti-3', userId: 'user-1', type: 'chat', title: '새 메시지', body: '박영업: 삼성전자 건 미팅 다녀왔습니다', link: '/messenger', isRead: false, createdAt: '2026-02-19T14:32:00' },
  { id: 'noti-4', userId: 'user-1', type: 'meeting', title: '일정 알림', body: '삼성전자 미팅 30분 전', link: '/schedule', isRead: true, createdAt: '2026-02-19T13:30:00' },
  { id: 'noti-5', userId: 'user-1', type: 'system', title: '급여명세서 발행 완료', body: '2026년 1월 급여명세서가 발행되었습니다.', link: '/hr/payroll', isRead: true, createdAt: '2026-02-18T10:00:00' },
];

// Current user helper
export const currentUser = mockUsers[0]; // 김대표 as default user
export const currentCompany = mockCompany;
