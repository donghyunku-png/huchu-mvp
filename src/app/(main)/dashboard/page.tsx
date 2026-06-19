'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useApi, useMutation } from '@/hooks/useApi';
import { useToastStore } from '@/stores/toast-store';
import { formatCurrency, cn } from '@/lib/utils';
import {
  Clock, CheckCircle2, Calendar, Star, Bell,
  TrendingUp, Users, DollarSign, BarChart3,
  Square, ChevronRight, Loader2
} from 'lucide-react';

interface DashboardData {
  widgets: Record<string, unknown>[];
  role: string;
  personalStats: {
    name: string;
    todayAttendance: boolean;
    assignedTasks: number;
    completedTasks: number;
    remainingVacationDays: number;
  };
  companyStats?: {
    totalEmployees: number;
    departmentCount: number;
    todayAttendance: number;
    attendanceRate: number;
    pendingApprovals: number;
  };
}

interface NotificationData {
  notifications: Array<{
    id: string;
    title: string;
    content: string;
    body?: string;
    type: string;
    isRead: boolean;
    createdAt: string;
  }>;
  stats: {
    total: number;
    unread: number;
  };
}

interface TaskData {
  tasks: Array<{
    id: string;
    title: string;
    status: 'todo' | 'in_progress' | 'review' | 'done';
    priority: 'urgent' | 'high' | 'medium' | 'low';
    dueDate: string;
    assigneeName: string;
    createdAt: string;
  }>;
  stats: {
    total: number;
    todo: number;
    in_progress: number;
    review: number;
    done: number;
  };
}


// Skeleton loaders
function SkeletonCard() {
  return <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
    <div className="h-10 bg-gray-100 rounded mb-4 w-1/3" />
    <div className="h-6 bg-gray-100 rounded mb-2" />
    <div className="h-4 bg-gray-100 rounded w-1/2" />
  </div>;
}

function SkeletonRow() {
  return <div className="p-3 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  </div>;
}

export default function DashboardPage() {
  const { user, company } = useAuthStore();
  const addToast = useToastStore(s => s.addToast);

  const { data: dashboard, loading: dashLoading } = useApi<DashboardData>('/api/dashboard');
  const { data: notifData, loading: notifLoading } = useApi<NotificationData>('/api/notifications');
  const { data: taskData, loading: taskLoading } = useApi<TaskData>('/api/tasks');
  const { mutate: checkInOut, loading: checkingInOut } = useMutation('/api/attendance', 'POST');

  const [checkedOut, setCheckedOut] = useState(false);

  const today = new Date();
  const dateStr = today.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  // Safe data extraction
  const personalStats = dashboard?.personalStats || {
    name: user?.name || '',
    todayAttendance: false,
    assignedTasks: 0,
    completedTasks: 0,
    remainingVacationDays: 0,
  };

  const companyStats = dashboard?.companyStats || {
    totalEmployees: company?.employeeCount || 0,
    departmentCount: 0,
    todayAttendance: 0,
    attendanceRate: 0,
    pendingApprovals: 0,
  };

  const tasks = taskData?.tasks || [];
  const notifications = notifData?.notifications || [];
  const unreadNotifications = notifications.filter(n => !n.isRead);

  const handleCheckInOut = async () => {
    try {
      await checkInOut({ action: checkedOut ? 'checkout' : 'checkin' });
      setCheckedOut(!checkedOut);
      addToast({
        type: 'success',
        title: checkedOut ? '퇴근 처리되었습니다' : '출근 처리되었습니다',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: '출퇴근 처리 실패',
        message: err instanceof Error ? err.message : '다시 시도해주세요',
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">안녕하세요, {user?.name}님 👋</h1>
          <p className="text-sm text-gray-500 mt-1">{dateStr}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{company?.name}</p>
          <p className="text-xs text-gray-400">플랜: {company?.plan?.toUpperCase()}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {dashLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs text-green-600 font-medium flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+2</span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">{companyStats.totalEmployees}</p>
                <p className="text-xs text-gray-500">전체 직원</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs text-gray-400">오늘</span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">{companyStats.todayAttendance}/{companyStats.totalEmployees}</p>
                <p className="text-xs text-gray-500">출근 현황</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-xs text-green-600 font-medium flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />12%</span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(0)}</p>
                <p className="text-xs text-gray-500">이번 달 매출</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs text-gray-400">진행중</span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(0)}</p>
                <p className="text-xs text-gray-500">파이프라인 총액</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Tasks */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
                나의 할일 <span className="text-orange-500">({tasks.length})</span>
              </h2>
              <button className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1">전체보기 <ChevronRight className="w-3 h-3" /></button>
            </div>
            <div className="space-y-2">
              {taskLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : tasks.length > 0 ? (
                tasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className={cn(
                      'w-2 h-2 rounded-full flex-shrink-0',
                      task.priority === 'urgent' ? 'bg-red-500' :
                      task.priority === 'high' ? 'bg-orange-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-300'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                      <p className="text-xs text-gray-400">{task.dueDate && `마감: ${task.dueDate}`}</p>
                    </div>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      task.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                      task.status === 'review' ? 'bg-purple-50 text-purple-700' :
                      'bg-gray-50 text-gray-600'
                    )}>
                      {task.status === 'todo' ? '예정' : task.status === 'in_progress' ? '진행중' : '검토'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">할일이 없습니다</p>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-500" />
                알림 <span className="text-red-500">({unreadNotifications.length})</span>
              </h2>
            </div>
            <div className="space-y-2">
              {notifLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : notifications.length > 0 ? (
                notifications.slice(0, 4).map(noti => (
                  <div key={noti.id} className={cn(
                    'flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer',
                    !noti.isRead ? 'bg-orange-50/50 hover:bg-orange-50' : 'hover:bg-gray-50'
                  )}>
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm',
                      noti.type === 'approval' ? 'bg-yellow-100' :
                      noti.type === 'task' ? 'bg-blue-100' :
                      noti.type === 'chat' ? 'bg-green-100' :
                      noti.type === 'meeting' ? 'bg-purple-100' : 'bg-gray-100'
                    )}>
                      {noti.type === 'approval' ? '📋' : noti.type === 'task' ? '✅' : noti.type === 'chat' ? '💬' : noti.type === 'meeting' ? '📅' : '🔔'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{noti.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{noti.content || noti.body}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(noti.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    {!noti.isRead && <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">알림이 없습니다</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Check-in Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-orange-500" />
              출퇴근
            </h2>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{today.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</p>
              {personalStats.todayAttendance && (
                <p className="text-sm text-green-600 mt-2">출근: {today.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</p>
              )}
              <div className="mt-4">
                {!checkedOut ? (
                  <button
                    onClick={handleCheckInOut}
                    disabled={checkingInOut}
                    className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkingInOut ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> 처리중...
                      </>
                    ) : (
                      <>
                        <Square className="w-4 h-4" /> 퇴근하기
                      </>
                    )}
                  </button>
                ) : (
                  <div className="text-sm text-gray-500">
                    <p>퇴근: {today.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-green-600 font-medium mt-1">수고하셨습니다!</p>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">연차: <span className="font-semibold text-gray-900">{personalStats.remainingVacationDays}</span> 남음</p>
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                오늘 일정
              </h2>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-400 text-center py-4">오늘 일정이 없습니다</p>
            </div>
          </div>

          {/* Bookmarks */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-500" />
                북마크
              </h2>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400 text-center py-4">북마크가 없습니다</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
