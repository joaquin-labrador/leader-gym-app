import apiClient from './apiClient';
import { PaymentHistoryItem, PaymentHistoryResponseDTO, PaymentHistoryFilterDTO, PaymentRequest, ExtraPaymentRequest } from '../types';

export const paymentService = {
    registerPayment: async (data: PaymentRequest): Promise<void> => {
        await apiClient.post('/api/payment', data);
    },

    registerExtraPayment: async (data: ExtraPaymentRequest): Promise<void> => {
        const payload = {
            memberDni: data.dni,
            amount: data.amount,
            paymentMethod: data.paymentMethod,
            description: data.description
        };
        await apiClient.post('/api/other-payments', payload);
    },

    getPaymentHistory: async (dni: string): Promise<PaymentHistoryItem[]> => {
        const response = await apiClient.get<PaymentHistoryItem[]>(`/api/payment/history/${dni}`);
        return response.data;
    },

    getFilteredPaymentHistory: async (filter: PaymentHistoryFilterDTO): Promise<PaymentHistoryResponseDTO[]> => {
        const response = await apiClient.post<PaymentHistoryResponseDTO[]>('/api/payment/history/filter', filter);
        return response.data;
    },

    deleteLastPayment: async (paymentId: number): Promise<void> => {
        await apiClient.delete(`/api/payment/history/${paymentId}`);
    }
};
