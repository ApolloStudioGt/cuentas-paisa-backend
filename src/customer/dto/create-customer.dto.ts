import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Customer full name' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Customer nit' })
  @IsString()
  nit: string;

  @ApiProperty({ description: 'Customer email' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Customer phone number' })
  @IsString()
  phone: string;
}
