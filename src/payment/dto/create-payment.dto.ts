import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
export class CreatePaymentDto {
  @ApiProperty({ description: 'Payment transaction document reference' })
  @IsNotEmpty()
  @IsString()
  docReference: string;

  @ApiProperty({ description: 'Payment transaction description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Payment transaction amount' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Sale transaction customer id' })
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @ApiProperty({ description: 'Payment transaction bank id' })
  @IsOptional()
  @IsUUID()
  bankId?: string;

  @ApiProperty({ description: 'Payment transaction authorization document' })
  @IsOptional()
  @IsString()
  docAuthorization?: string;
}
