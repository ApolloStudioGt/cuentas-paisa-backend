import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
export class CreatePaymentDto {
  @ApiProperty({ description: 'Payment transaction description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Payment transaction amount' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Payment transaction sale id' })
  @IsNotEmpty()
  @IsUUID()
  salesId: string;
}
