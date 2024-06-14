import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;
}
