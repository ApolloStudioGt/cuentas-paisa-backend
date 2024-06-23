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

@Controller('sale')
@ApiTags('sale')
export class SaleController {
  constructor(private readonly salesService: SaleService) {}

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get('total')
  async totalSalesAmount(): Promise<{ amount: number }> {
    return await this.salesService.totalSalesAmount();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
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
