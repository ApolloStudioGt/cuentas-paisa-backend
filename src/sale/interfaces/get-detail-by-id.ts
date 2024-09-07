import { Customer, Sale } from '@prisma/client';

export interface GetDetailById extends Sale {
  customer: Customer;
  currentDebt: number;
}
