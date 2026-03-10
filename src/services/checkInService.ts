import apiClient from './apiClient';
import { PageMember, CheckInResponseDTO } from '../types';

const BASE_PATH = '/api/checkins';

export const checkInService = {
    registerCheckIn: async (dni: string): Promise<CheckInResponseDTO> => {
        const response = await apiClient.post<CheckInResponseDTO>(`/api/checkIn/${dni}`);
        return response.data;
    },
    searchMembers: async (dni: string): Promise<PageMember> => {
        const response = await apiClient.get(`${BASE_PATH}/search`, { params: { dni } });
        return response.data;
    },
};
