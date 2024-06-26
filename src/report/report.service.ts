import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { getCustomerBalanceDetailReport, getCustomerBalanceReport } from './definitions';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerService } from 'src/customer/customer.service';
import { CustomerBalanceDetailDto } from './dto/detail-customer-balance.dto';

@Injectable()
export class ReportService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly printerService: PrinterService,
    private readonly customerService: CustomerService,
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

  async customerBalanceDetail(id: string) {
    try {
      const customerDetail = await this.customerService.findCurrentDebt(id);

      if (!customerDetail) {
        throw new NotFoundException('Datos del cliente no encontrados');
      }

      const data: CustomerBalanceDetailDto[] = customerDetail.sales.map(sale => {
        const payments = sale.payments.map(payment => ({
          docReference: payment.docReference,
          docAuthorization: payment.docAuthorization || '',
          createdAt: payment.createdAt,
          bankDescription: payment.bankDescription || '',
          amount: payment.amount,
        }));

        return {
          docReference: sale.docReference,
          createdAt: sale.createdAt,
          amount: sale.amount,
          payments,
        };
      });

      const docDefinition = getCustomerBalanceDetailReport({
        fullName: customerDetail.fullName,
        nit: customerDetail.nit,
        email: customerDetail.email,
        phone: customerDetail.phone,
        sales: data
      });

      return this.printerService.createPdf(docDefinition);
    } catch (error) {
      throw new InternalServerErrorException('Error al generar el reporte');
    }
  }
}
