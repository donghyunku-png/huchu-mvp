import { create } from 'zustand';
import { signOut } from 'next-auth/react';
import { User, Company } from '@/types';

interface AuthState {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (user: User, company: Company) => void;
  updateCompany: (company: Company) => void;
  updateUser: (user: User) => void;
  logout: () => Promise<void>;
  initFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  company: null,
  isAuthenticated: false,
  isLoading: true,

  setSession: (user, company) => {
    set({ user, company, isAuthenticated: true, isLoading: false });
  },

  updateCompany: (company) => set({ company }),

  updateUser: (user) => set({ user }),

  logout: async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    set({ user: null, company: null, isAuthenticated: false, isLoading: false });
    await signOut({ callbackUrl: '/login' });
  },

  initFromStorage: async () => {
    try {
      const res = await fetch('/api/auth/me', {
        cache: 'no-store',
      });

      if (!res.ok) {
        set({ user: null, company: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const json = await res.json();
      set({
        user: json.data.user,
        company: json.data.company,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({ user: null, company: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
