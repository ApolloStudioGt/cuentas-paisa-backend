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
import { CustomerTransactionDto } from './dto/detail-customer-balance.dto';
import { TransactionsById } from './interfaces/transactions-by-id';
import {
  GetCustomerDebt,
  Transaction,
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
      const customers = await this.prismaService.customer.findMany({
        where: {
          isActive: true,
        },
        include: {
          accountCutOffs: true,
          sales: {
            where: {
              isActive: true,
            },
          },
        },
      });

      const customerBalance = customers.map((customer) => {
        return {
          customer,
          amount: customer.debtAmount,
          createdAt: new Date(),
        };
      });

      const docDefinition = getCustomerBalanceReport({
        customerBalance,
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

      const data: CustomerTransactionDto[] = [];

      customerDetail.transactions.forEach((transaction) => {
        if (transaction.transactionType === 'sale' || transaction.transactionType === 'payment') {
          data.push({
            docReference: transaction.docReference,
            description: transaction.description,
            amount: transaction.amount,
            createdAt: transaction.createdAt,
            saleType: transaction.saleType || null,
            soldAt: transaction.soldAt || null,
            bankDescription: transaction.bankDescription || null,
            docAuthorization: transaction.docAuthorization || null,
            transactionType: transaction.transactionType,
          });
        }
      });

      const docDefinition = getCustomerBalanceDetailReport({
        fullName: customerDetail.fullName,
        nit: customerDetail.nit,
        email: customerDetail.email,
        phone: customerDetail.phone,
        transactions: data,
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
        },
        include: {
          sales:{
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
              saleType: true,
            },
          },
          payments: {
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
              bank: true,
            },
          },
        },
      });

      if (!customer) {
        throw new NotFoundException(
          'No existen transacciones entre las fechas ingresadas',
        );
      }

      const transactionsData: CustomerTransactionDto[] = [
        ...customer.sales.map((sale) => ({
          docReference: sale.docReference,
          description: sale.description,
          amount: sale.amount,
          createdAt: sale.createdAt,
          saleType: sale.saleType?.description || null,
          soldAt: sale.soldAt || null,
          bankDescription: null,
          docAuthorization: null,
          transactionType: 'sale' as 'sale',
        })),
        ...customer.payments.map((payment) => ({
          docReference: payment.docReference,
          description: payment.description,
          amount: payment.amount,
          createdAt: payment.createdAt,
          saleType: null,
          soldAt: null,
          bankDescription: payment.bank?.description || null,
          docAuthorization: payment.docAuthorization,
          transactionType: 'payment' as 'payment',
        })),
      ];

      const docDefinition = getCustomerBalanceDetailReport({
        fullName: customer.fullName,
        nit: customer.nit,
        email: customer.email,
        phone: customer.phone,
        transactions: transactionsData,
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
              saleType: true,
            },
          },
          payments: {
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
              bank: true,
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

        const totalSalesAmount = customer.sales.reduce((sum, sale) => sum + sale.amount, 0);
        const totalPaymentsAmount = customer.payments.reduce((sum, payment) => sum + payment.amount, 0);

        const currentDebt = totalSalesAmount - totalPaymentsAmount;

        const salesData: Transaction[] = customer.sales.map((sale) => ({
          id: sale.id,
          docReference: sale.docReference,
          description: sale.description,
          amount: sale.amount,
          createdAt: sale.createdAt,
          saleType: sale.saleType?.description || null,
          soldAt: sale.soldAt || null,
          bankDescription: null,
          docAuthorization: null,
          transactionType: 'sale',
        }));

        const paymentsData: Transaction[] = customer.payments.map((payment) => ({
          id: payment.id,
          docReference: payment.docReference,
          description: payment.description,
          amount: payment.amount,
          createdAt: payment.createdAt,
          saleType: null,
          soldAt: null,
          bankDescription: payment.bank?.description || null,
          docAuthorization: payment.docAuthorization || null,
          transactionType: 'payment',
        }));

        const transactionsData: Transaction[] = [
          ...salesData,
          ...paymentsData,
        ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        return {
          id: customer.id,
          fullName: customer.fullName,
          nit: customer.nit,
          email: customer.email,
          phone: customer.phone,
          createdAt: customer.createdAt,
          currentDebt: currentDebt,
          transactions: transactionsData,
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
