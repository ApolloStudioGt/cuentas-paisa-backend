import { Controller, Get, Param } from '@nestjs/common';
import { SaleTypeService } from './sale-type.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('sale-type')
@ApiTags('sale-type')
export class SaleTypeController {
  constructor(private readonly saleTypeService: SaleTypeService) {}

  @Get()
  @Public()
  findAll() {
    return this.saleTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleTypeService.findOne(+id);
  }
}
