import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      admin: null,
      isAuthenticated: false,
      login: (token, admin) => {
        localStorage.setItem('thanhtdh_token', token);
        set({ token, admin, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('thanhtdh_token');
        set({ token: null, admin: null, isAuthenticated: false });
      },
    }),
    { name: 'thanhtdh_auth', partialize: (state) => ({ token: state.token, admin: state.admin, isAuthenticated: state.isAuthenticated }) }
  )
);
