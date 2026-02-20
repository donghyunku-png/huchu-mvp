'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, User, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading] = useState(false);

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🌶️</div>
          <h1 className="text-xl font-bold text-gray-900">후추 회원가입</h1>
          <p className="text-sm text-gray-500 mt-1">회사와 관리자 계정을 설정하세요</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
              {s < 2 && <div className={`w-12 h-0.5 ${step > s ? 'bg-orange-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Building2 className="w-5 h-5 text-orange-500" /> 회사 정보</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">회사명 *</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" placeholder="주식회사 OOO" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사업자등록번호</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" placeholder="000-00-00000" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">업종</label>
                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" placeholder="IT/소프트웨어" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">예상 직원 수</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm">
                  <option>1-5명</option><option>6-10명</option><option>11-20명</option><option>21-50명</option><option>50명 이상</option>
                </select>
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors">다음 단계</button>
          </div>
        ) : (
          <div className="space-y-4">
            <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-orange-600 flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> 이전 단계</button>
            <h2 className="text-lg font-semibold flex items-center gap-2"><User className="w-5 h-5 text-orange-500" /> 관리자 계정</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" placeholder="홍길동" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일 *</label>
              <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" placeholder="admin@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 *</label>
              <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" placeholder="8자 이상 입력하세요" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인 *</label>
              <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" placeholder="비밀번호를 다시 입력하세요" />
            </div>
            <button disabled={loading} className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> 처리 중...</> : '회원가입 완료'}
            </button>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          이미 계정이 있으신가요? <Link href="/login" className="text-orange-600 font-medium hover:text-orange-700">로그인</Link>
        </p>
      </div>
    </div>
  );
}
