import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrinterModule } from 'src/printer/printer.module';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService, CustomerService],
  imports: [PrinterModule, PrismaModule],
})
export class ReportModule {}
