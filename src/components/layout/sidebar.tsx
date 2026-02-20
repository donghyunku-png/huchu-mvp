'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';
import {
  LayoutDashboard, MessageSquare, Bot, Users, Calendar,
  BarChart3, Star, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: '대시보드' },
  { href: '/messenger', icon: MessageSquare, label: '메신저', badge: 8 },
  { href: '/ai-chat', icon: Bot, label: 'AI 채팅' },
  { href: '/hr/organization', icon: Users, label: '인사/근태', children: [
    { href: '/hr/organization', label: '조직도' },
    { href: '/hr/attendance', label: '출퇴근' },
    { href: '/hr/vacation', label: '휴가' },
  ]},
  { href: '/schedule', icon: Calendar, label: '일정/할일' },
  { href: '/crm/customers', icon: BarChart3, label: '영업/CRM', children: [
    { href: '/crm/customers', label: '고객관리' },
    { href: '/crm/pipeline', label: '파이프라인' },
  ]},
  { href: '/bookmarks', icon: Star, label: '북마크' },
  { href: '/settings', icon: Settings, label: '설정' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href) ? prev.filter(h => h !== href) : [...prev, href]
    );
  };

  return (
    <aside className={cn(
      'h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 flex-shrink-0',
      sidebarOpen ? 'w-60' : 'w-16'
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        {sidebarOpen ? (
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🌶️</span>
            <span className="font-bold text-lg text-gray-900">후추</span>
            <span className="text-xs text-gray-400 ml-1">Huchu</span>
          </Link>
        ) : (
          <Link href="/dashboard" className="mx-auto">
            <span className="text-2xl">🌶️</span>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const isExpanded = expandedItems.includes(item.href);
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.href}>
              <Link
                href={hasChildren ? '#' : item.href}
                onClick={hasChildren ? (e) => { e.preventDefault(); toggleExpanded(item.href); } : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5',
                  isActive
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-orange-600' : 'text-gray-400')} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                    {hasChildren && (
                      <ChevronRight className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-90')} />
                    )}
                  </>
                )}
              </Link>
              {hasChildren && isExpanded && sidebarOpen && (
                <div className="ml-8 mb-1">
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        'block px-3 py-1.5 text-sm rounded-md transition-colors',
                        pathname === child.href
                          ? 'text-orange-700 font-medium'
                          : 'text-gray-500 hover:text-gray-700'
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Toggle button */}
      <div className="border-t border-gray-200 p-2">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
