/**
 * 후추(Huchu) v4.0 - Drizzle ORM Database Schema
 * Phase 1 MVP: Auth, Company, Users, Departments, HR, Attendance, Vacations,
 *              Tasks, Calendar, CRM, Chat, AI, Bookmarks, Notifications,
 *              RBAC, Module Activation
 */
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  decimal,
  timestamp,
  jsonb,
  date,
  bigint,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================
// 1. Companies (T01)
// ============================================================
export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  businessNumber: varchar('business_number', { length: 20 }),
  representativeName: varchar('representative_name', { length: 50 }),
  address: text('address'),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 100 }),
  industry: varchar('industry', { length: 50 }),
  employeeCount: integer('employee_count').default(0),
  logoUrl: varchar('logo_url', { length: 500 }),
  subscriptionPlan: varchar('subscription_plan', { length: 20 }).default('free').notNull(), // free, starter, business, enterprise
  subscriptionStartDate: date('subscription_start_date'),
  subscriptionEndDate: date('subscription_end_date'),
  aiTokenLimit: integer('ai_token_limit').default(1000),
  aiTokenUsed: integer('ai_token_used').default(0),
  storageLimit: bigint('storage_limit', { mode: 'number' }).default(5368709120), // 5GB
  storageUsed: bigint('storage_used', { mode: 'number' }).default(0),
  activeModules: jsonb('active_modules').$type<string[]>().default(['M01', 'M02', 'M03', 'M04', 'M12', 'M15']),
  settings: jsonb('settings').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// 2. Users (T02)
// ============================================================
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  departmentId: uuid('department_id').references(() => departments.id),
  email: varchar('email', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  profileImageUrl: varchar('profile_image_url', { length: 500 }),
  role: varchar('role', { length: 30 }).default('employee').notNull(),
  // company_owner, company_admin, dept_head, team_lead, employee, hr, finance, sales, executive
  positionTitle: varchar('position_title', { length: 50 }), // 직함: 대리, 과장, 부장 등
  positionLevel: integer('position_level').default(1),
  // 1=사원, 2=대리, 3=과장, 4=차장, 5=부장, 6=이사, 7=대표
  reportsTo: uuid('reports_to'),
  joinDate: date('join_date'),
  status: varchar('status', { length: 20 }).default('active').notNull(), // active, inactive, suspended
  lastLoginAt: timestamp('last_login_at'),
  settings: jsonb('settings').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_users_company').on(table.companyId),
  index('idx_users_department').on(table.departmentId),
  index('idx_users_email').on(table.email),
]);

// ============================================================
// 3. Departments (T03)
// ============================================================
export const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  parentId: uuid('parent_id'),
  headUserId: uuid('head_user_id'),
  depth: integer('depth').default(0),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_departments_company').on(table.companyId),
]);

// ============================================================
// 4. Role Permissions (T59) - 계층적 RBAC
// ============================================================
export const rolePermissions = pgTable('role_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  role: varchar('role', { length: 30 }).notNull(),
  resource: varchar('resource', { length: 50 }).notNull(),
  // attendance, vacation, salary, crm, finance, settings, modules, etc.
  action: varchar('action', { length: 20 }).notNull(),
  // read, write, approve, delete
  scope: varchar('scope', { length: 20 }).notNull(),
  // self, team, department, company
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('idx_role_perm_unique').on(table.role, table.resource, table.action),
]);

// ============================================================
// 5. Approval Delegations (T60) - 승인권 위임
// ============================================================
export const approvalDelegations = pgTable('approval_delegations', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  delegatorId: uuid('delegator_id').references(() => users.id).notNull(),
  delegateeId: uuid('delegatee_id').references(() => users.id).notNull(),
  delegationType: varchar('delegation_type', { length: 30 }).notNull(),
  // vacation, expense, contract, overtime, document
  scope: varchar('scope', { length: 20 }).notNull(), // team, department, company
  amountLimit: decimal('amount_limit', { precision: 15, scale: 2 }),
  departmentId: uuid('department_id').references(() => departments.id),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// 6. Module Activations (T61)
// ============================================================
export const moduleActivations = pgTable('module_activations', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  moduleCode: varchar('module_code', { length: 10 }).notNull(), // M01 ~ M19
  isActive: boolean('is_active').default(false),
  activatedAt: timestamp('activated_at'),
  deactivatedAt: timestamp('deactivated_at'),
  subscriptionPlan: varchar('subscription_plan', { length: 20 }), // free, paid
  monthlyPrice: decimal('monthly_price', { precision: 10, scale: 0 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('idx_module_company_code').on(table.companyId, table.moduleCode),
]);

// ============================================================
// 7. Messenger - Chat Rooms (T04)
// ============================================================
export const chatRooms = pgTable('chat_rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 100 }),
  type: varchar('type', { length: 20 }).notNull(), // dm, group, public_channel, private_channel
  description: text('description'),
  createdBy: uuid('created_by').references(() => users.id),
  lastMessageAt: timestamp('last_message_at'),
  memberCount: integer('member_count').default(0),
  isArchived: boolean('is_archived').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const chatRoomMembers = pgTable('chat_room_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').references(() => chatRooms.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: varchar('role', { length: 20 }).default('member'), // admin, member
  lastReadAt: timestamp('last_read_at'),
  isMuted: boolean('is_muted').default(false),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('idx_chatmember_room_user').on(table.roomId, table.userId),
]);

// ============================================================
// 8. Messages (T06)
// ============================================================
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').references(() => chatRooms.id).notNull(),
  senderId: uuid('sender_id').references(() => users.id),
  parentId: uuid('parent_id'), // thread reply
  content: text('content').notNull(),
  type: varchar('type', { length: 20 }).default('text'), // text, file, image, system, ai_response
  fileUrl: varchar('file_url', { length: 500 }),
  fileName: varchar('file_name', { length: 200 }),
  fileSize: bigint('file_size', { mode: 'number' }),
  isPinned: boolean('is_pinned').default(false),
  isEdited: boolean('is_edited').default(false),
  isDeleted: boolean('is_deleted').default(false),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_messages_room').on(table.roomId),
  index('idx_messages_sender').on(table.senderId),
]);

