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
    expirationDate?: string;
    birthDate?: string | number[];
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
    dni: string;
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
    paymentMethod: string;
}

export interface ExtraPaymentRequest {
    dni: string;
    amount: number;
    paymentMethod: string;
    description: string;
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

export interface AuthUser {
    username: string;
    role: string;
    longSession: boolean;
}

export interface ErrorResponse {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
}

export interface PaymentHistoryFilterDTO {
    memberDni: string | null;
    paymentMethod: string | null;
    startDate: string | null;
    endDate: string | null;
}

export interface PaymentHistoryResponseDTO {
    paymentId: number;
    memberDni: string;
    planDescription: string;
    amountPaid: number;
    paymentMethod: string;
    paymentDate: string;
}

export interface CheckInResponseDTO {
    memberName: string;
    dayToExpirationMembership: number;
}
