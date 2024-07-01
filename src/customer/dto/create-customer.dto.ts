import { IsEmail, IsString, Matches } from 'class-validator';
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
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  email: string;

  @ApiProperty({ description: 'Customer phone number' })
  @IsString()
  @Matches(/^(\d{4}-\d{4}|\d{4}\d{4}|\d{9})$/, {
    message: 'Número telefónico inválido',
  })
  phone: string;
}
