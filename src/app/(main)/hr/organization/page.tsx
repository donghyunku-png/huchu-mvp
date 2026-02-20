'use client';

import { mockUsers, mockDepartments } from '@/data/mock-data';
import { cn } from '@/lib/utils';
import { Search, Plus, Mail, Phone, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function OrganizationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDepts, setExpandedDepts] = useState<string[]>(mockDepartments.map(d => d.id));

  const filtered = searchQuery
    ? mockUsers.filter(u => u.name.includes(searchQuery) || u.department?.includes(searchQuery) || u.email.includes(searchQuery))
    : mockUsers;

  const toggleDept = (id: string) => {
    setExpandedDepts(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">조직도</h1>
          <p className="text-sm text-gray-500 mt-1">전체 {mockUsers.length}명 · {mockDepartments.length}개 부서</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-1.5"><Plus className="w-4 h-4" />직원 초대</button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="이름, 부서, 이메일로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Org by Department */}
      <div className="space-y-4">
        {mockDepartments.filter(d => d.depth <= 1).map(dept => {
          const deptUsers = filtered.filter(u => u.departmentId === dept.id);
          const isExpanded = expandedDepts.includes(dept.id);

          return (
            <div key={dept.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleDept(dept.id)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color || '#6B7280' }} />
                <span className="font-semibold text-gray-900">{dept.name}</span>
                <span className="text-xs text-gray-400 ml-1">{deptUsers.length}명</span>
              </button>
              {isExpanded && deptUsers.length > 0 && (
                <div className="border-t border-gray-100">
                  {deptUsers.map(user => (
                    <div key={user.id} className="px-4 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{user.name}</span>
                          <span className="text-xs text-gray-400">{user.position}</span>
                          <span className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                            user.role === 'company_admin' ? 'bg-purple-50 text-purple-700' :
                            user.role === 'hr' ? 'bg-blue-50 text-blue-700' :
                            user.role === 'sales' ? 'bg-green-50 text-green-700' :
                            user.role === 'finance' ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-600'
                          )}>
                            {user.role === 'company_admin' ? '관리자' : user.role === 'hr' ? '인사' : user.role === 'sales' ? '영업' : user.role === 'finance' ? '재무' : '직원'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Mail className="w-4 h-4" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Phone className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
