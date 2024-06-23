import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('customer')
@ApiTags('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Get('active')
  findAllActive() {
    return this.customerService.findAllActive();
  }

  @Get('detail')
  async findAllCurrentDebt(): Promise<any[]> {
    return this.customerService.findAllCurrentDebt();
  }

  @Get('registered')
  async findAllRegistered(): Promise< {registered: number} > {
    return this.customerService.findAllRegistered();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Patch(':id')
  @ApiBody({ type: CreateCustomerDto })
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
