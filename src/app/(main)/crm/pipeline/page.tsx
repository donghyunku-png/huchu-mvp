'use client';

import { useApi, useMutation } from '@/hooks/useApi';
import { useToastStore } from '@/stores/toast-store';
import { cn, formatCurrency } from '@/lib/utils';
import { DollarSign, TrendingUp, Clock, Plus, Loader2 } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  stage: string;
  amount: number;
  probability?: number;
  expectedCloseDate?: string;
  ownerName: string;
}

interface DealsData {
  deals: Deal[];
  pipeline: Array<{
    stage: string;
    count: number;
    amount: number;
  }>;
  stats: {
    total: number;
    totalPipeline: number;
    avgProbability: number;
  };
}

const stages = [
  { key: 'lead', label: '리드', color: 'bg-gray-200' },
  { key: 'qualified', label: '적격', color: 'bg-blue-200' },
  { key: 'proposal', label: '제안', color: 'bg-yellow-200' },
  { key: 'negotiation', label: '협상', color: 'bg-orange-200' },
  { key: 'closed_won', label: '성사', color: 'bg-green-200' },
  { key: 'closed_lost', label: '실패', color: 'bg-red-200' },
];

export default function PipelinePage() {
  const addToast = useToastStore(s => s.addToast);

  // Fetch deals
  const { data: dealsData, loading: dealsLoading, refetch: refetchDeals } = useApi<DealsData>('/api/crm/deals');

  // Create deal mutation
  const { mutate: createDeal, loading: creatingDeal } = useMutation<Deal, Partial<Deal>>('/api/crm/deals', 'POST');

  const deals = dealsData?.deals || [];
  const stats = dealsData?.stats || { total: 0, totalPipeline: 0, avgProbability: 0 };

  const handleCreateDeal = async () => {
    try {
      const result = await createDeal({
        title: '새로운 거래',
        stage: 'lead',
        amount: 0
      });
      if (result) {
        await refetchDeals();
        addToast({
          type: 'success',
          title: '거래가 생성되었습니다.'
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: '거래 생성 실패',
        message: error instanceof Error ? error.message : '거래를 생성하지 못했습니다.'
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">영업 파이프라인을 관리합니다</p>
        </div>
        <button
          onClick={handleCreateDeal}
          disabled={creatingDeal}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-1.5 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />거래 추가
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-500">파이프라인 총액</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalPipeline)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-500">성사 금액</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(deals.filter(d => d.stage === 'closed_won').reduce((sum, d) => sum + (d.amount || 0), 0))}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-500">평균 성사확률</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.avgProbability}%</p>
        </div>
      </div>

      {/* Pipeline Board */}
      {dealsLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage.key);
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
                      {deal.expectedCloseDate && (
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />예상 마감: {deal.expectedCloseDate}</p>
                      )}
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">{deal.ownerName.charAt(0)}</div>
                        <span className="text-xs text-gray-400">{deal.ownerName}</span>
                      </div>
                    </div>
                  ))}
                  <button onClick={handleCreateDeal} className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-colors">+ 거래 추가</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
