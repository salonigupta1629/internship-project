import { create } from 'zustand';
import { fetchWithCache } from '@/utils/api'; 

interface User {
  id: number;
  name: string;
  email: string;
  gender: string;
  phone: string;
  company: { name: string };
}

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  total: number;
  fetchUsers: (skip: number, search?: string) => Promise<void>;
  fetchUserById: (id: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  currentUser: null,
  loading: false,
  total: 0,
  
  fetchUsers: async (skip = 0, search = '') => {
    set({ loading: true });
    try {
      const url = search
        ? `https://dummyjson.com/users/search?q=${search}`
        : `https://dummyjson.com/users?limit=10&skip=${skip}`;
      
      // Use cached fetch
      const data = await fetchWithCache(url);
      
      set({ users: data.users, total: data.total, loading: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ loading: false });
    }
  },
  
  fetchUserById: async (id: number) => {
    set({ loading: true });
    try {
      const url = `https://dummyjson.com/users/${id}`;
      
      // Use cached fetch
      const data = await fetchWithCache(url);
      
      set({ currentUser: data, loading: false });
    } catch (error) {
      console.error('Error fetching user:', error);
      set({ loading: false });
    }
  },
}));