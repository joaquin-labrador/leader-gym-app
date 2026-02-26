import apiClient from './apiClient';
import { PageMember } from '../types';

const BASE_PATH = '/api/checkins';

export const checkInService = {
    registerCheckIn: async (dni: string): Promise<void> => {
        // Return empty implies success (e.g. 200/204)
        await apiClient.post(`/api/checkIn/${dni}`);
    },
    searchMembers: async (dni: string): Promise<PageMember> => {
        const response = await apiClient.get(`${BASE_PATH}/search`, { params: { dni } });
        return response.data;
    },
};
