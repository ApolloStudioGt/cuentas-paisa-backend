import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Payment[]> {
    return await this.prismaService.payment.findMany({
      where: { isActive: true },
    });
  }

  async findOne(id: string): Promise<Payment | string> {
    const payment = await this.prismaService.payment.findUnique({
      where: { id, isActive: true },
    });

    if (!payment)
      throw new NotFoundException(`Transaction with id  ${id} not found`);
    return payment;
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    if (createPaymentDto.bankId && !createPaymentDto.docAuthorization) {
      throw new BadRequestException(`Ingrese número de autorización.`);
    } else if (createPaymentDto.docAuthorization && !createPaymentDto.bankId) {
      throw new BadRequestException(
        `Ingrese banco donde fue realizado el depósito.`,
      );
    }

    const customer = await this.prismaService.customer.findUnique({
      where: { id: createPaymentDto.customerId },
    });

    if (!customer)
      throw new NotFoundException(
        `Customer with id ${createPaymentDto.customerId} not found`,
      );

    customer.debtAmount = customer.debtAmount - createPaymentDto.amount;

    await this.prismaService.customer.update({
      where: { id: createPaymentDto.customerId },
      data: { debtAmount: customer.debtAmount },
    });

    return await this.prismaService.payment.create({ data: createPaymentDto });
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.findOne(id);
    if (typeof payment === 'string') throw new NotFoundException(payment);
    return await this.prismaService.payment.update({
      where: { id },
      data: updatePaymentDto,
    });
  }

  async remove(id: string): Promise<Payment> {
    await this.findOne(id);
    return await this.prismaService.payment.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
