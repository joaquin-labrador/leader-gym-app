export interface Plan {
    id: number;
    name: string;
    price: number;
    description?: string;
    durationInDays?: number;
}

export interface PlanSummary {
    id: number;
    name: string;
    price: number;
}

export interface Member {
    dni: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    planId?: number;
    planDescription?: string;
    active: boolean;
    registrationDate: string;
    expirationDate?: string;
    birthDate?: string;
    age?: number;
}

export interface CreateMemberRequest {
    dni: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    planId: number;
    birthDate: string;
}

export interface UpdateMemberRequest {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    planId: number;
    birthDate: string;
}

export interface PageMember {
    content: Member[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface PaymentRequest {
    dni: string;
    planId: number;
    amount: number;
}

export interface PaymentHistoryItem {
    id: number;
    dni: string;
    planName: string;
    amount: number;
    paymentDate: string;
    active: boolean;
    expirationDate?: string;
}

export interface ReceiptHistoryItem {
    dni: string;
    firstName: string;
    lastName: string;
    date: string;
}

export interface ErrorResponse {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
}
