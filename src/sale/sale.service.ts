import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Sale } from '@prisma/client';
import {
  GetAllByCustomer,
  Sale as Sales,
} from './interfaces/get-all-by-customer';
import { GetDetailById } from './interfaces/get-detail-by-id';

@Injectable()
export class SaleService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Sale[]> {
    return await this.prismaService.sale.findMany({
      where: { isActive: true },
    });
  }

  async findOne(id: string): Promise<Sale | string> {
    const sale = await this.prismaService.sale.findUnique({
      where: { id, isActive: true },
    });

    if (!sale)
      throw new NotFoundException(`Transaction with id ${id} not found`);
    return sale;
  }

  async findByCustomer(id: string): Promise<GetAllByCustomer> {
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
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            payments: {
              where: {
                isActive: true,
              },
              orderBy: {
                createdAt: 'asc',
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

    const salesData: Sales[] = customer.sales.map((sale) => {
      const saleSubtotal = sale.amount;

      currentDebt += saleSubtotal;

      return {
        id: sale.id,
        docReference: sale.docReference,
        description: sale.description,
        amount: sale.amount,
        subtotal: saleSubtotal,
        createdAt: sale.createdAt,
      };
    });

    const detailedBalanceCustomer: GetAllByCustomer = {
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

  async findDetailById(id: string): Promise<GetDetailById> {
    const sale = await this.prismaService.sale.findUnique({
      where: { id, isActive: true },
    });

    if (!sale)
      throw new NotFoundException(`Transaction with id ${id} not found`);

    const customer = await this.prismaService.customer.findUnique({
      where: { id: sale.customerId },
    });

    const response: GetDetailById = {
      ...sale,
      customer,
    };
    return response;
  }

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const saleType = await this.prismaService.saleType.findUnique({
      where: { id: createSaleDto.saleTypeId },
    });

    if (!saleType)
      throw new NotFoundException(
        `Sale type with id ${createSaleDto.saleTypeId} not found`,
      );

    const customer = await this.prismaService.customer.findUnique({
      where: { id: createSaleDto.customerId },
    });

    if (!customer)
      throw new NotFoundException(
        `Customer with id ${createSaleDto.customerId} not found`,
      );

    return this.prismaService.sale.create({ data: createSaleDto });
  }

  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    await this.findOne(id);
    return await this.prismaService.sale.update({
      where: { id },
      data: updateSaleDto,
    });
  }

  async remove(id: string): Promise<Sale> {
    await this.findOne(id);
    return await this.prismaService.sale.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
