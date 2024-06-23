import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
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

  async totalPaymentsAmount(): Promise<{ amount: number }> {
    const total = await this.prismaService.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        isActive: true,
      },
    });
    return {
      amount: total._sum.amount || 0
    }
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

    //Verificar si la venta ya fue saldada
    const sale = await this.prismaService.sale.findUnique({
      where: {
        id: createPaymentDto.salesId,
      }
    });

    if (!sale) {
      throw new NotFoundException(`No se encontró la venta.`);
    }

    if (sale.paid) {
      throw new ConflictException(`La venta de: ${sale.description} ya se encuentra saldada.`);
    }

    //Si se selecciona banco que se ingrese documento autorización y visceversa
    if (createPaymentDto.bankId && !createPaymentDto.docAuthorization) {
      throw new BadRequestException(`Ingrese número de autorización.`);
    }
    else if  (createPaymentDto.docAuthorization && !createPaymentDto.bankId) {
      throw new BadRequestException(`Ingrese banco donde fue realizado el depósito.`);
    }

    //Sumatoria de pagos realizados a la venta
    const totalPayments = await this.prismaService.payment.aggregate({
      where: { 
        salesId: createPaymentDto.salesId 
      },
      _sum: {
        amount: true
      }
    });

    const totalPaid = totalPayments._sum.amount || 0;
    const saleAmount = sale.amount;

    //Validar sumatoria de pagos contra monto de la venta
    if (createPaymentDto.amount + totalPaid > saleAmount ) {
      throw new NotAcceptableException(`El pago a registrar excede el monto pendiente de la venta.`);
    }

    //Actualizar valor de paid a true (saldado)
    if (createPaymentDto.amount + totalPaid === saleAmount) {
      await this.prismaService.sale.update({
        where: {
          id: createPaymentDto.salesId
        },
        data: {
          paid: true
        },
      });
    }

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
