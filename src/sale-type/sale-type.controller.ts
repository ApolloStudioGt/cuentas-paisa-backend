import { Controller, Get, Param } from '@nestjs/common';
import { SaleTypeService } from './sale-type.service';
import { ApiTags } from '@nestjs/swagger';
// import { PublicApi } from 'src/common/decorators/public-api.decorator';

@Controller('sale-type')
@ApiTags('sale-type')
export class SaleTypeController {
  constructor(private readonly saleTypeService: SaleTypeService) {}

  @Get()
  // @PublicApi()
  findAll() {
    return this.saleTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleTypeService.findOne(+id);
  }
}
