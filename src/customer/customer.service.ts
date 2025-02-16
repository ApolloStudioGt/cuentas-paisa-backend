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
import { GetCustomerDebt, Transaction } from './interfaces/get-customer-debt';
import isValidNit from '../common/utils/nit-validator';

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
      where: {
        isActive: true,
      },
      include: {
        sales: {
          where: {
            isActive: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const customersDebt: GetAllCustomersDebt[] = customers.map((customer) => {
      return {
        id: customer.id,
        fullName: customer.fullName,
        nit: customer.nit,
        email: customer.email,
        phone: customer.phone,
        currentDebt: customer.debtAmount,
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
            isActive: true,
          },
          orderBy: {
            soldAt: 'desc',
          },
          include: {
            saleType: true,
          },
        },
        payments: {
          where: {
            isActive: true,
          },
          orderBy: {
            paidAt: 'desc',
          },
          include: {
            bank: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Datos del cliente no encontrados');
    }

    let transactions: Transaction[] = customer.sales.map((sale) => {
      return {
        id: sale.id,
        docReference: sale.docReference,
        description: sale.description,
        amount: sale.amount,
        createdAt: sale.createdAt,
        saleType: sale.saleType.description,
        soldAt: sale.soldAt,
        paidAt: null,
        bankDescription: null,
        docAuthorization: null,
        transactionType: 'sale',
      };
    });

    customer.payments.forEach((payment) => {
      transactions.push({
        id: payment.id,
        docReference: payment.docReference,
        description: payment.description,
        amount: payment.amount,
        createdAt: payment.createdAt,
        saleType: null,
        soldAt: null,
        paidAt: payment.paidAt,
        bankDescription: payment.bank.description,
        docAuthorization: payment.docAuthorization,
        transactionType: 'payment',
      });
    });

    //sort the transactions by each date (if it is a sale, by soldAt, if it is a payment, by paidAt)
    transactions = transactions.sort((a, b) => {
      const dateA = a.soldAt
        ? new Date(a.soldAt).getTime()
        : new Date(a.paidAt).getTime();
      const dateB = b.soldAt
        ? new Date(b.soldAt).getTime()
        : new Date(b.paidAt).getTime();
      return dateB - dateA;
    });

    //swap the order of the transactions
    //transactions = transactions.reverse();

    const detailedBalanceCustomer: GetCustomerDebt = {
      id: customer.id,
      fullName: customer.fullName,
      nit: customer.nit,
      email: customer.email,
      phone: customer.phone,
      currentDebt: customer.debtAmount,
      createdAt: customer.createdAt,
      transactions: transactions,
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
      where: {
        nit: createcustomerDto.nit,
      },
    });

    if (!isValidNit(createcustomerDto.nit)) {
      throw new BadRequestException('Invalid NIT');
    }

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
