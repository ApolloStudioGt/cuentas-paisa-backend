import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SaleTypeService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }

  async findAll() {
    return await this.saleType.findMany({
      where: { isActive: true },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} saleType`;
  }
}
