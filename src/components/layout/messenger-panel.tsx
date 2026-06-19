'use client';

import { useState } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api-client';
import { X, Search, Hash, Send, Paperclip, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatRoom {
  id: string;
  name: string;
  type: 'channel' | 'dm';
  memberCount?: number;
  lastMessageAt?: string;
  unreadCount: number;
  members?: Array<{ id: string; name: string }>;
  lastMessage?: { senderName: string; content: string };
}

interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'message' | 'ai_response';
  createdAt: string;
  timestamp?: string;
}

interface ChatData {
  rooms: ChatRoom[];
  total: number;
}

interface MessagesData {
  roomId: string;
  messages: ChatMessage[];
  total: number;
}

export function MessengerPanel() {
  const { messengerOpen, toggleMessenger } = useUIStore();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const { data: chatData, loading: chatLoading } = useApi<ChatData>('/api/chat');
  const { data: msgData, loading: msgLoading } = useApi<MessagesData>(
    selectedRoom ? `/api/chat/${selectedRoom}/messages` : null
  );

  const selectedRoomData = chatData?.rooms?.find(r => r.id === selectedRoom);
  const roomMessages = msgData?.messages || [];

  const filteredRooms = chatData?.rooms?.filter(room => {
    const name = room.type === 'dm' && (room.members?.length ?? 0) > 1
      ? room.members?.find(m => m.id !== 'user-1')?.name || room.name
      : room.name;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedRoom || sendingMessage) return;

    setSendingMessage(true);
    try {
      await api.post(`/api/chat/${selectedRoom}/messages`, {
        content: message,
        type: 'message',
      });
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!messengerOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-[400px] bg-white border-l border-gray-200 shadow-xl z-40 flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
        <h2 className="font-semibold text-gray-900">💬 Huchu Talk</h2>
        <button onClick={toggleMessenger} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {selectedRoom ? (
        /* Chat View */
        <>
          <div className="h-12 border-b border-gray-200 flex items-center px-4 gap-2 flex-shrink-0">
            <button onClick={() => setSelectedRoom(null)} className="text-gray-500 hover:text-gray-700 text-sm transition-colors">←</button>
            <Hash className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-sm">{selectedRoomData?.name || selectedRoomData?.members?.find(m => m.id !== 'user-1')?.name}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {msgLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-gray-500">로딩 중...</div>
              </div>
            )}
            {roomMessages.map((msg) => (
              <div key={msg.id} className={cn('flex gap-2', msg.type === 'ai_response' && 'bg-blue-50 -mx-4 px-4 py-2 rounded')}>
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                  msg.type === 'ai_response' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                )}>
                  {msg.type === 'ai_response' ? '🤖' : msg.senderName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-gray-900">{msg.senderName}</span>
                    <span className="text-xs text-gray-400">{new Date(msg.createdAt || msg.timestamp || 0).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 p-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"><Paperclip className="w-4 h-4" /></button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="메시지 입력..."
                className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"><Smile className="w-4 h-4" /></button>
              <button
                onClick={handleSendMessage}
                disabled={sendingMessage || !message.trim()}
                className="p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Room List */
        <>
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="채팅방 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chatLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-gray-500">로딩 중...</div>
              </div>
            )}
            {filteredRooms.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">채널</div>
                {filteredRooms.filter(r => r.type.includes('channel')).map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Hash className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{room.name}</span>
                        {room.unreadCount > 0 && (
                          <span className="bg-orange-500 text-white text-[10px] rounded-full px-1.5 py-0.5 flex-shrink-0">{room.unreadCount}</span>
                        )}
                      </div>
                      {room.lastMessage && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">{room.lastMessage.senderName}: {room.lastMessage.content}</p>
                      )}
                    </div>
                  </button>
                ))}
              </>
            )}
            {filteredRooms.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase mt-2">다이렉트 메시지</div>
                {filteredRooms.filter(r => r.type === 'dm').map((room) => {
                  const otherUser = room.members?.find(m => m.id !== 'user-1');
                  return (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                        {otherUser?.name?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{otherUser?.name}</span>
                          {room.unreadCount > 0 && (
                            <span className="bg-orange-500 text-white text-[10px] rounded-full px-1.5 py-0.5 flex-shrink-0">{room.unreadCount}</span>
                          )}
                        </div>
                        {room.lastMessage && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">{room.lastMessage.content}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </>
            )}
            {!chatLoading && filteredRooms.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-gray-500">채팅방이 없습니다.</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
