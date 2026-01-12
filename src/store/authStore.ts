import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      
      login: async (username: string, password: string) => {
        try {
          const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: 'kminchelle', 
              password: '0lelplR',
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            set({ 
              token: data.token, 
              user: data, 
              isAuthenticated: true 
            });
          } else {
            // If API fails, use demo data
            throw new Error('API unavailable');
          }
          
        } catch (error) {
          // Fallback to demo authentication
          const demoUser = {
            id: 1,
            username: username || 'admin',
            email: `${username || 'admin'}@example.com`,
            firstName: username || 'Admin',
            lastName: 'User',
            gender: 'male',
            image: 'https://robohash.org/admin',
            token: 'demo-token-' + Date.now(),
          };
          
          set({ 
            token: demoUser.token, 
            user: demoUser, 
            isAuthenticated: true 
          });
        }
      },
      
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    { 
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      })
    }
  )
);