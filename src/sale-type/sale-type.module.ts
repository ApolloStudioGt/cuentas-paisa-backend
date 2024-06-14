import { Module } from '@nestjs/common';
import { SaleTypeService } from './sale-type.service';
import { SaleTypeController } from './sale-type.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [SaleTypeController],
  providers: [SaleTypeService],
  imports: [PrismaModule],
})
export class SaleTypeModule {}
