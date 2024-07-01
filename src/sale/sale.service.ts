import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Sale } from '@prisma/client';

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
