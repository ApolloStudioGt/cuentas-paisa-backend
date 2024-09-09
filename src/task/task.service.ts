import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { Customer } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Inicia el proceso de corte de cuentas diario');
    //Obtener todos los clientes activos
    const customer: Customer[] = await this.prismaService.customer.findMany({
      where: { isActive: true },
    });

    customer.forEach(async (element) => {
      // Consultar el ultimo corte del cliente
      const lastCutOff = await this.prismaService.accountCutOff.findFirst({
        where: { customerId: element.id },
        orderBy: { createdAt: 'desc' },
      });
      // Consultar las ventas y pagos del cliente
      const sales = await this.prismaService.sale.findMany({
        where: {
          customerId: element.id,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      });
      // Calcular la deuda total del cliente
      // Si no hay corte anterior, la deuda total es 0

      let totalDebt = lastCutOff ? lastCutOff.amount : 0;
      this.logger.log('Total debt: ' + totalDebt);

      sales.forEach((sale) => {
        const totalPayments = 0;
        const currentDebt = sale.amount - totalPayments;
        totalDebt += currentDebt;
      });

      this.logger.log('Total debt after calculate: ' + totalDebt);
      // Crear el corte de cuenta de hoy
      await this.prismaService.accountCutOff.create({
        data: {
          customerId: element.id,
          amount: totalDebt,
          description: '',
        },
      });
      this.logger.log(
        'Corte Creado con exito para cliente ' + element.fullName,
      );
    });
    this.logger.log('Finalizo el proceso de corte de cuentas diario');
  }
}
