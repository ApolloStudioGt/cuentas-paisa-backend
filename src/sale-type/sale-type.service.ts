import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaleTypeService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.saleType.findMany({
      where: { isActive: true },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} saleType`;
  }
}
