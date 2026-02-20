export interface Company {
  id: string;
  name: string;
  businessNumber: string;
  representative: string;
  address: string;
  phone: string;
  industry: string;
  employeeCount: number;
  plan: 'free' | 'starter' | 'business' | 'enterprise';
  logoUrl?: string;
  domain?: string;
  aiTokenLimit: number;
  storageLimitGb: number;
}

export interface User {
  id: string;
  companyId: string;
  email: string;
  name: string;
  phone?: string;
  profileImageUrl?: string;
  departmentId?: string;
  department?: string;
  position?: string;
  role: 'super_admin' | 'company_admin' | 'dept_admin' | 'team_lead' | 'employee' | 'hr' | 'finance' | 'sales' | 'executive';
  status: 'active' | 'inactive' | 'invited';
  hireDate?: string;
}

export interface Department {
  id: string;
  companyId: string;
  parentId?: string;
  name: string;
  depth: number;
  sortOrder: number;
  color?: string;
}

export interface ChatRoom {
  id: string;
  companyId: string;
  type: 'dm' | 'group' | 'public_channel' | 'private_channel';
  name?: string;
  topic?: string;
  createdBy: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  members: User[];
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  parentId?: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'system' | 'ai_response';
  fileId?: string;
  isPinned: boolean;
  createdAt: string;
  reactions?: { emoji: string; users: string[] }[];
}

export interface Attendance {
  id: string;
  userId: string;
  userName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  checkInMethod: 'qr' | 'gps' | 'ip' | 'manual' | 'web';
  workHours?: number;
  overtimeHours: number;
  status: 'normal' | 'late' | 'early_leave' | 'absent' | 'holiday' | 'vacation';
  note?: string;
}

export interface Vacation {
  id: string;
  userId: string;
  userName: string;
  type: 'annual' | 'half_am' | 'half_pm' | 'sick' | 'maternity' | 'paternity' | 'condolence';
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approverId?: string;
  approverName?: string;
}

export interface VacationBalance {
  id: string;
  userId: string;
  year: number;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

export interface CalendarEvent {
  id: string;
  companyId: string;
  creatorId: string;
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  allDay: boolean;
  scope: 'personal' | 'team' | 'company';
  category?: string;
  color?: string;
  location?: string;
}

export interface Task {
  id: string;
  companyId: string;
  projectId?: string;
  title: string;
  description?: string;
  assigneeId: string;
  assigneeName: string;
  creatorId: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  type: 'my' | 'requested' | 'referenced';
  source: 'manual' | 'chat_ai' | 'meeting' | 'messenger';
}

export interface Project {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  budget?: number;
  managerId: string;
  managerName: string;
  taskCount: number;
  completedTaskCount: number;
}

export interface Client {
  id: string;
  companyId: string;
  name: string;
  type: 'customer' | 'partner' | 'prospect' | 'vendor';
  classification: 'sales' | 'purchase' | 'both';
  businessNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
  industry?: string;
  assignedTo?: string;
  assignedToName?: string;
  tags?: string[];
}

export interface Contact {
  id: string;
  clientId: string;
  companyId: string;
  name: string;
  title?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  cardImageUrl?: string;
}

export interface Deal {
  id: string;
  companyId: string;
  clientId: string;
  clientName: string;
  title: string;
  amount?: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability?: number;
  ownerId: string;
  ownerName: string;
  expectedClose?: string;
}

export interface AIConversation {
  id: string;
  userId: string;
  companyId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  tokensUsed?: number;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  folderId?: string;
  type: 'page' | 'document' | 'external' | 'feature';
  title: string;
  url: string;
  icon?: string;
  sortOrder: number;
}

export interface BookmarkFolder {
  id: string;
  userId: string;
  name: string;
  sortOrder: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'approval' | 'task' | 'chat' | 'meeting' | 'system' | 'mention' | 'deadline';
  title: string;
  body?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}
