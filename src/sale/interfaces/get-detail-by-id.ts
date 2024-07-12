import { Customer, Payment, Sale } from '@prisma/client';

export interface GetDetailById extends Sale {
  customer: Customer;
  payments: Payment[];
  currentDebt: number;
}
