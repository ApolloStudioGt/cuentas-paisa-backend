import { Body, Controller, Get, Post, Param, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { TransactionsById } from './interfaces/transactions-by-id';
import { SummaryTransactions } from './interfaces/summary-transactions';

@Controller('report')
@ApiTags('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('customerbalance') async allCustomerBalance(@Res() response: Response) {
    const pdfDoc = await this.reportService.allCustomerBalance();

    response.status(200).set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename='SaldosPendientesClientesActivos.pdf'`,
    });

    pdfDoc.info.Title = 'Saldo_de_Clientes';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('customerbalance/:id') async customerBalanceDetail(
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const { pdfDoc, reportName } =
      await this.reportService.customerBalanceDetail(id);

    response.status(200).set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(reportName)}"`,
    });

    pdfDoc.info.Title = reportName;
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Post('transactionsbydate')
  async transactionsByDate(
    @Body() transactionsById: TransactionsById,
    @Res() response: Response,
  ) {
    const { pdfDoc, reportName } =
      await this.reportService.transactionsByDate(transactionsById);

    response.status(200).set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(reportName)}"`,
    });

    pdfDoc.info.Title = reportName;
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Post('summarybydate')
  async summaryTransactionsByDate(
    @Body() summaryTransactions: SummaryTransactions,
    @Res() response: Response,
  ) {
    const { pdfDoc, reportName } =
      await this.reportService.summaryTransactionsByDate(summaryTransactions);

    response.status(200).set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(reportName)}"`,
    });

    pdfDoc.info.Title = reportName;
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
