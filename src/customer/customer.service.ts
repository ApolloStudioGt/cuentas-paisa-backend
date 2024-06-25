import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GetAllCustomersDebt } from './interfaces/get-all-customers-debt';
import { GetCustomerDebt } from './interfaces/get-customer-debt';

@Injectable()
export class CustomerService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Customer[]> {
    return await this.prismaService.customer.findMany();
  }

  async findAllActive(): Promise<Customer[]> {
    return await this.prismaService.customer.findMany({
      where: { isActive: true },
    });
  }

  async findAllCurrentDebt(): Promise<GetAllCustomersDebt[]> {
    const customers = await this.prismaService.customer.findMany({
      include: {
        sales: {
          where: {
            paid: false,
          },
          include: {
            payments: {
              where: {
                createdAt: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
              },
            },
          },
        },
      },
    });

    const customersDebt: GetAllCustomersDebt[] = customers.map((customer) => {
      let totalDebt = 0;

      customer.sales.forEach((sale) => {
        const totalPayments = sale.payments.reduce(
          (total, payment) => total + payment.amount,
          0,
        );
        const currentDebt = sale.amount - totalPayments;
        totalDebt += currentDebt;
      });

      return {
        id: customer.id,
        fullName: customer.fullName,
        nit: customer.nit,
        email: customer.email,
        phone: customer.phone,
        currentDebt: totalDebt,
        createdAt: customer.createdAt,
      };
    });
    return customersDebt;
  }

  async findCurrentDebt(id: string): Promise<GetCustomerDebt> {
    const customer = await this.prismaService.customer.findUnique({
      where: {
        id,
        isActive: true,
      },
      include: {
        sales: {
          where: {
            paid: false,
          },
          include: {
            payments: {
              where: {
                createdAt: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
              },
              include: {
                bank: true,
              },
            },
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Datos del cliente no encontrados');
    }

    let currentDebt = 0;

    const salesData = customer.sales.map(sale => {
      const totalPayments = sale.payments.reduce((total, payment) => total + payment.amount, 0);
      const subtotal = sale.amount - totalPayments;
      currentDebt += subtotal;

      return {
        id: sale.id,
        docReference: sale.docReference,
        description: sale.description,
        amount: sale.amount,
        createdAt: sale.createdAt,
        subtotal,
        payments: sale.payments.map(payment => ({
          id: payment.id,
          docReference: payment.docReference,
          description: payment.description,
          amount: payment.amount,
          bankDescription: payment.bank ? payment.bank.description || '' : '',
          docAuthorization: payment.docAuthorization || '',
          createdAt: payment.createdAt
        })),
      };
    });

    const detailedBalanceCustomer: GetCustomerDebt = {
      id: customer.id,
      fullName: customer.fullName,
      nit: customer.nit,
      email: customer.email,
      phone: customer.phone,
      currentDebt,
      createdAt: customer.createdAt,
      sales: salesData,
    };
    return detailedBalanceCustomer;
  }

  async findOne(id: string): Promise<Customer | string> {
    const customer = await this.prismaService.customer.findFirst({
      where: { id, isActive: true },
    });

    if (!customer)
      throw new NotFoundException(`Customer with id ${id} not found`);
    return customer;
  }

  async create(
    createcustomerDto: CreateCustomerDto,
  ): Promise<Customer | string> {
    const existingCustomer = await this.prismaService.customer.findUnique({
      where: { nit: createcustomerDto.nit },
    });

    if (existingCustomer) {
      throw new BadRequestException(
        `The customer with the NIT ${existingCustomer.nit} already exists`,
      );
    }

    return await this.prismaService.customer.create({
      data: createcustomerDto,
    });
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    await this.findOne(id);

    return await this.prismaService.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: string): Promise<Customer> {
    const customer: Customer | string = await this.findOne(id);
    if (typeof customer === 'string') throw new NotFoundException(customer);
    return await this.prismaService.customer.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
