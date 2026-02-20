'use client';

import { useState } from 'react';
import { mockAIConversations, mockAIMessages } from '@/data/mock-data';
import { cn } from '@/lib/utils';
import { Bot, Send, Plus, Search, Trash2, Clock, Sparkles, FileText, Calculator, Calendar, Users } from 'lucide-react';

const quickActions = [
  { icon: Calendar, label: '내일 일정 확인', color: 'bg-blue-50 text-blue-600' },
  { icon: Calculator, label: '이번 달 경비 현황', color: 'bg-green-50 text-green-600' },
  { icon: Users, label: '직원 연차 현황 조회', color: 'bg-purple-50 text-purple-600' },
  { icon: FileText, label: '계약서 검토 요청', color: 'bg-orange-50 text-orange-600' },
];

export default function AIChatPage() {
  const [selectedConv, setSelectedConv] = useState<string>('ai-conv-1');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const messages = mockAIMessages.filter(m => m.conversationId === selectedConv);
  const selectedConvData = mockAIConversations.find(c => c.id === selectedConv);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessage('');
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - Conversation List */}
      <div className="w-72 border-r border-gray-200 bg-white flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">🤖 AI 채팅</h2>
            <button className="p-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="대화 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold text-gray-400">오늘</div>
          {mockAIConversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedConv(conv.id)}
              className={cn(
                'w-full px-3 py-3 flex items-start gap-3 text-left transition-colors group',
                selectedConv === conv.id ? 'bg-orange-50 border-r-2 border-orange-500' : 'hover:bg-gray-50'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                selectedConv === conv.id ? 'bg-orange-100' : 'bg-gray-100'
              )}>
                <Bot className={cn('w-4 h-4', selectedConv === conv.id ? 'text-orange-600' : 'text-gray-500')} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium truncate', selectedConv === conv.id ? 'text-orange-700' : 'text-gray-900')}>{conv.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(conv.updatedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 text-gray-400"><Trash2 className="w-3 h-3" /></button>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">{selectedConvData?.title || '새 대화'}</h3>
              <p className="text-xs text-gray-400">AI 비서 · GPT-4o</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">토큰: 425/10,000</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">후추 AI 비서</h2>
              <p className="text-gray-500 mb-8">업무에 관해 무엇이든 물어보세요. 자연어로 업무를 처리할 수 있습니다.</p>
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                {quickActions.map((action, i) => (
                  <button key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all text-left">
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', action.color)}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-gray-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map(msg => (
                <div key={msg.id} className={cn('flex gap-4', msg.role === 'user' && 'justify-end')}>
                  {msg.role === 'assistant' && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className={cn(
                    'max-w-[80%] rounded-2xl px-5 py-3.5',
                    msg.role === 'user'
                      ? 'bg-orange-500 text-white rounded-br-md shadow-sm'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                  )}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-3 mt-3 pt-2 border-t border-gray-100">
                        <span className="text-[10px] text-gray-400">{msg.model}</span>
                        <span className="text-[10px] text-gray-400">{msg.tokensUsed} tokens</span>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gray-600">
                      김
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="AI에게 업무를 요청하세요... (예: '나 6월 25일 연차 쓸래', '이번 달 경비 정리해줘')"
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleSend}
                className="p-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">AI 응답은 참고용이며, 중요한 의사결정은 전문가 상담을 권장합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
