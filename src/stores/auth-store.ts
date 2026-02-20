import { create } from 'zustand';
import { User, Company } from '@/types';

interface AuthState {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
  login: (user: User, company: Company) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  company: null,
  isAuthenticated: false,
  login: (user, company) => set({ user, company, isAuthenticated: true }),
  logout: () => set({ user: null, company: null, isAuthenticated: false }),
}));
