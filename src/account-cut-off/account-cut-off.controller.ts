import { Controller, Get, Param } from '@nestjs/common';
import { AccountCutOffService } from './account-cut-off.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('account-cut-off')
@ApiTags('account-cut-off')
export class AccountCutOffController {
  constructor(private readonly accountCutOffService: AccountCutOffService) {}

  @Get()
  findAll() {
    return this.accountCutOffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountCutOffService.findOne(+id);
  }
}
