import apiClient from './apiClient';
import { CreateMemberRequest, Member, PageMember, UpdateMemberRequest } from '../types';

export const memberService = {
    createMember: async (data: CreateMemberRequest): Promise<void> => {
        await apiClient.post('/api/members', data);
    },

    getMemberByDni: async (dni: string): Promise<Member> => {
        const response = await apiClient.get<Member>(`/api/members/${dni}`);
        return response.data;
    },

    updateMember: async (dni: string, data: UpdateMemberRequest): Promise<void> => {
        await apiClient.put(`/api/members/${dni}`, data);
    },

    deleteMember: async (dni: string): Promise<void> => {
        await apiClient.delete(`/api/members/${dni}`);
    },

    getMembers: async (page = 0, size = 20, sort?: string): Promise<PageMember> => {
        const params: any = { page, size };
        if (sort) params.sort = sort;
        const response = await apiClient.get<PageMember>('/api/members', { params });
        return response.data;
    },
};
