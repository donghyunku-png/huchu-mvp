'use client';

import { useState } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { mockAIMessages, mockAIConversations } from '@/data/mock-data';
import { X, Send, Plus, Bot, History } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AIChatPanel() {
  const { aiChatOpen, toggleAiChat } = useUIStore();
  const [message, setMessage] = useState('');
  const [selectedConv, setSelectedConv] = useState<string>('ai-conv-1');
  const [showHistory, setShowHistory] = useState(false);

  const messages = mockAIMessages.filter(m => m.conversationId === selectedConv);

  if (!aiChatOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-[460px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-14 bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-white">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">AI 비서</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowHistory(!showHistory)} className="p-1.5 text-white/80 hover:text-white rounded">
            <History className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-white/80 hover:text-white rounded">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={toggleAiChat} className="p-1.5 text-white/80 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showHistory ? (
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 text-xs font-semibold text-gray-400">최근 대화</div>
          {mockAIConversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => { setSelectedConv(conv.id); setShowHistory(false); }}
              className={cn(
                'w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-50',
                selectedConv === conv.id && 'bg-orange-50'
              )}
            >
              <div className="text-sm font-medium text-gray-900">{conv.title}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {new Date(conv.updatedAt).toLocaleDateString('ko-KR')}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-orange-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">안녕하세요! 후추 AI 비서입니다.</p>
                <p className="text-xs text-gray-400 mt-1">업무에 관해 무엇이든 물어보세요.</p>
                <div className="mt-4 space-y-2">
                  {['이번 달 경비 현황 알려줘', '내일 일정 확인해줘', '박영업 연차 잔여일수는?'].map(q => (
                    <button key={q} className="block mx-auto px-3 py-1.5 bg-orange-50 text-orange-700 text-xs rounded-full hover:bg-orange-100">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' && 'justify-end')}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-orange-600" />
                  </div>
                )}
                <div className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                  msg.role === 'user'
                    ? 'bg-orange-500 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                )}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.role === 'assistant' && msg.tokensUsed && (
                    <p className="text-[10px] text-gray-400 mt-1">{msg.model} · {msg.tokensUsed} tokens</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="AI에게 질문하세요..."
                className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                onKeyDown={(e) => e.key === 'Enter' && message.trim() && setMessage('')}
              />
              <button className="p-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
