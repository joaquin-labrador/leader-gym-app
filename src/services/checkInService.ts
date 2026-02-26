import { apiClient } from '../lib/apiClient';

export const checkInService = {
    registerCheckIn: async (dni: string): Promise<void> => {
        // Return empty implies success (e.g. 200/204)
        await apiClient.post(`/api/checkIn/${dni}`);
    }
};
