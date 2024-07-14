export interface GetAllByCustomer {
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
  subtotal: number;
  createdAt: Date;
}