// ============================================================
// 9. Attendance (T08)
// ============================================================
export const attendances = pgTable('attendances', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  date: date('date').notNull(),
  checkInTime: timestamp('check_in_time'),
  checkOutTime: timestamp('check_out_time'),
  checkInMethod: varchar('check_in_method', { length: 10 }), // qr, gps, ip, manual
  checkOutMethod: varchar('check_out_method', { length: 10 }),
  workHours: decimal('work_hours', { precision: 4, scale: 2 }),
  overtimeHours: decimal('overtime_hours', { precision: 4, scale: 2 }).default('0'),
  status: varchar('status', { length: 20 }).default('normal'),
  // normal, late, early_leave, absent, vacation, half_day, overtime
  note: text('note'),
  ipAddress: varchar('ip_address', { length: 45 }),
  location: jsonb('location').$type<{ lat: number; lng: number }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_attendance_user_date').on(table.userId, table.date),
  index('idx_attendance_company').on(table.companyId),
]);

// ============================================================
// 10. Vacations (T09)
// ============================================================
export const vacations = pgTable('vacations', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  // annual, half_am, half_pm, sick, maternity, paternity, condolence, public, menstrual, childcare
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  days: decimal('days', { precision: 3, scale: 1 }).notNull(),
  reason: text('reason'),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  // pending, approved, rejected, cancelled
  approverId: uuid('approver_id').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_vacations_user').on(table.userId),
  index('idx_vacations_company').on(table.companyId),
]);

// ============================================================
// 11. Vacation Balances (T10)
// ============================================================
export const vacationBalances = pgTable('vacation_balances', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  year: integer('year').notNull(),
  totalDays: decimal('total_days', { precision: 4, scale: 1 }).default('15'),
  usedDays: decimal('used_days', { precision: 4, scale: 1 }).default('0'),
  remainingDays: decimal('remaining_days', { precision: 4, scale: 1 }).default('15'),
  carriedOverDays: decimal('carried_over_days', { precision: 4, scale: 1 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('idx_vb_user_year').on(table.userId, table.year),
]);

// ============================================================
// 12. Calendar Events (T11)
// ============================================================
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  allDay: boolean('all_day').default(false),
  location: varchar('location', { length: 200 }),
  color: varchar('color', { length: 7 }),
  scope: varchar('scope', { length: 20 }).default('personal'), // personal, team, company
  isPrivate: boolean('is_private').default(false),
  recurrence: jsonb('recurrence').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_events_user').on(table.userId),
  index('idx_events_company').on(table.companyId),
]);

// ============================================================
// 13. Projects (T12)
// ============================================================
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).default('planning'),
  // planning, active, on_hold, completed, cancelled
  ownerId: uuid('owner_id').references(() => users.id),
  departmentId: uuid('department_id').references(() => departments.id),
  startDate: date('start_date'),
  endDate: date('end_date'),
  progress: integer('progress').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// 14. Tasks (T13)
// ============================================================
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  projectId: uuid('project_id').references(() => projects.id),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).default('todo'),
  // todo, in_progress, review, done
  priority: varchar('priority', { length: 10 }).default('medium'), // low, medium, high, urgent
  assigneeId: uuid('assignee_id').references(() => users.id),
  createdBy: uuid('created_by').references(() => users.id),
  dueDate: date('due_date'),
  source: varchar('source', { length: 20 }).default('manual'),
  // manual, chat_ai, meeting, messenger
  tags: jsonb('tags').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_tasks_assignee').on(table.assigneeId),
  index('idx_tasks_company').on(table.companyId),
]);

