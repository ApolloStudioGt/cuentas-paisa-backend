import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateSaleDto {
  @ApiProperty({ description: 'Sale transaction reference document ' })
  @IsNotEmpty()
  @IsString()
  docReference: string;

  @ApiProperty({ description: 'Sale transaction description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Sale transaction amount' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Sale transaction created by user id' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Sale transaction customer id' })
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @ApiProperty({ description: 'Sale transaction type id' })
  @IsNotEmpty()
  @IsUUID()
  saleTypeId: string;
}
