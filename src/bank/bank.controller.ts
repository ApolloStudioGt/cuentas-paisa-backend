import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BankService } from './bank.service';

@Controller('bank')
@ApiTags('bank')
export class BankController {
    constructor(private readonly bankService: BankService) {}

    @Get()
    findAll() {
        return this.bankService.findAll();
    }
}
