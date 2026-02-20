'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Building2, User, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user, company } = useAuthStore();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">설정</h1>

      <div className="space-y-6">
        {/* Company Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><Building2 className="w-5 h-5 text-orange-500" />회사 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-500 mb-1">회사명</label><input type="text" defaultValue={company?.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm text-gray-500 mb-1">사업자번호</label><input type="text" defaultValue={company?.businessNumber} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm text-gray-500 mb-1">대표자</label><input type="text" defaultValue={company?.representative} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm text-gray-500 mb-1">업종</label><input type="text" defaultValue={company?.industry} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div className="col-span-2"><label className="block text-sm text-gray-500 mb-1">주소</label><input type="text" defaultValue={company?.address} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          </div>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><User className="w-5 h-5 text-orange-500" />내 프로필</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-orange-600">{user?.name?.charAt(0)}</div>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <button className="text-xs text-orange-600 mt-1">프로필 사진 변경</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-500 mb-1">이름</label><input type="text" defaultValue={user?.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm text-gray-500 mb-1">이메일</label><input type="email" defaultValue={user?.email} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" readOnly /></div>
            <div><label className="block text-sm text-gray-500 mb-1">부서</label><input type="text" defaultValue={user?.department} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm text-gray-500 mb-1">직급</label><input type="text" defaultValue={user?.position} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><Shield className="w-5 h-5 text-orange-500" />구독 플랜</h2>
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
            <div>
              <p className="font-semibold text-orange-700">{company?.plan?.toUpperCase()} 플랜</p>
              <p className="text-sm text-orange-600 mt-0.5">직원 20명 / AI 토큰 10,000/월 / 50GB 저장</p>
            </div>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">업그레이드</button>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">변경사항 저장</button>
        </div>
      </div>
    </div>
  );
}
