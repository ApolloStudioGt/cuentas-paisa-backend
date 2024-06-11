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
import { Customer } from '@prisma/client';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('')
  async findAll() {
    return this.customerService.getAllCustomers();
  }

  @Get('ActiveCustomers')
  async findAllActives(): Promise<Customer[]> {
    return this.customerService.getActiveCustomers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customer> {
    return this.customerService.getCustomerById(id);
  }

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<string> {
    return this.customerService.createCustomer(createCustomerDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<string> {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<string> {
    return this.customerService.deleteCustomer(id);
  }
}
