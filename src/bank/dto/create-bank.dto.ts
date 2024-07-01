import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBankDto {
  @ApiProperty({ description: 'Payment transaction description' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
