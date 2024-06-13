import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { SalesModule } from './sale/sale.module';
import { PaymentModule } from './payment/payment.module';
import { SaleTypeModule } from './sale-type/sale-type.module';
import { AccountCutOffModule } from './account-cut-off/account-cut-off.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    CustomerModule,
    SalesModule,
    PaymentModule,
    SaleTypeModule,
    AccountCutOffModule,
  ],
})
export class AppModule {}
