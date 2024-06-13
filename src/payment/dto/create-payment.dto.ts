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

  @ApiProperty({ description: 'Payment transaction created by user id' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Payment transaction customer id' })
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @ApiProperty({ description: 'Payment transaction type id' })
  @IsNotEmpty()
  @IsUUID()
  saleTypeId: string;
}
