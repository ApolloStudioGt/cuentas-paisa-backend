import { Module } from '@nestjs/common';
import { AccountCutOffService } from './account-cut-off.service';
import { AccountCutOffController } from './account-cut-off.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AccountCutOffController],
  providers: [AccountCutOffService],
  imports: [PrismaModule],
})
export class AccountCutOffModule {}
