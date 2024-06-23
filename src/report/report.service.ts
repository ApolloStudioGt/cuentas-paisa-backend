import { Injectable } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { getCustomerBalanceReport } from './definitions';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(
    private readonly printerService: PrinterService,
    private readonly prismaService: PrismaService,
  ) {}

  async allCustomerBalance() {
    let customerBalance = [];

    const latestCut = await this.prismaService.accountCutOff.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (latestCut) {
      const lastCutDate = new Date(latestCut.createdAt)
        .toISOString()
        .split('T')[0];
      customerBalance = await this.prismaService.accountCutOff.findMany({
        where: {
          isActive: true,
          createdAt: {
            gte: new Date(`${lastCutDate}T00:00:00Z`),
            lte: new Date(`${lastCutDate}T23:59:59.999Z`),
          },
        },
        orderBy: {
          customer: {
            fullName: 'asc',
          },
        },
        distinct: ['customerId'],
        include: {
          customer: true,
        },
      });
    }

    const docDefinition = getCustomerBalanceReport({
      customerBalance: customerBalance,
    });
    return this.printerService.createPdf(docDefinition);
  }
}
