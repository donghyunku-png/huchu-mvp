import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  messengerOpen: boolean;
  aiChatOpen: boolean;
  toggleSidebar: () => void;
  toggleMessenger: () => void;
  toggleAiChat: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  messengerOpen: false,
  aiChatOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleMessenger: () => set((s) => ({ messengerOpen: !s.messengerOpen, aiChatOpen: false })),
  toggleAiChat: () => set((s) => ({ aiChatOpen: !s.aiChatOpen, messengerOpen: false })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
