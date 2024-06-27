export interface GetCustomerDebt {
    id: string;
    fullName: string;
    nit: string;
    email: string;
    phone: string;
    createdAt: Date;
    currentDebt: number;
    sales: Sale[];
}

export interface Sale {
    id: string;
    docReference: string;
    description: string;
    amount: number;
    createdAt: Date;
    payments: Payment[];
}

export interface Payment {
    id: string;
    docReference: string;
    description: string;
    amount: number;
    bankDescription: string;
    docAuthorization: string;
    createdAt: Date;
    subtotal: number;
}