'use client';

import { mockDeals } from '@/data/mock-data';
import { cn, formatCurrency } from '@/lib/utils';
import { DollarSign, TrendingUp, Clock, Plus } from 'lucide-react';

const stages = [
  { key: 'lead', label: '리드', color: 'bg-gray-200' },
  { key: 'qualified', label: '적격', color: 'bg-blue-200' },
  { key: 'proposal', label: '제안', color: 'bg-yellow-200' },
  { key: 'negotiation', label: '협상', color: 'bg-orange-200' },
  { key: 'closed_won', label: '성사', color: 'bg-green-200' },
  { key: 'closed_lost', label: '실패', color: 'bg-red-200' },
];

export default function PipelinePage() {
  const totalAmount = mockDeals.filter(d => !d.stage.startsWith('closed')).reduce((sum, d) => sum + (d.amount || 0), 0);
  const wonAmount = mockDeals.filter(d => d.stage === 'closed_won').reduce((sum, d) => sum + (d.amount || 0), 0);
  const avgProbability = Math.round(mockDeals.filter(d => !d.stage.startsWith('closed')).reduce((sum, d) => sum + (d.probability || 0), 0) / mockDeals.filter(d => !d.stage.startsWith('closed')).length);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">영업 파이프라인을 관리합니다</p>
        </div>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-1.5"><Plus className="w-4 h-4" />거래 추가</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-500">파이프라인 총액</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-500">성사 금액</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(wonAmount)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-500">평균 성사확률</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{avgProbability}%</p>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map(stage => {
          const stageDeals = mockDeals.filter(d => d.stage === stage.key);
          const stageTotal = stageDeals.reduce((sum, d) => sum + (d.amount || 0), 0);
          return (
            <div key={stage.key} className="flex-shrink-0 w-64">
              <div className="flex items-center gap-2 mb-3">
                <div className={cn('w-3 h-3 rounded-full', stage.color)} />
                <h3 className="font-semibold text-sm text-gray-700">{stage.label}</h3>
                <span className="text-xs text-gray-400">{stageDeals.length}</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{formatCurrency(stageTotal)}</p>
              <div className="space-y-2">
                {stageDeals.map(deal => (
                  <div key={deal.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow cursor-pointer">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{deal.title}</h4>
                    <p className="text-xs text-gray-500 mb-2">{deal.clientName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{deal.amount ? formatCurrency(deal.amount) : '-'}</span>
                      {deal.probability !== undefined && deal.probability < 100 && (
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">{deal.probability}%</span>
                      )}
                    </div>
                    {deal.expectedClose && (
                      <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />예상 마감: {deal.expectedClose}</p>
                    )}
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">{deal.ownerName.charAt(0)}</div>
                      <span className="text-xs text-gray-400">{deal.ownerName}</span>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-colors">+ 거래 추가</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
