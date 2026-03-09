import apiClient from './apiClient';
import { ReceiptHistoryItem } from '../types';

export const receiptService = {
    getReceiptHistory: async (dni: string): Promise<ReceiptHistoryItem[]> => {
        const response = await apiClient.get<ReceiptHistoryItem[]>(`/api/receipts/history/${dni}`);
        return response.data;
    },

    getHistoryByDate: async (date: string): Promise<ReceiptHistoryItem[]> => {
        const response = await apiClient.get<ReceiptHistoryItem[]>('/api/receipts/history', {
            params: { date }
        });
        return response.data;
    }
};
