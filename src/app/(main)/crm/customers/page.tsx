'use client';

import { useState } from 'react';
import { useApi, useMutation } from '@/hooks/useApi';
import { useToastStore } from '@/stores/toast-store';
import { cn } from '@/lib/utils';
import { Search, Plus, Building2, Phone, Mail, MoreVertical, Loader2 } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  type: string;
  industry?: string;
  phone?: string;
  email?: string;
  assignedTo?: string;
  assignedToName?: string;
  tags?: string[];
  createdAt: string;
}

interface ClientsData {
  clients: Client[];
  stats: {
    total: number;
    active: number;
    potential: number;
    partner: number;
  };
}

const typeLabels: Record<string, { label: string; color: string }> = {
  customer: { label: '고객', color: 'bg-green-50 text-green-700' },
  prospect: { label: '잠재고객', color: 'bg-blue-50 text-blue-700' },
  partner: { label: '파트너', color: 'bg-purple-50 text-purple-700' },
  vendor: { label: '공급업체', color: 'bg-orange-50 text-orange-700' },
};

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const addToast = useToastStore(s => s.addToast);

  // Fetch clients
  const { data: clientsData, loading: clientsLoading, refetch: refetchClients } = useApi<ClientsData>('/api/crm/clients');

  // Create client mutation
  const { mutate: createClient, loading: creatingClient } = useMutation<Client, Partial<Client>>('/api/crm/clients', 'POST');

  const clients = clientsData?.clients || [];
  const stats = clientsData?.stats || { total: 0, active: 0, potential: 0, partner: 0 };

  const filtered = clients.filter(c => {
    const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleCreateClient = async () => {
    try {
      const result = await createClient({
        name: '새 거래처',
        type: 'prospect'
      });
      if (result) {
        await refetchClients();
        addToast({
          type: 'success',
          title: '거래처가 생성되었습니다.'
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: '거래처 생성 실패',
        message: error instanceof Error ? error.message : '거래처를 생성하지 못했습니다.'
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">고객 관리</h1>
          <p className="text-sm text-gray-500 mt-1">전체 {stats.total}개 거래처</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">📷 명함 스캔</button>
          <button
            onClick={handleCreateClient}
            disabled={creatingClient}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />고객 추가
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="고객명, 이메일로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'customer', 'prospect', 'partner', 'vendor'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn('px-3 py-1.5 text-xs rounded-full font-medium transition-colors',
                typeFilter === t ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {t === 'all' ? '전체' : typeLabels[t]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Client Cards */}
      {clientsLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">거래처가 없습니다.</p>
          <button
            onClick={handleCreateClient}
            className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            첫 거래처 추가하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(client => {
            const typeInfo = typeLabels[client.type] || { label: client.type, color: 'bg-gray-50 text-gray-700' };
            return (
              <div key={client.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', typeInfo.color)}>{typeInfo.label}</span>
                    </div>
                  </div>
                  <button className="p-1 rounded hover:bg-gray-100"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                </div>
                <div className="space-y-1.5 text-sm mb-3">
                  {client.phone && <p className="flex items-center gap-2 text-gray-500"><Phone className="w-3.5 h-3.5" />{client.phone}</p>}
                  {client.email && <p className="flex items-center gap-2 text-gray-500"><Mail className="w-3.5 h-3.5" />{client.email}</p>}
                  {client.industry && <p className="flex items-center gap-2 text-gray-400"><Building2 className="w-3.5 h-3.5" />{client.industry}</p>}
                </div>
                {client.tags && client.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {client.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
                {client.assignedToName && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">{client.assignedToName.charAt(0)}</div>
                    <span className="text-xs text-gray-500">담당: {client.assignedToName}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
