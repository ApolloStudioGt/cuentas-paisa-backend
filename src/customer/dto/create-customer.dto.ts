import { IsString } from "class-validator";

export class CreateCustomerDto {
    @IsString()
    fullName: string;

    @IsString()
    nit: string;

    @IsString()
    email: string;

    @IsString()
    phone: string;
}
