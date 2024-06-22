import { Module } from '@nestjs/common';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BankController],
  providers: [BankService],
  imports: [PrismaModule],
})
export class BankModule {}
