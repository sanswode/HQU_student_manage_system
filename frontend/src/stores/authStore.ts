import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Student, Teacher, LoginResponse } from '../types';

interface AuthState {
  user: User | null;
  profile: Student | Teacher | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  setAuth: (data: LoginResponse) => void;
  clearAuth: () => void;
  updateAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      
      setAuth: (data: LoginResponse) => set({
        user: data.user,
        profile: data.profile,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        isAuthenticated: true,
      }),
      
      clearAuth: () => set({
        user: null,
        profile: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      }),
      
      updateAccessToken: (token: string) => set({
        accessToken: token,
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setTheme: (isDark: boolean) => set({ isDarkMode: isDark }),
    }),
    {
      name: 'theme-storage',
    }
  )
);