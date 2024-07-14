import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { SalesModule } from './sale/sale.module';
import { PaymentModule } from './payment/payment.module';
import { SaleTypeModule } from './sale-type/sale-type.module';
import { AccountCutOffModule } from './account-cut-off/account-cut-off.module';
import { AuthModule } from './auth/auth.module';
import { FirebaseAdmin } from './config/firebase.setup';
import { PrismaModule } from './prisma/prisma.module';
import { ReportModule } from './report/report.module';
import { PrinterModule } from './printer/printer.module';
import { BankModule } from './bank/bank.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TasksModule } from './task/task.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AuthModule,
    AccountCutOffModule,
    BankModule,
    CustomerModule,
    DashboardModule,
    PaymentModule,
    PrinterModule,
    PrismaModule,
    ReportModule,
    SaleTypeModule,
    SalesModule,
    ScheduleModule.forRoot(),
    TasksModule,
  ],
  providers: [FirebaseAdmin],
})
export class AppModule {}
