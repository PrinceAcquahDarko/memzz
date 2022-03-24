import {  IsNotEmpty, IsNumber } from "class-validator";

export class follwersDto {
    @IsNumber()
    @IsNotEmpty()
    followerId: number;

    @IsNumber()
    @IsNotEmpty()
    person: number;



}