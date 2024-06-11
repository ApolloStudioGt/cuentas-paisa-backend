import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer, PrismaClient } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  private prisma = new PrismaClient();

  async getAllCustomers(): Promise<Customer[]> {
    return await this.prisma.customer.findMany();
  }

  async getActiveCustomers(): Promise<Customer[]> {
    return await this.prisma.customer.findMany({
      where: { isActive: true },
    });
  }

  async getCustomerById(id: string): Promise<Customer> {
    return await this.prisma.customer.findUnique({ where: { id } });
  }

  async createCustomer(createcustomerDto: CreateCustomerDto): Promise<string> {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { nit: createcustomerDto.nit },
    });

    if (existingCustomer) {
      return `El cliente ya se encuentra registrado con el ID ${existingCustomer.id}`;
    }

    await this.prisma.customer.create({ data: createcustomerDto });

    return `Cliente ${createcustomerDto.fullName} creado correctamente`;
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, isActive: true },
    });

    if (!customer)
      throw new NotFoundException(`No se encontró ningun cliente con id ${id}`);
    return customer;
  }

  async updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<string> {
    await this.findOne(id);

    const updatedCustomer = await this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });

    return `Cliente ${updatedCustomer.fullName} actualizado correctamente`;
  }

  async deleteCustomer(id: string): Promise<string> {
    await this.findOne(id);

    const customer = await this.prisma.customer.update({
      where: { id },
      data: { isActive: false },
    });
    return `Cliente ${customer.fullName} desactivado correctamente`;
  }
}
