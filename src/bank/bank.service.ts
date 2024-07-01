import { Injectable } from '@nestjs/common';
import { Bank } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBankDto } from './dto/create-bank.dto';

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

  async create(createBankDto: CreateBankDto): Promise<Bank> {
    return await this.prismaService.bank.create({ data: createBankDto });
  }
}
