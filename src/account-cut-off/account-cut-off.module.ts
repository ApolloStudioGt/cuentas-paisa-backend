import { Module } from '@nestjs/common';
import { AccountCutOffService } from './account-cut-off.service';
import { AccountCutOffController } from './account-cut-off.controller';

@Module({
  controllers: [AccountCutOffController],
  providers: [AccountCutOffService],
})
export class AccountCutOffModule {}
