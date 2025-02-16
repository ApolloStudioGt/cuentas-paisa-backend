export class CustomerTransactionDto {
  docReference: string;
  description: string;
  amount: number;
  createdAt: Date;
  saleType?: string | null;
  soldAt?: Date | null;
  paidAt?: Date | null;
  bankDescription?: string | null;
  docAuthorization?: string | null;
  transactionType: 'sale' | 'payment';
}
