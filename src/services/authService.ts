import apiClient from './apiClient';
import { AuthUser } from '../types';

export const authService = {
    login: async (credentials: any): Promise<AuthUser> => {
        const response = await apiClient.post<AuthUser>('/api/auth/login', credentials);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/api/auth/logout');
    },

    getCurrentUser: async (): Promise<AuthUser | null> => {
        try {
            const response = await apiClient.get<AuthUser>('/api/auth/me');
            return response.data;
        } catch (error) {
            return null;
        }
    }
};
