'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { mockNotifications } from '@/data/mock-data';
import { Bell, Search, Bot, MessageSquare, LogOut, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, logout } = useAuthStore();
  const { toggleMessenger, toggleAiChat } = useUIStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="검색 (메시지, 문서, 직원...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Messenger toggle */}
        <button
          onClick={toggleMessenger}
          className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          title="메신저"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">8</span>
        </button>

        {/* AI Chat toggle */}
        <button
          onClick={toggleAiChat}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          title="AI 채팅"
        >
          <Bot className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{unreadCount}</span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-gray-100 font-semibold text-sm">알림</div>
              {mockNotifications.map((noti) => (
                <div key={noti.id} className={cn('p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer', !noti.isRead && 'bg-orange-50/50')}>
                  <div className="text-sm font-medium text-gray-900">{noti.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{noti.body}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(noti.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {user && <span className="text-sm font-medium text-gray-700 hidden md:block">{user.name}</span>}
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
              <div className="px-3 py-2 border-b border-gray-100">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <User className="w-4 h-4" /> 프로필 설정
              </button>
              <button
                onClick={logout}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> 로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
