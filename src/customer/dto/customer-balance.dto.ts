import { IsNumber, IsString } from "class-validator";

export class CustomerBalanceDto {
    @IsString()
    id: string;

    @IsString()
    fullName: string;
    
    @IsString()
    nit: string;
    
    @IsString()
    email: string;
    
    @IsString()
    phone: string;
    
    @IsNumber()
    currentDebt: number;
}