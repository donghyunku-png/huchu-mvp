'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { cn, formatTime } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { Clock, CheckCircle, XCircle, AlertTriangle, Calendar, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const statusLabels: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  normal: { label: '정상', color: 'bg-green-50 text-green-700', icon: CheckCircle },
  late: { label: '지각', color: 'bg-yellow-50 text-yellow-700', icon: AlertTriangle },
  early_leave: { label: '조퇴', color: 'bg-orange-50 text-orange-700', icon: AlertTriangle },
  absent: { label: '결근', color: 'bg-red-50 text-red-700', icon: XCircle },
  vacation: { label: '휴가', color: 'bg-blue-50 text-blue-700', icon: Calendar },
  holiday: { label: '공휴일', color: 'bg-purple-50 text-purple-700', icon: Calendar },
};

interface Attendance {
  id: string;
  userId: string;
  userName: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: string;
  workHours: number | null;
  checkInMethod: string;
  department?: string;
  position?: string;
}

interface AttendanceResponse {
  attendances: Attendance[];
  summary: {
    total: number;
    normal: number;
    late: number;
    working: number;
    vacation: number;
    absent: number;
  };
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-3 bg-gray-100 rounded w-1/4" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-1/4" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-1/4" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-1/4" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-1/4" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-1/4" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-1/4" /></td>
    </tr>
  );
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState('2026-02-19');
  const [filter, setFilter] = useState('all');

  const { data: attData, loading: attLoading } = useApi<AttendanceResponse>('/api/attendance');

  const attendances = attData?.attendances || [];
  const summary = attData?.summary || {
    total: 0,
    normal: 0,
    late: 0,
    working: 0,
    vacation: 0,
    absent: 0,
  };

  const filtered = filter === 'all' ? attendances : attendances.filter(a => a.status === filter);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">출퇴근 관리</h1>
          <p className="text-sm text-gray-500 mt-1">직원 출퇴근 현황을 관리합니다</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5"><Download className="w-4 h-4" />엑셀 다운로드</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {attLoading ? (
          <>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="h-10 bg-gray-100 rounded mb-2" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-50">
                <span className="text-xl font-bold text-green-600">{summary.normal}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">정상 출근</p>
                <p className="text-xs text-gray-400">전체 {summary.total}명 중</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-50">
                <span className="text-xl font-bold text-yellow-600">{summary.late}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">지각</p>
                <p className="text-xs text-gray-400">전체 {summary.total}명 중</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50">
                <span className="text-xl font-bold text-blue-600">{summary.vacation}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">휴가</p>
                <p className="text-xs text-gray-400">전체 {summary.total}명 중</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-50">
                <span className="text-xl font-bold text-red-600">{summary.absent}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">결근</p>
                <p className="text-xs text-gray-400">전체 {summary.total}명 중</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Date Selector & Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-1 rounded hover:bg-gray-100"><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-sm font-medium text-gray-900 border-none focus:outline-none"
            />
          </div>
          <button className="p-1 rounded hover:bg-gray-100"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
          <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">오늘</button>
        </div>
        <div className="flex items-center gap-2">
          {['all', 'normal', 'late', 'vacation', 'absent'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn('px-3 py-1.5 text-xs rounded-full font-medium transition-colors',
                filter === f ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {f === 'all' ? '전체' : statusLabels[f]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">직원</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">부서</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">상태</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">출근 시간</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">퇴근 시간</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">근무 시간</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">방법</th>
            </tr>
          </thead>
          <tbody>
            {attLoading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : filtered.length > 0 ? (
              filtered.map(att => {
                const status = statusLabels[att.status] || { label: att.status, color: 'bg-gray-50 text-gray-700', icon: Clock };
                return (
                  <tr key={att.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{att.userName.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{att.userName}</p>
                          <p className="text-xs text-gray-400">{att.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{att.department || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', status.color)}>
                        <status.icon className="w-3 h-3" />{status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{att.checkInTime ? formatTime(att.checkInTime) : '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{att.checkOutTime ? formatTime(att.checkOutTime) : '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{att.workHours ? `${att.workHours}h` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-400 capitalize">{att.checkInMethod}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                  데이터가 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