// ============================================================
// 15. Clients (T15) - CRM
// ============================================================
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  type: varchar('type', { length: 20 }).default('customer'),
  // customer, partner, prospect, vendor
  industry: varchar('industry', { length: 50 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 100 }),
  address: text('address'),
  website: varchar('website', { length: 200 }),
  assignedTo: uuid('assigned_to').references(() => users.id),
  note: text('note'),
  tags: jsonb('tags').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_clients_company').on(table.companyId),
  index('idx_clients_assigned').on(table.assignedTo),
]);

// ============================================================
// 16. Contacts (T16) - CRM
// ============================================================
export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  clientId: uuid('client_id').references(() => clients.id),
  name: varchar('name', { length: 50 }).notNull(),
  position: varchar('position', { length: 50 }),
  department: varchar('department', { length: 50 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 100 }),
  businessCardUrl: varchar('business_card_url', { length: 500 }),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// 17. Deals (T17) - CRM Pipeline
// ============================================================
export const deals = pgTable('deals', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  clientId: uuid('client_id').references(() => clients.id),
  title: varchar('title', { length: 200 }).notNull(),
  amount: decimal('amount', { precision: 15, scale: 0 }),
  stage: varchar('stage', { length: 20 }).default('lead'),
  // lead, qualified, proposal, negotiation, closed_won, closed_lost
  probability: integer('probability').default(0),
  assignedTo: uuid('assigned_to').references(() => users.id),
  expectedCloseDate: date('expected_close_date'),
  closedAt: timestamp('closed_at'),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_deals_company').on(table.companyId),
  index('idx_deals_assigned').on(table.assignedTo),
]);

// ============================================================
// 18. AI Conversations (T53)
// ============================================================
export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 200 }),
  modelProvider: varchar('model_provider', { length: 20 }).default('openai'),
  // openai, anthropic, google, huchu
  modelName: varchar('model_name', { length: 50 }).default('gpt-4o'),
  totalTokens: integer('total_tokens').default(0),
  totalCost: decimal('total_cost', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const aiMessages = pgTable('ai_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => aiConversations.id).notNull(),
  role: varchar('role', { length: 10 }).notNull(), // user, assistant, system
  content: text('content').notNull(),
  tokensUsed: integer('tokens_used').default(0),
  functionCalls: jsonb('function_calls').$type<Record<string, unknown>[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// 19. Bookmarks (T49)
// ============================================================
export const bookmarkFolders = pgTable('bookmark_folders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  color: varchar('color', { length: 7 }),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bookmarks = pgTable('bookmarks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  folderId: uuid('folder_id').references(() => bookmarkFolders.id),
  title: varchar('title', { length: 200 }).notNull(),
  url: varchar('url', { length: 500 }),
  type: varchar('type', { length: 20 }).default('page'),
  // page, document, external, feature
  description: text('description'),
  favicon: varchar('favicon', { length: 500 }),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// 20. Notifications (T57)
// ============================================================
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  // approval, task, chat, meeting, system, mention, deadline
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content'),
  link: varchar('link', { length: 500 }),
  isRead: boolean('is_read').default(false),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_notifications_user').on(table.userId),
  index('idx_notifications_read').on(table.userId, table.isRead),
]);

// ============================================================
// 21. Approvals (T56)
// ============================================================
export const approvals = pgTable('approvals', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  // vacation, expense, contract, overtime, document
  referenceId: uuid('reference_id').notNull(),
  requesterId: uuid('requester_id').references(() => users.id).notNull(),
  approverId: uuid('approver_id').references(() => users.id).notNull(),
  status: varchar('status', { length: 20 }).default('pending'),
  // pending, approved, rejected
  comment: text('comment'),
  decidedAt: timestamp('decided_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// 22. Audit Logs (T58)
// ============================================================
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 50 }).notNull(),
  // create, update, delete, login, logout, approve, reject, delegate, etc.
  resource: varchar('resource', { length: 50 }).notNull(),
  resourceId: uuid('resource_id'),
  details: jsonb('details').$type<Record<string, unknown>>(),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_audit_company').on(table.companyId),
  index('idx_audit_user').on(table.userId),
]);

// ============================================================
// Relations
// ============================================================
export const companiesRelations = relations(companies, ({ many }) => ({
  users: many(users),
  departments: many(departments),
  moduleActivations: many(moduleActivations),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, { fields: [users.companyId], references: [companies.id] }),
  department: one(departments, { fields: [users.departmentId], references: [departments.id] }),
  supervisor: one(users, { fields: [users.reportsTo], references: [users.id] }),
  attendances: many(attendances),
  vacations: many(vacations),
  tasks: many(tasks),
  notifications: many(notifications),
  bookmarks: many(bookmarks),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  company: one(companies, { fields: [departments.companyId], references: [companies.id] }),
  members: many(users),
}));
