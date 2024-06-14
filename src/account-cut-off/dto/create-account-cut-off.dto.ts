import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateAccountCutOffDto {
    @ApiProperty({ description: 'Account cut off description' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ description: 'Account cut of amount' })
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty({ description: 'Account cut of customer id' })
    @IsNotEmpty()
    @IsUUID()
    customerId: string;
}