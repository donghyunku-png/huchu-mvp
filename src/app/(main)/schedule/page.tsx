'use client';

import { useState } from 'react';
import { mockTasks, mockEvents, mockProjects } from '@/data/mock-data';
import { cn } from '@/lib/utils';
import { Calendar, CheckSquare, Plus, ChevronLeft, ChevronRight, Clock, BarChart3 } from 'lucide-react';

const priorityColors: Record<string, string> = {
  urgent: 'border-l-red-500 bg-red-50/30',
  high: 'border-l-orange-500 bg-orange-50/30',
  medium: 'border-l-yellow-500',
  low: 'border-l-gray-300',
};

const statusColumns = [
  { key: 'todo', label: '예정', color: 'bg-gray-100' },
  { key: 'in_progress', label: '진행중', color: 'bg-blue-100' },
  { key: 'review', label: '검토', color: 'bg-purple-100' },
  { key: 'done', label: '완료', color: 'bg-green-100' },
];

export default function SchedulePage() {
  const [tab, setTab] = useState<'tasks' | 'calendar' | 'projects'>('tasks');

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const calendarDays = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">일정 / 할일</h1>
          <p className="text-sm text-gray-500 mt-1">프로젝트와 업무를 관리합니다</p>
        </div>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-1.5">
          <Plus className="w-4 h-4" />새로 만들기
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button onClick={() => setTab('tasks')} className={cn('px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5', tab === 'tasks' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500')}>
          <CheckSquare className="w-4 h-4" />할일 (칸반)
        </button>
        <button onClick={() => setTab('calendar')} className={cn('px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5', tab === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500')}>
          <Calendar className="w-4 h-4" />캘린더
        </button>
        <button onClick={() => setTab('projects')} className={cn('px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5', tab === 'projects' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500')}>
          <BarChart3 className="w-4 h-4" />프로젝트
        </button>
      </div>

      {tab === 'tasks' && (
        <div className="grid grid-cols-4 gap-4">
          {statusColumns.map(col => {
            const colTasks = mockTasks.filter(t => t.status === col.key);
            return (
              <div key={col.key} className="flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn('w-3 h-3 rounded-full', col.color)} />
                  <h3 className="font-semibold text-sm text-gray-700">{col.label}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-1.5">{colTasks.length}</span>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {colTasks.map(task => (
                    <div key={task.id} className={cn('bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow cursor-pointer border-l-4', priorityColors[task.priority])}>
                      <p className="text-sm font-medium text-gray-900 mb-2">{task.title}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">{task.assigneeName.charAt(0)}</div>
                          <span className="text-xs text-gray-500">{task.assigneeName}</span>
                        </div>
                        {task.dueDate && (
                          <span className={cn('text-[10px] flex items-center gap-0.5', new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-gray-400')}>
                            <Clock className="w-3 h-3" />{task.dueDate.slice(5)}
                          </span>
                        )}
                      </div>
                      {task.source !== 'manual' && (
                        <div className="mt-2">
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                            {task.source === 'chat_ai' ? 'AI 생성' : task.source === 'meeting' ? '회의' : '메신저'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  <button className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-colors">+ 할일 추가</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'calendar' && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button className="p-1 rounded hover:bg-gray-100"><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
              <h3 className="font-semibold text-gray-900">2026년 2월</h3>
              <button className="p-1 rounded hover:bg-gray-100"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
            </div>
            <button className="text-xs text-orange-600 font-medium">오늘</button>
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {days.map(day => (
              <div key={day} className="bg-gray-50 py-2 text-center text-xs font-semibold text-gray-500">{day}</div>
            ))}
            {/* Empty cells for padding */}
            {Array.from({ length: 6 }, (_, i) => (
              <div key={`empty-${i}`} className="bg-white p-2 min-h-[80px]" />
            ))}
            {calendarDays.map(day => {
              const dateStr = `2026-02-${String(day).padStart(2, '0')}`;
              const dayEvents = mockEvents.filter(e => e.startAt.startsWith(dateStr));
              const isToday = day === 19;
              return (
                <div key={day} className={cn('bg-white p-2 min-h-[80px] hover:bg-gray-50 transition-colors cursor-pointer', isToday && 'ring-2 ring-orange-500 ring-inset')}>
                  <span className={cn('text-xs font-medium', isToday ? 'bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center' : 'text-gray-700')}>{day}</span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.map(evt => (
                      <div key={evt.id} className="text-[10px] px-1 py-0.5 rounded truncate text-white" style={{ backgroundColor: evt.color || '#6B7280' }}>
                        {evt.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'projects' && (
        <div className="space-y-4">
          {mockProjects.map(proj => {
            const pct = Math.round((proj.completedTaskCount / proj.taskCount) * 100);
            return (
              <div key={proj.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{proj.description}</p>
                  </div>
                  <span className={cn('text-xs px-2 py-1 rounded-full font-medium',
                    proj.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                  )}>
                    {proj.status === 'active' ? '진행중' : '계획중'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div><p className="text-xs text-gray-400">담당자</p><p className="text-sm font-medium">{proj.managerName}</p></div>
                  <div><p className="text-xs text-gray-400">기간</p><p className="text-sm font-medium">{proj.startDate} ~ {proj.endDate}</p></div>
                  <div><p className="text-xs text-gray-400">예산</p><p className="text-sm font-medium">{proj.budget ? `₩${(proj.budget / 100000000).toFixed(1)}억` : '-'}</p></div>
                  <div><p className="text-xs text-gray-400">할일</p><p className="text-sm font-medium">{proj.completedTaskCount}/{proj.taskCount}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
