import { Controller, Get, Post, Patch, Param, Body, UsePipes } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from '@prisma/client';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Get('AllCustomers')
    async getAllCustomers(): Promise<Customer[]> {
        return this.customerService.getAllCustomers();
    }

    @Get('ActiveCustomers')
    async getActiveCustomers(): Promise<Customer[]> {
        return this.customerService.getActiveCustomers();
    }

    @Get('CustomerById/:id') 
    async getCustomerById(@Param('id') id: string): Promise<Customer>{
        return this.customerService.getCustomerById(id);
    }

    @Post('CreateCustomer')
    async createCustomer(@Body() createCustomerDto: CreateCustomerDto): Promise<string> {
        return this.customerService.createCustomer(createCustomerDto);   
    }

    @Patch('UpdateCustomer/:id')
    async updateCustomer(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto): Promise<string> {
        return this.customerService.updateCustomer(id, updateCustomerDto);
    }

    @Patch('DeleteCustomer/:id')
    async deleteCustomer(@Param('id') id: string): Promise<string> {
        return this.customerService.deleteCustomer(id);
    }
}
