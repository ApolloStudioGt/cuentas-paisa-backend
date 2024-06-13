import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Customer, PrismaClient } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }
  async findAll(): Promise<Customer[]> {
    return await this.customer.findMany();
  }

  async findAllActive(): Promise<Customer[]> {
    return await this.customer.findMany({
      where: { isActive: true },
    });
  }

  async create(
    createcustomerDto: CreateCustomerDto,
  ): Promise<Customer | string> {
    const existingCustomer = await this.customer.findUnique({
      where: { nit: createcustomerDto.nit },
    });

    if (existingCustomer) {
      return `The customer with the NIT ${existingCustomer.nit} already exists`;
    }

    return await this.customer.create({ data: createcustomerDto });
  }

  async findOne(id: string): Promise<Customer | string> {
    const customer = await this.customer.findFirst({
      where: { id, isActive: true },
    });

    if (!customer)
      throw new NotFoundException(`Customer with id ${id} not found`);
    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    await this.findOne(id);

    return await this.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: string): Promise<Customer> {
    const customer: Customer | string = await this.findOne(id);
    if (typeof customer === 'string') throw new NotFoundException(customer);
    return await this.customer.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
