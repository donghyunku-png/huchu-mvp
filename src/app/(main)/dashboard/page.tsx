'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { mockAttendances, mockTasks, mockEvents, mockNotifications, mockBookmarks, mockVacationBalances, mockDeals } from '@/data/mock-data';
import { formatCurrency, formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
  Clock, CheckCircle2, Calendar, Star, Bell,
  TrendingUp, Users, DollarSign, BarChart3,
  Square, ChevronRight
} from 'lucide-react';

export default function DashboardPage() {
  const { user, company } = useAuthStore();
  const [checkedOut, setCheckedOut] = useState(false);

  const today = new Date();
  const dateStr = today.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  const myBalance = mockVacationBalances.find(b => b.userId === user?.id);
  const myTasks = mockTasks.filter(t => t.assigneeId === user?.id && t.status !== 'done');
  const todayEvents = mockEvents.filter(e => e.startAt.startsWith('2026-02-19'));
  const unreadNotifications = mockNotifications.filter(n => !n.isRead);
  const myAttendance = mockAttendances.find(a => a.userId === user?.id);

  // Stats
  const totalDealAmount = mockDeals.filter(d => d.stage !== 'closed_lost').reduce((sum, d) => sum + (d.amount || 0), 0);
  const wonDealAmount = mockDeals.filter(d => d.stage === 'closed_won').reduce((sum, d) => sum + (d.amount || 0), 0);

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
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-green-600 font-medium flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+2</span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-gray-900">{company?.employeeCount}</p>
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
            <p className="text-2xl font-bold text-gray-900">{mockAttendances.filter(a => a.checkIn).length}/{mockAttendances.length}</p>
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
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(wonDealAmount)}</p>
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
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDealAmount)}</p>
            <p className="text-xs text-gray-500">파이프라인 총액</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Tasks */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
                나의 할일 <span className="text-orange-500">({myTasks.length})</span>
              </h2>
              <button className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1">전체보기 <ChevronRight className="w-3 h-3" /></button>
            </div>
            <div className="space-y-2">
              {myTasks.slice(0, 5).map(task => (
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
              ))}
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
              {mockNotifications.slice(0, 4).map(noti => (
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
                    <p className="text-xs text-gray-500 mt-0.5">{noti.body}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(noti.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  {!noti.isRead && <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />}
                </div>
              ))}
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
              {myAttendance?.checkIn && (
                <p className="text-sm text-green-600 mt-2">출근: {formatTime(myAttendance.checkIn)}</p>
              )}
              <div className="mt-4">
                {!checkedOut ? (
                  <button
                    onClick={() => setCheckedOut(true)}
                    className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Square className="w-4 h-4" /> 퇴근하기
                  </button>
                ) : (
                  <div className="text-sm text-gray-500">
                    <p>퇴근: {today.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-green-600 font-medium mt-1">수고하셨습니다!</p>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">연차: <span className="font-semibold text-gray-900">{myBalance?.remainingDays}/{myBalance?.totalDays}</span> 남음</p>
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
              {todayEvents.length > 0 ? todayEvents.map(evt => (
                <div key={evt.id} className="flex items-start gap-3 p-2">
                  <div className="w-1 h-full rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: evt.color || '#6B7280', minHeight: '32px' }} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{evt.title}</p>
                    <p className="text-xs text-gray-500">
                      {evt.allDay ? '종일' : `${new Date(evt.startAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(evt.endAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                    {evt.location && <p className="text-xs text-gray-400 mt-0.5">📍 {evt.location}</p>}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-400 text-center py-4">오늘 일정이 없습니다</p>
              )}
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
              {mockBookmarks.slice(0, 5).map(bm => (
                <a key={bm.id} href={bm.url} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-sm">{bm.icon}</span>
                  <span className="text-sm text-gray-700">{bm.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
