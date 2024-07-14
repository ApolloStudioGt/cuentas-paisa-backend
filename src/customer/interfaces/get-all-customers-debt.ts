export interface GetAllCustomersDebt {
  id: string;
  fullName: string;
  nit: string;
  email: string;
  phone: string;
  currentDebt: number;
  createdAt: Date;
}
