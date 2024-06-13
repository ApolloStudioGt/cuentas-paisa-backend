import { Module } from '@nestjs/common';
import { SaleTypeService } from './sale-type.service';
import { SaleTypeController } from './sale-type.controller';

@Module({
  controllers: [SaleTypeController],
  providers: [SaleTypeService],
})
export class SaleTypeModule {}
