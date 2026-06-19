'use client';

import { useState } from 'react';
import { useToastStore } from '@/stores/toast-store';
import {
  Mail, MessageSquare, Cloud, CreditCard, Calculator, FileSignature,
  Check, X, Settings, Search, Plug, ChevronRight,
} from 'lucide-react';

interface Connector {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  connected: boolean;
  connectedAt?: string;
  configLabel?: string;
}

const CONNECTORS: Connector[] = [
  // 이메일 서비스
  { id: 'gmail', name: 'Gmail', description: 'Google 이메일 서비스 연동', category: '이메일 서비스', icon: <Mail className="w-6 h-6" />, color: 'bg-red-100 text-red-600', connected: false },
  { id: 'naver-mail', name: '네이버 메일', description: '네이버 메일 수신/발신 연동', category: '이메일 서비스', icon: <Mail className="w-6 h-6" />, color: 'bg-green-100 text-green-600', connected: false },
  { id: 'outlook', name: 'Outlook', description: 'Microsoft Outlook 연동', category: '이메일 서비스', icon: <Mail className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600', connected: false },
  // 메신저 연동
  { id: 'slack', name: 'Slack', description: '슬랙 워크스페이스 연동', category: '메신저 연동', icon: <MessageSquare className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600', connected: false },
  { id: 'kakaotalk', name: '카카오톡', description: '카카오톡 알림톡/친구톡 연동', category: '메신저 연동', icon: <MessageSquare className="w-6 h-6" />, color: 'bg-yellow-100 text-yellow-700', connected: false },
  { id: 'teams', name: 'Microsoft Teams', description: 'Teams 채널/알림 연동', category: '메신저 연동', icon: <MessageSquare className="w-6 h-6" />, color: 'bg-indigo-100 text-indigo-600', connected: false },
  // 클라우드 스토리지
  { id: 'google-drive', name: 'Google Drive', description: '문서/파일 클라우드 동기화', category: '클라우드 스토리지', icon: <Cloud className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600', connected: false },
  { id: 'dropbox', name: 'Dropbox', description: 'Dropbox 파일 동기화', category: '클라우드 스토리지', icon: <Cloud className="w-6 h-6" />, color: 'bg-sky-100 text-sky-600', connected: false },
  { id: 'onedrive', name: 'OneDrive', description: 'Microsoft OneDrive 연동', category: '클라우드 스토리지', icon: <Cloud className="w-6 h-6" />, color: 'bg-cyan-100 text-cyan-600', connected: false },
  // 결제/경비
  { id: 'toss', name: '토스페이먼츠', description: '결제 수단 및 정산 연동', category: '결제/경비', icon: <CreditCard className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600', connected: false },
  { id: 'kakaopay', name: '카카오페이', description: '카카오페이 결제/송금 연동', category: '결제/경비', icon: <CreditCard className="w-6 h-6" />, color: 'bg-yellow-100 text-yellow-700', connected: false },
  // 세금/회계
  { id: 'douzone', name: '더존 (WEHAGO)', description: '회계/세무/인사 ERP 연동', category: '세금/회계', icon: <Calculator className="w-6 h-6" />, color: 'bg-emerald-100 text-emerald-600', connected: false },
  { id: 'kasapac', name: '카사팩', description: '세금계산서/현금영수증 자동화', category: '세금/회계', icon: <Calculator className="w-6 h-6" />, color: 'bg-teal-100 text-teal-600', connected: false },
  // 전자서명
  { id: 'modusign', name: '모두싸인', description: '전자계약/서명 자동화', category: '전자서명', icon: <FileSignature className="w-6 h-6" />, color: 'bg-orange-100 text-orange-600', connected: false },
  { id: 'docusign', name: 'DocuSign', description: '글로벌 전자서명 서비스', category: '전자서명', icon: <FileSignature className="w-6 h-6" />, color: 'bg-amber-100 text-amber-600', connected: false },
];

const CATEGORIES = ['전체', '이메일 서비스', '메신저 연동', '클라우드 스토리지', '결제/경비', '세금/회계', '전자서명'];

export default function IntegrationsPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [connectors, setConnectors] = useState(CONNECTORS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [configModal, setConfigModal] = useState<string | null>(null);

  const filtered = connectors.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.includes(search);
    const matchCategory = selectedCategory === '전체' || c.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const grouped = CATEGORIES.slice(1).reduce((acc, cat) => {
    const items = filtered.filter((c) => c.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {} as Record<string, Connector[]>);

  const connectedCount = connectors.filter((c) => c.connected).length;

  const handleToggle = (id: string) => {
    setConnectors((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newConnected = !c.connected;
        if (newConnected) {
          addToast({ type: 'success', title: `${c.name} 연결 완료`, message: '서비스가 성공적으로 연동되었습니다.' });
          return { ...c, connected: true, connectedAt: new Date().toISOString() };
        } else {
          addToast({ type: 'info', title: `${c.name} 연결 해제`, message: '서비스 연동이 해제되었습니다.' });
          return { ...c, connected: false, connectedAt: undefined };
        }
      })
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>설정</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">외부 서비스 연동</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Plug className="w-7 h-7 text-orange-500" />
              외부 서비스 연동
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              다양한 외부 서비스를 연동하여 업무 효율을 높이세요
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl border border-orange-200">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span className="text-sm font-medium text-orange-700">
              {connectedCount}개 서비스 연결됨
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="서비스 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Connector Groups */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">검색 결과가 없습니다</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-orange-500 rounded-full" />
                {category}
                <span className="text-xs text-gray-400 font-normal">({items.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((connector) => (
                  <div
                    key={connector.id}
                    className={`bg-white rounded-xl border p-5 transition-all hover:shadow-md ${
                      connector.connected ? 'border-orange-200 bg-orange-50/30' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${connector.color}`}>
                          {connector.icon}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{connector.name}</h3>
                          <p className="text-xs text-gray-500">{connector.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {connector.connected ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                          <Check className="w-3.5 h-3.5" />
                          연결됨
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <X className="w-3.5 h-3.5" />
                          미연결
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        {connector.connected && (
                          <button
                            onClick={() => setConfigModal(connector.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggle(connector.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            connector.connected
                              ? 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                              : 'bg-orange-500 text-white hover:bg-orange-600'
                          }`}
                        >
                          {connector.connected ? '연결 해제' : '연결하기'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Config Modal */}
      {configModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setConfigModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-500" />
              연동 설정
            </h3>
            {(() => {
              const c = connectors.find((c) => c.id === configModal);
              if (!c) return null;
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.color}`}>
                      {c.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{c.name}</p>
                      <p className="text-xs text-gray-500">
                        {c.connectedAt ? `연결일: ${new Date(c.connectedAt).toLocaleDateString('ko-KR')}` : ''}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">동기화 주기</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm">
                      <option>실시간</option>
                      <option>5분마다</option>
                      <option>15분마다</option>
                      <option>1시간마다</option>
                      <option>수동</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">알림 설정</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked className="rounded text-orange-500 focus:ring-orange-500" />
                        동기화 완료 시 알림
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked className="rounded text-orange-500 focus:ring-orange-500" />
                        오류 발생 시 알림
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setConfigModal(null)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200"
                    >
                      닫기
                    </button>
                    <button
                      onClick={() => {
                        addToast({ type: 'success', title: '설정 저장됨' });
                        setConfigModal(null);
                      }}
                      className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600"
                    >
                      저장
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
