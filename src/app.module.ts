import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [AuthModule, CustomerModule, TransactionModule],
})
export class AppModule {}
