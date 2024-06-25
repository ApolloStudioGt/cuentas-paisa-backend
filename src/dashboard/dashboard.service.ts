import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetSummaryDashboard } from './interfaces/get-summary-dashboard';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async summary(): Promise<GetSummaryDashboard> {
    const registered = await this.prismaService.customer.count();

    const totalPayments = await this.prismaService.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        isActive: true,
      },
    });

    const totalSales = await this.prismaService.sale.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        isActive: true,
      },
    });

    return {
      customerRegistered: registered,
      paymentsAmount: totalPayments._sum.amount || 0,
      salesAmount: totalSales._sum.amount || 0,
    };
  }
}
