import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';

@Controller('bank')
@ApiTags('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get()
  findAll() {
    return this.bankService.findAll();
  }

  @Post()
  create(@Body() createBankDto: CreateBankDto) {
    return this.bankService.create(createBankDto);
  }
}
