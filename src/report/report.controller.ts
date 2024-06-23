import { Controller, Get, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('report')
@ApiTags('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('customerbalance')
  async allCustomerBalance(@Res() response: Response) {
    const pdfDoc = await this.reportService.allCustomerBalance();

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Saldo_de_Clientes';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
