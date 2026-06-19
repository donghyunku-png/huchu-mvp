'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useToastStore } from '@/stores/toast-store';
import { api } from '@/lib/api-client';
import { Building2, User, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user, company } = useAuthStore();
  const addToast = useToastStore(s => s.addToast);
  const [loading, setLoading] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: company?.name || '',
    businessNumber: company?.businessNumber || '',
    representative: company?.representative || '',
    industry: company?.industry || '',
    address: company?.address || '',
  });
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    department: user?.department || '',
    position: user?.position || '',
  });

  const handleCompanyChange = (field: keyof typeof companyForm, value: string) => {
    setCompanyForm(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileChange = (field: keyof typeof profileForm, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post('/api/company/settings', companyForm);
      await api.post('/api/user/profile', profileForm);
      addToast({
        type: 'success',
        title: '설정이 저장되었습니다.',
        duration: 3000,
      });
    } catch {
      addToast({
        type: 'error',
        title: '저장 중 오류가 발생했습니다.',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">설정</h1>

      <div className="space-y-6">
        {/* Company Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><Building2 className="w-5 h-5 text-orange-500" />회사 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">회사명</label>
              <input
                type="text"
                value={companyForm.name}
                onChange={(e) => handleCompanyChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">사업자번호</label>
              <input
                type="text"
                value={companyForm.businessNumber}
                onChange={(e) => handleCompanyChange('businessNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">대표자</label>
              <input
                type="text"
                value={companyForm.representative}
                onChange={(e) => handleCompanyChange('representative', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">업종</label>
              <input
                type="text"
                value={companyForm.industry}
                onChange={(e) => handleCompanyChange('industry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-500 mb-1">주소</label>
              <input
                type="text"
                value={companyForm.address}
                onChange={(e) => handleCompanyChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
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
              <button className="text-xs text-orange-600 mt-1 hover:text-orange-700">프로필 사진 변경</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">이름</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">이메일</label>
              <input
                type="email"
                value={user?.email || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">부서</label>
              <input
                type="text"
                value={profileForm.department}
                onChange={(e) => handleProfileChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">직급</label>
              <input
                type="text"
                value={profileForm.position}
                onChange={(e) => handleProfileChange('position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><Shield className="w-5 h-5 text-orange-500" />구독 플랜</h2>
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
            <div>
              <p className="font-semibold text-orange-700">{company?.plan?.toUpperCase() || 'BASIC'} 플랜</p>
              <p className="text-sm text-orange-600 mt-0.5">직원 20명 / AI 토큰 10,000/월 / 50GB 저장</p>
            </div>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">업그레이드</button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '저장 중...' : '변경사항 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
