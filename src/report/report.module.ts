import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrinterModule } from 'src/printer/printer.module';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  imports: [PrinterModule, PrismaModule],
})
export class ReportModule {}
