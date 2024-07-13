import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import {
  getCustomerBalanceDetailReport,
  getCustomerBalanceReport,
  getCustomerSummaryReport,
} from './definitions';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerService } from 'src/customer/customer.service';
import { CustomerBalanceDetailDto } from './dto/detail-customer-balance.dto';
import { TransactionsById } from './interfaces/transactions-by-id';
import {
  GetCustomerDebt,
  Payment,
  Sale,
} from 'src/customer/interfaces/get-customer-debt';
import { SummaryTransactions } from './interfaces/summary-transactions';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly printerService: PrinterService,
    private readonly customerService: CustomerService,
  ) {}

  async allCustomerBalance() {
    try {
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
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al generar el reporte');
    }
  }

  async customerBalanceDetail(id: string) {
    try {
      const customerDetail = await this.customerService.findCurrentDebt(id);

      if (!customerDetail) {
        throw new NotFoundException('Datos del cliente no encontrados');
      }

      const data: CustomerBalanceDetailDto[] = customerDetail.sales.map(
        (sale) => {
          const payments = sale.payments.map((payment) => ({
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
        },
      );

      const docDefinition = getCustomerBalanceDetailReport({
        fullName: customerDetail.fullName,
        nit: customerDetail.nit,
        email: customerDetail.email,
        phone: customerDetail.phone,
        sales: data,
      });

      const pdfDoc = this.printerService.createPdf(docDefinition);

      const currentDate = new Date()
        .toLocaleDateString('en-GB')
        .replace(/\//g, '');

      const reportName = `DetalleSaldo_${customerDetail.fullName.replace(/\s+/g, '')}_${currentDate}.pdf`;

      return { pdfDoc, reportName };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al generar el reporte');
    }
  }

  async transactionsByDate(transactionsById: TransactionsById) {
    try {
      const { id, startDate, endDate } = transactionsById;

      const customer = await this.prismaService.customer.findUnique({
        where: {
          id,
          isActive: true,
          sales: {
            some: {
              createdAt: {
                gte: new Date(startDate),
                lte: new Date(`${endDate}T23:59:59.999Z`),
              },
            },
          },
        },
        include: {
          sales: {
            where: {
              isActive: true,
              createdAt: {
                gte: new Date(startDate),
                lte: new Date(`${endDate}T23:59:59.999Z`),
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
            include: {
              payments: {
                where: {
                  isActive: true,
                },
                orderBy: {
                  createdAt: 'asc',
                },
                include: {
                  bank: true,
                },
              },
            },
          },
        },
      });

      if (!customer) {
        throw new NotFoundException(
          'No existen transacciones entre las fechas ingresadas',
        );
      }

      const salesData: Sale[] = customer.sales.map((sale) => {
        let saleSubtotal = sale.amount;

        const mappedPayments: Payment[] = sale.payments.map((payment) => {
          saleSubtotal -= payment.amount;

          return {
            id: payment.id,
            docReference: payment.docReference,
            description: payment.description,
            amount: payment.amount,
            bankDescription: payment.bank ? payment.bank.description || '' : '',
            docAuthorization: payment.docAuthorization || '',
            createdAt: payment.createdAt,
            subtotal: saleSubtotal,
          };
        });

        return {
          id: sale.id,
          docReference: sale.docReference,
          description: sale.description,
          amount: sale.amount,
          subtotal: saleSubtotal,
          createdAt: sale.createdAt,
          payments: mappedPayments,
        };
      });

      const docDefinition = getCustomerBalanceDetailReport({
        fullName: customer.fullName,
        nit: customer.nit,
        email: customer.email,
        phone: customer.phone,
        sales: salesData,
      });

      const pdfDoc = this.printerService.createPdf(docDefinition);
      const reportName = `DetalleTransacciones_${customer.fullName.replace(/\s+/g, '')}.pdf`;

      return { pdfDoc, reportName };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al generar el reporte');
    }
  }

  async summaryTransactionsByDate(summaryTransactions: SummaryTransactions) {
    try {
      const { startDate, endDate } = summaryTransactions;

      const customersData = await this.prismaService.customer.findMany({
        where: {
          isActive: true,
          sales: {
            some: {
              createdAt: {
                gte: new Date(startDate),
                lte: new Date(`${endDate}T23:59:59.999Z`),
              },
            },
          },
        },
        include: {
          sales: {
            where: {
              isActive: true,
              createdAt: {
                gte: new Date(startDate),
                lte: new Date(`${endDate}T23:59:59.999Z`),
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
            include: {
              payments: {
                where: {
                  isActive: true,
                },
                orderBy: {
                  createdAt: 'asc',
                },
                include: {
                  bank: true,
                },
              },
            },
          },
        },
      });

      if (!customersData || customersData.length == 0) {
        throw new NotFoundException(
          'No existen transacciones entre las fechas ingresadas',
        );
      }

      const mappedData: GetCustomerDebt[] = customersData.map((customer) => {
        let currentDebt = 0;

        const salesData: Sale[] = customer.sales.map((sale) => {
          let saleSubtotal = sale.amount;

          const mappedPayments: Payment[] = sale.payments.map((payment) => {
            saleSubtotal -= payment.amount;

            return {
              id: payment.id,
              docReference: payment.docReference,
              description: payment.description,
              amount: payment.amount,
              bankDescription: payment.bank ? payment.bank.description : '',
              docAuthorization: payment.docAuthorization || '',
              createdAt: payment.createdAt,
              subtotal: saleSubtotal,
            };
          });

          currentDebt += saleSubtotal;

          return {
            id: sale.id,
            docReference: sale.docReference,
            description: sale.description,
            amount: sale.amount,
            subtotal: saleSubtotal,
            createdAt: sale.createdAt,
            payments: mappedPayments,
          };
        });

        return {
          id: customer.id,
          fullName: customer.fullName,
          nit: customer.nit,
          email: customer.email,
          phone: customer.phone,
          createdAt: customer.createdAt,
          currentDebt,
          sales: salesData,
        };
      });

      const docDefinition = getCustomerSummaryReport({
        customers: mappedData,
      });

      const pdfDoc = await this.printerService.createPdf(docDefinition);
      const reportName = `ResumenTransaccionesClientesActivos.pdf`;

      return { pdfDoc, reportName };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al generar el reporte');
    }
  }
}
