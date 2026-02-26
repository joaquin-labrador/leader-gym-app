import apiClient from './apiClient';
import { Plan } from '../types';

export const planService = {
    getAllPlans: async (): Promise<Plan[]> => {
        const response = await apiClient.get<Plan[]>('/api/plans');
        return response.data;
    },

    getPlanById: async (planId: number): Promise<Plan> => {
        const response = await apiClient.get<Plan>(`/api/plans/${planId}`);
        return response.data;
    },

    updatePlanPrice: async (planId: number, newPrice: number): Promise<void> => {
        // Handling possible 204 No Content
        await apiClient.put(`/api/plans/${planId}/price`, null, {
            params: { newPrice }
        });
    }
};
