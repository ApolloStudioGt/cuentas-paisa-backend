import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PrismaClient, Sale } from '@prisma/client';

@Injectable()
export class SaleService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }
  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    return this.sale.create({ data: createSaleDto });
  }

  async findAll(): Promise<Sale[]> {
    return await this.sale.findMany({
      where: { isActive: true },
    });
  }

  async findOne(id: string): Promise<Sale | string> {
    const sale = await this.sale.findUnique({
      where: { id, isActive: true },
    });

    if (!sale)
      throw new NotFoundException(`Transaction with id ${id} not found`);
    return sale;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    await this.findOne(id);
    return await this.sale.update({
      where: { id },
      data: updateSaleDto,
    });
  }

  async remove(id: string): Promise<Sale> {
    await this.findOne(id);
    return await this.sale.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
