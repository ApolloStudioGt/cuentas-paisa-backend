import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaleType } from '@prisma/client';

@Injectable()
export class SaleTypeService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.saleType.findMany({
      where: { isActive: true },
    });
  }

  async findOne(id: string): Promise<SaleType | string> {
    const saleType = await this.prismaService.saleType.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!saleType) {
      throw new NotFoundException(`Tipo de venta no encontrado`);
    }
    return saleType;
  }
}
