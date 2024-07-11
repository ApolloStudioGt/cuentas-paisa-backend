import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GetAllByCustomer } from './interfaces/get-all-by-customer';
import { GetDetailById } from './interfaces/get-detail-by-id';

@Controller('sale')
@ApiTags('sale')
export class SaleController {
  constructor(private readonly salesService: SaleService) {}

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Get('bycustomer/:id')
  findByCustomer(@Param('id') id: string): Promise<GetAllByCustomer> {
    return this.salesService.findByCustomer(id);
  }

  @Get('detail/:id')
  getDetailById(@Param('id') id: string): Promise<GetDetailById> {
    return this.salesService.findDetailById(id);
  }

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Patch(':id')
  @ApiBody({ type: CreateSaleDto })
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
