import { Controller, Get, Param } from '@nestjs/common';
import { SaleTypeService } from './sale-type.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('sale-type')
@ApiTags('sale-type')
export class SaleTypeController {
  constructor(private readonly saleTypeService: SaleTypeService) {}

  @Get()
  findAll() {
    return this.saleTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleTypeService.findOne(+id);
  }
}
