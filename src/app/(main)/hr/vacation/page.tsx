'use client';

import { useState } from 'react';
import { useApi, useMutation } from '@/hooks/useApi';
import { useToastStore } from '@/stores/toast-store';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { Plus, CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

const typeLabels: Record<string, string> = {
  annual: '연차', half_am: '오전 반차', half_pm: '오후 반차', sick: '병가',
  maternity: '출산휴가', paternity: '배우자출산휴가', condolence: '경조사',
};

const statusConfig: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  pending: { label: '대기', color: 'bg-yellow-50 text-yellow-700', icon: Clock },
  approved: { label: '승인', color: 'bg-green-50 text-green-700', icon: CheckCircle },
  rejected: { label: '반려', color: 'bg-red-50 text-red-700', icon: XCircle },
  cancelled: { label: '취소', color: 'bg-gray-50 text-gray-700', icon: AlertCircle },
};

interface Vacation {
  id: string;
  userId: string;
  userName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
}

interface VacationBalance {
  userId: string;
  userName: string;
  year: number;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  id?: string;
}

interface VacationResponse {
  vacations: Vacation[];
  balances: VacationBalance[];
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-1/4" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-1/4" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-1/4" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-1/4" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-1/3" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-1/4" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-1/4" /></td>
    </tr>
  );
}

export default function VacationPage() {
  const [tab, setTab] = useState<'requests' | 'balances'>('requests');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const { data: vacData, loading: vacLoading, refetch } = useApi<VacationResponse>('/api/vacations');
  const { mutate: submitVacation, loading: submitting } = useMutation('/api/vacations', 'POST');
  const { mutate: approveVacation, loading: approving } = useMutation('/api/vacations/{id}/approve', 'PATCH');
  const { mutate: rejectVacation, loading: rejecting } = useMutation('/api/vacations/{id}/reject', 'PATCH');

  const addToast = useToastStore(s => s.addToast);

  const vacations = vacData?.vacations || [];
  const balances = vacData?.balances || [];

  const handleSubmitVacation = async () => {
    if (!formData.startDate || !formData.endDate) {
      addToast({
        type: 'error',
        title: '날짜를 선택해주세요',
      });
      return;
    }

    try {
      await submitVacation(formData);
      setShowModal(false);
      setFormData({
        type: 'annual',
        startDate: '',
        endDate: '',
        reason: '',
      });
      addToast({
        type: 'success',
        title: '휴가 신청이 완료되었습니다',
      });
      refetch();
    } catch (err) {
      addToast({
        type: 'error',
        title: '휴가 신청 실패',
        message: err instanceof Error ? err.message : '다시 시도해주세요',
      });
    }
  };

  const handleApproveVacation = async (_vacationId: string) => {
    try {
      await approveVacation();
      addToast({
        type: 'success',
        title: '휴가를 승인했습니다',
      });
      refetch();
    } catch (err) {
      addToast({
        type: 'error',
        title: '휴가 승인 실패',
        message: err instanceof Error ? err.message : '다시 시도해주세요',
      });
    }
  };

  const handleRejectVacation = async (_vacationId: string) => {
    try {
      await rejectVacation();
      addToast({
        type: 'success',
        title: '휴가를 반려했습니다',
      });
      refetch();
    } catch (err) {
      addToast({
        type: 'error',
        title: '휴가 반려 실패',
        message: err instanceof Error ? err.message : '다시 시도해주세요',
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">휴가 관리</h1>
          <p className="text-sm text-gray-500 mt-1">휴가 신청 및 잔여 현황을 관리합니다</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />휴가 신청
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button onClick={() => setTab('requests')} className={cn('px-4 py-2 text-sm font-medium rounded-md transition-colors', tab === 'requests' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}>휴가 신청 내역</button>
        <button onClick={() => setTab('balances')} className={cn('px-4 py-2 text-sm font-medium rounded-md transition-colors', tab === 'balances' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}>연차 잔여 현황</button>
      </div>

      {tab === 'requests' ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">신청자</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">유형</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">기간</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">일수</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">사유</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">상태</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">처리</th>
              </tr>
            </thead>
            <tbody>
              {vacLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : vacations.length > 0 ? (
                vacations.map(vac => {
                  const status = statusConfig[vac.status];
                  return (
                    <tr key={vac.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{vac.userName.charAt(0)}</div>
                          <span className="text-sm font-medium text-gray-900">{vac.userName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{typeLabels[vac.type] || vac.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{vac.startDate} ~ {vac.endDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{vac.days}일</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{vac.reason || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', status.color)}>
                          <status.icon className="w-3 h-3" />{status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {vac.status === 'pending' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleApproveVacation(vac.id)}
                              disabled={approving}
                              className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50"
                            >
                              {approving ? <Loader2 className="w-3 h-3 animate-spin" /> : '승인'}
                            </button>
                            <button
                              onClick={() => handleRejectVacation(vac.id)}
                              disabled={rejecting}
                              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
                            >
                              {rejecting ? <Loader2 className="w-3 h-3 animate-spin" /> : '반려'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                    휴가 신청 내역이 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">직원</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">부서</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">총 부여</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">사용</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">잔여</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">소진율</th>
              </tr>
            </thead>
            <tbody>
              {vacLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : balances.length > 0 ? (
                balances.map(bal => {
                  const pct = Math.round((bal.usedDays / bal.totalDays) * 100);
                  return (
                    <tr key={bal.id || bal.userId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{bal.userName?.charAt(0)}</div>
                          <span className="text-sm font-medium text-gray-900">{bal.userName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">-</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{bal.totalDays}일</td>
                      <td className="px-4 py-3 text-sm text-orange-600 font-medium">{bal.usedDays}일</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-semibold">{bal.remainingDays}일</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                    연차 현황 데이터가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* New Vacation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">휴가 신청</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">휴가 유형</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="annual">연차</option>
                  <option value="half_am">오전 반차</option>
                  <option value="half_pm">오후 반차</option>
                  <option value="sick">병가</option>
                  <option value="condolence">경조사</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사유</label>
                <textarea
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="사유를 입력하세요"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmitVacation}
                  disabled={submitting}
                  className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> 신청중...
                    </>
                  ) : (
                    '신청하기'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
