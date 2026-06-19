import { create } from 'zustand';
import { User, Company } from '@/types';

interface AuthState {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, company: Company) => void;
  logout: () => void;
  initFromStorage: () => Promise<void>;
}

const getStoredData = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  company: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user, company) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-user', JSON.stringify(user));
      localStorage.setItem('auth-company', JSON.stringify(company));
    }
    set({ user, company, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('auth-user');
      localStorage.removeItem('auth-company');
    }
    // 쿠키도 클리어 (API 호출)
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    set({ user: null, company: null, isAuthenticated: false, isLoading: false });
  },

  initFromStorage: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const storedUser = getStoredData<User>('auth-user');
    const storedCompany = getStoredData<Company>('auth-company');

    if (token && storedUser && storedCompany) {
      // 저장된 데이터로 즉시 복원
      set({ user: storedUser, company: storedCompany, isAuthenticated: true, isLoading: false });

      // 백그라운드에서 토큰 유효성 검증
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          // 토큰 만료
          localStorage.removeItem('token');
          localStorage.removeItem('auth-user');
          localStorage.removeItem('auth-company');
          set({ user: null, company: null, isAuthenticated: false, isLoading: false });
        }
      } catch {
        // 네트워크 오류 시 저장된 데이터 유지
      }
    } else {
      set({ isLoading: false });
    }
  },
}));
