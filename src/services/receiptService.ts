import apiClient from './apiClient';
import { ReceiptHistoryItem } from '../types';

export const receiptService = {
    getReceiptHistory: async (dni: string): Promise<ReceiptHistoryItem[]> => {
        const response = await apiClient.get<ReceiptHistoryItem[]>(`/api/receipts/history/${dni}`);
        return response.data;
    }
};
