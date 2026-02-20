'use client';

import { useState } from 'react';
import { mockChatRooms, mockMessages } from '@/data/mock-data';
import { cn } from '@/lib/utils';
import {
  Search, Hash, Plus, Send, Paperclip, Smile, Pin,
  Phone, Video, MoreVertical, AtSign, Users
} from 'lucide-react';

export default function MessengerPage() {
  const [selectedRoom, setSelectedRoom] = useState<string>('room-2');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedRoomData = mockChatRooms.find(r => r.id === selectedRoom);
  const roomMessages = selectedRoom ? mockMessages.filter(m => m.roomId === selectedRoom) : [];

  const channels = mockChatRooms.filter(r => r.type.includes('channel'));
  const dms = mockChatRooms.filter(r => r.type === 'dm');

  return (
    <div className="flex h-full">
      {/* Room List - Left Panel */}
      <div className="w-72 border-r border-gray-200 bg-white flex flex-col flex-shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg text-gray-900">💬 Huchu Talk</h2>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-y-auto">
          {/* Channels */}
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">채널</span>
            <button className="text-xs text-gray-400 hover:text-orange-500"><Plus className="w-3 h-3" /></button>
          </div>
          {channels.map(room => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room.id)}
              className={cn(
                'w-full px-3 py-2.5 flex items-center gap-3 text-left transition-colors',
                selectedRoom === room.id ? 'bg-orange-50 border-r-2 border-orange-500' : 'hover:bg-gray-50'
              )}
            >
              <Hash className={cn('w-4 h-4 flex-shrink-0', selectedRoom === room.id ? 'text-orange-500' : 'text-gray-400')} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={cn('text-sm font-medium truncate', selectedRoom === room.id ? 'text-orange-700' : 'text-gray-900')}>{room.name}</span>
                  {room.unreadCount > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] rounded-full px-1.5 py-0.5 ml-2">{room.unreadCount}</span>
                  )}
                </div>
                {room.lastMessage && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {room.lastMessage.senderName}: {room.lastMessage.content}
                  </p>
                )}
              </div>
            </button>
          ))}

          {/* DMs */}
          <div className="px-3 py-2 mt-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">다이렉트 메시지</span>
            <button className="text-xs text-gray-400 hover:text-orange-500"><Plus className="w-3 h-3" /></button>
          </div>
          {dms.map(room => {
            const otherUser = room.members.find(m => m.id !== 'user-1');
            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={cn(
                  'w-full px-3 py-2.5 flex items-center gap-3 text-left transition-colors',
                  selectedRoom === room.id ? 'bg-orange-50 border-r-2 border-orange-500' : 'hover:bg-gray-50'
                )}
              >
                <div className="relative flex-shrink-0">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                    selectedRoom === room.id ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                  )}>
                    {otherUser?.name?.charAt(0)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{otherUser?.name}</span>
                    {room.unreadCount > 0 && (
                      <span className="bg-orange-500 text-white text-[10px] rounded-full px-1.5 py-0.5">{room.unreadCount}</span>
                    )}
                  </div>
                  {room.lastMessage && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">{room.lastMessage.content}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area - Right Panel */}
      {selectedRoom ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              {selectedRoomData?.type.includes('channel') ? (
                <Hash className="w-5 h-5 text-gray-400" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                  {selectedRoomData?.members.find(m => m.id !== 'user-1')?.name?.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {selectedRoomData?.name || selectedRoomData?.members.find(m => m.id !== 'user-1')?.name}
                </h3>
                {selectedRoomData?.topic && <p className="text-xs text-gray-400">{selectedRoomData.topic}</p>}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><Phone className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><Video className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><Pin className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><Users className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {roomMessages.map((msg) => (
              <div key={msg.id} className={cn(
                'flex gap-3 group',
                msg.type === 'ai_response' && 'bg-gradient-to-r from-blue-50 to-transparent -mx-4 px-4 py-3 rounded-lg'
              )}>
                <div className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                  msg.type === 'ai_response' ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                )}>
                  {msg.type === 'ai_response' ? '🤖' : msg.senderName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className={cn('text-sm font-semibold', msg.type === 'ai_response' ? 'text-blue-700' : 'text-gray-900')}>
                      {msg.senderName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {msg.reactions.map((r, i) => (
                        <span key={i} className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">{r.emoji} {r.users.length}</span>
                      ))}
                    </div>
                  )}
                </div>
                {/* Hover actions */}
                <div className="opacity-0 group-hover:opacity-100 flex items-start gap-0.5 transition-opacity">
                  <button className="p-1 rounded hover:bg-gray-100 text-gray-400" title="리액션"><Smile className="w-3.5 h-3.5" /></button>
                  <button className="p-1 rounded hover:bg-gray-100 text-gray-400" title="쓰레드"><MoreVertical className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            {roomMessages.length === 0 && (
              <div className="text-center py-12">
                <Hash className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">아직 메시지가 없습니다</p>
                <p className="text-xs text-gray-300 mt-1">첫 번째 메시지를 보내보세요!</p>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4 flex-shrink-0">
            <div className="flex items-end gap-2">
              <div className="flex gap-1">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><Paperclip className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`${selectedRoomData?.name || '상대방'}에 메시지 보내기`}
                  rows={1}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      setMessage('');
                    }
                  }}
                />
              </div>
              <div className="flex gap-1">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><AtSign className="w-5 h-5" /></button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><Smile className="w-5 h-5" /></button>
                <button className="p-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"><Send className="w-5 h-5" /></button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">@AI 를 입력하면 AI 비서를 호출할 수 있습니다</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Hash className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">채팅방을 선택하세요</p>
          </div>
        </div>
      )}
    </div>
  );
}
