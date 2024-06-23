import { Injectable } from '@nestjs/common';
import { Bank } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BankService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll(): Promise<Bank[]> {
    return await this.prismaService.bank.findMany({
      where: {
        isActive: true,
      },
    });
  }
}
