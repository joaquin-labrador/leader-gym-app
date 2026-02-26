import apiClient from './apiClient';
import { PaymentHistoryItem, PaymentRequest } from '../types';

export const paymentService = {
    registerPayment: async (data: PaymentRequest): Promise<void> => {
        await apiClient.post('/api/payment', data);
    },

    getPaymentHistory: async (dni: string): Promise<PaymentHistoryItem[]> => {
        const response = await apiClient.get<PaymentHistoryItem[]>(`/api/payment/history/${dni}`);
        return response.data;
    }
};
