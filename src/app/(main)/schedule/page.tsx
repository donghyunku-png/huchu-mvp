'use client';

import { useState } from 'react';
import { useApi, useMutation } from '@/hooks/useApi';
import { useToastStore } from '@/stores/toast-store';
import { cn } from '@/lib/utils';
import { Calendar, CheckSquare, Plus, ChevronLeft, ChevronRight, Clock, BarChart3, Loader2 } from 'lucide-react';

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

interface Task {
  id: string;
  title: string;
  description?: string;
  assigneeId: string;
  assigneeName: string;
  status: string;
  priority: string;
  dueDate?: string;
  createdAt: string;
  source?: string;
}

interface TasksData {
  tasks: Task[];
  stats: {
    total: number;
    todo: number;
    in_progress: number;
    review: number;
    done: number;
  };
}

export default function SchedulePage() {
  const [tab, setTab] = useState<'tasks' | 'calendar' | 'projects'>('tasks');
  const [currentMonth] = useState(new Date(2026, 1, 19)); // Feb 19, 2026
  const addToast = useToastStore(s => s.addToast);

  // Fetch tasks
  const { data: tasksData, loading: tasksLoading, refetch: refetchTasks } = useApi<TasksData>('/api/tasks');

  // Create task mutation
  const { mutate: createTask, loading: creatingTask } = useMutation<Task, Partial<Task>>('/api/tasks', 'POST');

  const tasks = tasksData?.tasks || [];
  const _stats = tasksData?.stats || { total: 0, todo: 0, in_progress: 0, review: 0, done: 0 };

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const calendarDays = Array.from({ length: 28 }, (_, i) => i + 1);

  const handleCreateTask = async () => {
    try {
      const result = await createTask({
        title: '새 할일',
        status: 'todo',
        priority: 'medium'
      });
      if (result) {
        await refetchTasks();
        addToast({
          type: 'success',
          title: '할일이 생성되었습니다.'
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: '할일 생성 실패',
        message: error instanceof Error ? error.message : '할일을 생성하지 못했습니다.'
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">일정 / 할일</h1>
          <p className="text-sm text-gray-500 mt-1">프로젝트와 업무를 관리합니다</p>
        </div>
        <button
          onClick={handleCreateTask}
          disabled={creatingTask}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-1.5 disabled:opacity-50"
        >
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
        <div>
          {tasksLoading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {statusColumns.map(col => {
                const colTasks = tasks.filter(t => t.status === col.key);
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
                          {task.source && task.source !== 'manual' && (
                            <div className="mt-2">
                              <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                                {task.source === 'chat_ai' ? 'AI 생성' : task.source === 'meeting' ? '회의' : '메신저'}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                      <button onClick={handleCreateTask} className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-colors">+ 할일 추가</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'calendar' && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button className="p-1 rounded hover:bg-gray-100"><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
              <h3 className="font-semibold text-gray-900">{currentMonth.getFullYear()}년 {String(currentMonth.getMonth() + 1).padStart(2, '0')}월</h3>
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
              const _dateStr = `2026-02-${String(day).padStart(2, '0')}`;
              const isToday = day === 19;
              return (
                <div key={day} className={cn('bg-white p-2 min-h-[80px] hover:bg-gray-50 transition-colors cursor-pointer', isToday && 'ring-2 ring-orange-500 ring-inset')}>
                  <span className={cn('text-xs font-medium', isToday ? 'bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center' : 'text-gray-700')}>{day}</span>
                  <div className="mt-1 space-y-0.5">
                    {/* No events API - placeholder */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'projects' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">프로젝트 관리 기능이 준비 중입니다.</p>
            <p className="text-sm text-gray-400 mt-1">곧 이용 가능합니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}
