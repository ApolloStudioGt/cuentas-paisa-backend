import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountCutOffDto } from './dto/create-account-cut-off.dto';
import { AccountCutOff } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountCutOffService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<AccountCutOff[]> {
    return await this.prismaService.accountCutOff.findMany({
      where: { isActive: true },
    });
  }

  async findOne(id: string): Promise<AccountCutOff | string> {
    const accountCutOff = await this.prismaService.accountCutOff.findUnique({
      where: { id, isActive: true },
    });

    if (!accountCutOff)
      throw new NotFoundException(`Transaction with id ${id} not found`);
    return accountCutOff;
  }

  async create(
    createAccountCutOffDto: CreateAccountCutOffDto,
  ): Promise<AccountCutOff> {
    return this.prismaService.accountCutOff.create({
      data: createAccountCutOffDto,
    });
  }
}
