export interface GetCustomerDebt {
  id: string;
  fullName: string;
  nit: string;
  email: string;
  phone: string;
  createdAt: Date;
  currentDebt: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  docReference: string;
  description: string;
  amount: number;
  createdAt: Date;
  saleType?: string;
  soldAt?: Date;
  bankDescription?: string;
  docAuthorization?: string;
  transactionType?: string;
  paidAt?: Date;
}
