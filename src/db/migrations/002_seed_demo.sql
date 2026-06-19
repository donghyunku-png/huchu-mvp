-- ============================================================
-- Huchu MVP demo seed
-- Apply after 001_init.sql in the Supabase SQL editor.
-- Demo password for all users: 1234
-- ============================================================

BEGIN;

INSERT INTO companies (
  id,
  name,
  business_number,
  representative_name,
  address,
  phone,
  email,
  industry,
  employee_count,
  subscription_plan,
  ai_token_limit,
  storage_limit,
  active_modules,
  settings
) VALUES (
  '00000000-0000-4000-8000-000000000001',
  '주식회사 포르레나',
  '123-45-67890',
  '김대표',
  '서울특별시 강남구 테헤란로 123',
  '02-1234-5678',
  'hello@forlena.com',
  'IT/소프트웨어',
  6,
  'starter',
  10000,
  53687091200,
  '["M01","M02","M03","M04","M06","M12","M15"]'::jsonb,
  '{"demo": true, "positioning": "AI 기반 소상공인 통합 업무 플랫폼"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  business_number = EXCLUDED.business_number,
  representative_name = EXCLUDED.representative_name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  industry = EXCLUDED.industry,
  employee_count = EXCLUDED.employee_count,
  subscription_plan = EXCLUDED.subscription_plan,
  ai_token_limit = EXCLUDED.ai_token_limit,
  storage_limit = EXCLUDED.storage_limit,
  active_modules = EXCLUDED.active_modules,
  settings = EXCLUDED.settings,
  updated_at = NOW();

INSERT INTO departments (id, company_id, name, parent_id, depth, sort_order, is_active) VALUES
  ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', '경영진', NULL, 0, 1, true),
  ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', '영업팀', '00000000-0000-4000-8000-000000000101', 1, 2, true),
  ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', '개발팀', '00000000-0000-4000-8000-000000000101', 1, 3, true),
  ('00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000001', '경영지원', '00000000-0000-4000-8000-000000000101', 1, 4, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  parent_id = EXCLUDED.parent_id,
  depth = EXCLUDED.depth,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO users (
  id,
  company_id,
  department_id,
  email,
  password_hash,
  name,
  phone,
  role,
  position_title,
  position_level,
  join_date,
  status
) VALUES
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000101', 'ceo@forlena.com', '$2b$10$5m1nozx1/8FSsfQm5Jyak.11c/8h76ipp.HLp.SwOjDd705yUc7dK', '김대표', '010-1000-0001', 'company_owner', '대표이사', 7, '2020-03-01', 'active'),
  ('00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000104', 'manager@forlena.com', '$2b$10$5m1nozx1/8FSsfQm5Jyak.11c/8h76ipp.HLp.SwOjDd705yUc7dK', '정매니저', '010-1000-0002', 'company_admin', '운영매니저', 5, '2021-02-01', 'active'),
  ('00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000103', 'lead@forlena.com', '$2b$10$5m1nozx1/8FSsfQm5Jyak.11c/8h76ipp.HLp.SwOjDd705yUc7dK', '이팀장', '010-1000-0003', 'team_lead', '팀장', 4, '2022-01-10', 'active'),
  ('00000000-0000-4000-8000-000000000204', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000103', 'staff@forlena.com', '$2b$10$5m1nozx1/8FSsfQm5Jyak.11c/8h76ipp.HLp.SwOjDd705yUc7dK', '최스태프', '010-1000-0004', 'employee', '사원', 1, '2023-03-20', 'active'),
  ('00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000104', 'hr@forlena.com', '$2b$10$5m1nozx1/8FSsfQm5Jyak.11c/8h76ipp.HLp.SwOjDd705yUc7dK', '박인사', '010-1000-0005', 'hr', 'HR 리드', 4, '2021-09-01', 'active'),
  ('00000000-0000-4000-8000-000000000206', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000102', 'sales@forlena.com', '$2b$10$5m1nozx1/8FSsfQm5Jyak.11c/8h76ipp.HLp.SwOjDd705yUc7dK', '박영업', '010-1000-0006', 'sales', '영업 과장', 3, '2021-06-15', 'active')
ON CONFLICT (id) DO UPDATE SET
  department_id = EXCLUDED.department_id,
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  position_title = EXCLUDED.position_title,
  position_level = EXCLUDED.position_level,
  join_date = EXCLUDED.join_date,
  status = EXCLUDED.status,
  updated_at = NOW();

UPDATE users
SET reports_to = '00000000-0000-4000-8000-000000000201'
WHERE id IN (
  '00000000-0000-4000-8000-000000000202',
  '00000000-0000-4000-8000-000000000203',
  '00000000-0000-4000-8000-000000000204',
  '00000000-0000-4000-8000-000000000205',
  '00000000-0000-4000-8000-000000000206'
);

UPDATE departments SET head_user_id = '00000000-0000-4000-8000-000000000201' WHERE id = '00000000-0000-4000-8000-000000000101';
UPDATE departments SET head_user_id = '00000000-0000-4000-8000-000000000206' WHERE id = '00000000-0000-4000-8000-000000000102';
UPDATE departments SET head_user_id = '00000000-0000-4000-8000-000000000203' WHERE id = '00000000-0000-4000-8000-000000000103';
UPDATE departments SET head_user_id = '00000000-0000-4000-8000-000000000202' WHERE id = '00000000-0000-4000-8000-000000000104';

INSERT INTO module_activations (id, company_id, module_code, is_active, activated_at, subscription_plan, monthly_price) VALUES
  ('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000001', 'M01', true, NOW(), 'starter', 0),
  ('00000000-0000-4000-8000-000000000302', '00000000-0000-4000-8000-000000000001', 'M02', true, NOW(), 'starter', 0),
  ('00000000-0000-4000-8000-000000000303', '00000000-0000-4000-8000-000000000001', 'M03', true, NOW(), 'starter', 0),
  ('00000000-0000-4000-8000-000000000304', '00000000-0000-4000-8000-000000000001', 'M04', true, NOW(), 'starter', 0),
  ('00000000-0000-4000-8000-000000000305', '00000000-0000-4000-8000-000000000001', 'M06', true, NOW(), 'starter', 29000),
  ('00000000-0000-4000-8000-000000000306', '00000000-0000-4000-8000-000000000001', 'M12', true, NOW(), 'starter', 0),
  ('00000000-0000-4000-8000-000000000307', '00000000-0000-4000-8000-000000000001', 'M15', true, NOW(), 'starter', 0)
ON CONFLICT (id) DO UPDATE SET
  is_active = EXCLUDED.is_active,
  activated_at = EXCLUDED.activated_at,
  subscription_plan = EXCLUDED.subscription_plan,
  monthly_price = EXCLUDED.monthly_price,
  updated_at = NOW();

INSERT INTO chat_rooms (id, company_id, name, type, description, created_by, last_message_at, member_count) VALUES
  ('00000000-0000-4000-8000-000000000401', '00000000-0000-4000-8000-000000000001', '전사공지', 'public_channel', '전사 공지사항', '00000000-0000-4000-8000-000000000201', '2026-02-19 09:00:00+09', 6),
  ('00000000-0000-4000-8000-000000000402', '00000000-0000-4000-8000-000000000001', '영업팀', 'public_channel', '영업팀 업무 채널', '00000000-0000-4000-8000-000000000206', '2026-02-19 14:32:00+09', 2)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  description = EXCLUDED.description,
  last_message_at = EXCLUDED.last_message_at,
  member_count = EXCLUDED.member_count,
  updated_at = NOW();

INSERT INTO chat_room_members (id, room_id, user_id, role, last_read_at) VALUES
  ('00000000-0000-4000-8000-000000000411', '00000000-0000-4000-8000-000000000401', '00000000-0000-4000-8000-000000000201', 'admin', '2026-02-19 08:50:00+09'),
  ('00000000-0000-4000-8000-000000000412', '00000000-0000-4000-8000-000000000401', '00000000-0000-4000-8000-000000000202', 'member', '2026-02-19 08:50:00+09'),
  ('00000000-0000-4000-8000-000000000413', '00000000-0000-4000-8000-000000000401', '00000000-0000-4000-8000-000000000203', 'member', '2026-02-19 08:50:00+09'),
  ('00000000-0000-4000-8000-000000000414', '00000000-0000-4000-8000-000000000401', '00000000-0000-4000-8000-000000000204', 'member', '2026-02-19 08:50:00+09'),
  ('00000000-0000-4000-8000-000000000415', '00000000-0000-4000-8000-000000000402', '00000000-0000-4000-8000-000000000201', 'member', '2026-02-19 09:00:00+09'),
  ('00000000-0000-4000-8000-000000000416', '00000000-0000-4000-8000-000000000402', '00000000-0000-4000-8000-000000000206', 'admin', '2026-02-19 09:00:00+09')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  last_read_at = EXCLUDED.last_read_at;

INSERT INTO messages (id, room_id, sender_id, content, type, created_at) VALUES
  ('00000000-0000-4000-8000-000000000421', '00000000-0000-4000-8000-000000000401', '00000000-0000-4000-8000-000000000201', '후추 MVP 데모 환경이 준비되었습니다.', 'text', '2026-02-19 09:00:00+09'),
  ('00000000-0000-4000-8000-000000000422', '00000000-0000-4000-8000-000000000402', '00000000-0000-4000-8000-000000000206', '@AI 삼성전자 최근 거래내역 보여줘', 'text', '2026-02-19 09:16:00+09'),
  ('00000000-0000-4000-8000-000000000423', '00000000-0000-4000-8000-000000000402', NULL, '삼성전자 최근 3개월 거래내역: 2026.01 견적 5천만원, 2025.12 납품 3천만원, 2025.11 유지보수 5백만원입니다.', 'ai_response', '2026-02-19 09:16:05+09')
ON CONFLICT (id) DO UPDATE SET
  content = EXCLUDED.content,
  type = EXCLUDED.type,
  created_at = EXCLUDED.created_at,
  updated_at = NOW();

INSERT INTO attendances (id, company_id, user_id, date, check_in_time, check_in_method, overtime_hours, status) VALUES
  ('00000000-0000-4000-8000-000000000501', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000201', '2026-02-19', '2026-02-19 08:55:00+09', 'web', 0, 'normal'),
  ('00000000-0000-4000-8000-000000000502', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000202', '2026-02-19', '2026-02-19 08:50:00+09', 'web', 0, 'normal'),
  ('00000000-0000-4000-8000-000000000503', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000203', '2026-02-19', '2026-02-19 09:10:00+09', 'web', 0, 'normal'),
  ('00000000-0000-4000-8000-000000000504', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000204', '2026-02-19', NULL, NULL, 0, 'vacation')
ON CONFLICT (id) DO UPDATE SET
  check_in_time = EXCLUDED.check_in_time,
  check_in_method = EXCLUDED.check_in_method,
  overtime_hours = EXCLUDED.overtime_hours,
  status = EXCLUDED.status,
  updated_at = NOW();

INSERT INTO vacation_balances (id, company_id, user_id, year, total_days, used_days, remaining_days, carried_over_days) VALUES
  ('00000000-0000-4000-8000-000000000511', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000201', 2026, 20, 3, 17, 0),
  ('00000000-0000-4000-8000-000000000512', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000202', 2026, 15, 1, 14, 0),
  ('00000000-0000-4000-8000-000000000513', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000203', 2026, 15, 2, 13, 0),
  ('00000000-0000-4000-8000-000000000514', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000204', 2026, 11, 5, 6, 0)
ON CONFLICT (user_id, year) DO UPDATE SET
  total_days = EXCLUDED.total_days,
  used_days = EXCLUDED.used_days,
  remaining_days = EXCLUDED.remaining_days,
  carried_over_days = EXCLUDED.carried_over_days,
  updated_at = NOW();

INSERT INTO vacations (id, company_id, user_id, type, start_date, end_date, days, reason, status, approver_id, approved_at) VALUES
  ('00000000-0000-4000-8000-000000000521', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000204', 'annual', '2026-02-19', '2026-02-19', 1, '개인 사유', 'approved', '00000000-0000-4000-8000-000000000201', '2026-02-18 16:00:00+09'),
  ('00000000-0000-4000-8000-000000000522', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000206', 'half_pm', '2026-02-20', '2026-02-20', 0.5, '병원 방문', 'pending', '00000000-0000-4000-8000-000000000201', NULL)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  approver_id = EXCLUDED.approver_id,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO projects (id, company_id, name, description, status, owner_id, department_id, start_date, end_date, progress) VALUES
  ('00000000-0000-4000-8000-000000000601', '00000000-0000-4000-8000-000000000001', '후추 MVP 개발', 'AI 챗봇 허브, HR/근태, 메신저, 일정관리 중심 MVP', 'active', '00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000103', '2026-04-01', '2026-11-30', 45)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  progress = EXCLUDED.progress,
  updated_at = NOW();

INSERT INTO tasks (id, company_id, project_id, title, description, status, priority, assignee_id, created_by, due_date, source) VALUES
  ('00000000-0000-4000-8000-000000000611', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000601', '자연어 연차 신청 플로우 점검', '사용자가 "6월 25일 연차 쓸래"라고 입력하면 휴가 신청으로 연결되는 데모 플로우 확인', 'in_progress', 'high', '00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000201', '2026-06-25', 'chat_ai'),
  ('00000000-0000-4000-8000-000000000612', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000601', 'HR/근태 베타 화면 QA', '출퇴근 현황, 휴가 승인, 조직도 화면을 베타 고객용으로 점검', 'todo', 'medium', '00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000201', '2026-07-15', 'manual'),
  ('00000000-0000-4000-8000-000000000613', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000601', '클로즈드 베타 10개사 온보딩 준비', '초기 베타 기업에 제공할 데모 데이터와 온보딩 체크리스트 정리', 'review', 'high', '00000000-0000-4000-8000-000000000206', '00000000-0000-4000-8000-000000000201', '2026-08-15', 'manual')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  priority = EXCLUDED.priority,
  assignee_id = EXCLUDED.assignee_id,
  due_date = EXCLUDED.due_date,
  source = EXCLUDED.source,
  updated_at = NOW();

INSERT INTO clients (id, company_id, name, type, industry, phone, email, assigned_to, note, tags) VALUES
  ('00000000-0000-4000-8000-000000000701', '00000000-0000-4000-8000-000000000001', 'BN 해운 포워딩', 'prospect', '물류/포워딩', '02-2000-1000', 'ops@example.com', '00000000-0000-4000-8000-000000000206', '국내 베타 참여 의향 고객', '["베타","국내","물류"]'::jsonb),
  ('00000000-0000-4000-8000-000000000702', '00000000-0000-4000-8000-000000000001', 'W 세무법인', 'partner', '세무/회계', '02-2000-2000', 'tax@example.com', '00000000-0000-4000-8000-000000000201', '전문가 네트워크 후보', '["파트너","세무"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  industry = EXCLUDED.industry,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  assigned_to = EXCLUDED.assigned_to,
  note = EXCLUDED.note,
  tags = EXCLUDED.tags,
  updated_at = NOW();

INSERT INTO deals (id, company_id, client_id, title, amount, stage, probability, assigned_to, expected_close_date, note) VALUES
  ('00000000-0000-4000-8000-000000000711', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000701', '후추 클로즈드 베타 도입', 149000, 'proposal', 60, '00000000-0000-4000-8000-000000000206', '2026-10-01', 'Business 플랜 베타 전환 후보'),
  ('00000000-0000-4000-8000-000000000712', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000702', '전문가 상담 제휴', 0, 'qualified', 40, '00000000-0000-4000-8000-000000000201', '2026-09-15', '노무/세무 템플릿 검토 제휴')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  amount = EXCLUDED.amount,
  stage = EXCLUDED.stage,
  probability = EXCLUDED.probability,
  assigned_to = EXCLUDED.assigned_to,
  expected_close_date = EXCLUDED.expected_close_date,
  note = EXCLUDED.note,
  updated_at = NOW();

INSERT INTO notifications (id, company_id, user_id, type, title, content, link, is_read, metadata, created_at) VALUES
  ('00000000-0000-4000-8000-000000000801', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000201', 'approval', '휴가 승인 요청', '박영업님이 2/20 오후 반차를 신청했습니다.', '/hr/vacation', false, '{}'::jsonb, '2026-02-19 09:30:00+09'),
  ('00000000-0000-4000-8000-000000000802', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000201', 'task', 'MVP 개발 체크', '자연어 연차 신청 플로우 점검이 진행 중입니다.', '/schedule', false, '{}'::jsonb, '2026-02-19 10:00:00+09')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  link = EXCLUDED.link,
  is_read = EXCLUDED.is_read,
  metadata = EXCLUDED.metadata,
  created_at = EXCLUDED.created_at;

INSERT INTO ai_conversations (id, company_id, user_id, title, model_provider, model_name, total_tokens, total_cost) VALUES
  ('00000000-0000-4000-8000-000000000901', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000201', '연차 신청 자동화 데모', 'openai', 'gpt-4o', 245, 0.02)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  model_provider = EXCLUDED.model_provider,
  model_name = EXCLUDED.model_name,
  total_tokens = EXCLUDED.total_tokens,
  total_cost = EXCLUDED.total_cost,
  updated_at = NOW();

INSERT INTO ai_messages (id, conversation_id, role, content, tokens_used, created_at) VALUES
  ('00000000-0000-4000-8000-000000000911', '00000000-0000-4000-8000-000000000901', 'user', '6월 25일 연차 쓸래', 8, '2026-02-19 10:00:00+09'),
  ('00000000-0000-4000-8000-000000000912', '00000000-0000-4000-8000-000000000901', 'assistant', '6월 25일 연차 1일 신청서를 작성했습니다. 승인권자는 김대표님입니다.', 42, '2026-02-19 10:00:05+09')
ON CONFLICT (id) DO UPDATE SET
  content = EXCLUDED.content,
  tokens_used = EXCLUDED.tokens_used,
  created_at = EXCLUDED.created_at;

COMMIT;
