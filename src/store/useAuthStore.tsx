import { create } from 'zustand';
import type { User } from '../interface';
import axiosInstance from '../lib/axios';
import { toast } from 'react-toastify';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;

    isAuthLoading: boolean;

    verify: () => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: true,

    isAuthLoading: true,

    verify: async () => {
        try {
            set({ isAuthLoading: true });
            const response = await axiosInstance.get('/api/v1/auth/verify');
            set({ user: response.data, isAuthenticated: true, isAuthLoading: false });
        } catch (error) {
            toast.error('Authentication failed. Please log in again.');
            set({ user: null, isAuthenticated: false, isAuthLoading: false });
        } finally {
            set({ isAuthLoading: false });
        }
    },
    logout: async () => {
        await axiosInstance.post('/api/v1/auth/logout');
        set({ user: null, isAuthenticated: false });
    },
    updateUser: (user: User) => {
        set({ user });
    }
}));

export default useAuthStore;