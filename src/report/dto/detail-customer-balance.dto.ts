export class CustomerBalanceDetailDto {
    docReference: string;
    createdAt: Date;
    amount: number;
    payments: PaymentDto [];
}

export class PaymentDto {
    docReference: string;
    docAuthorization: string;
    createdAt: Date;
    bankDescription: string;
    amount: number;
}