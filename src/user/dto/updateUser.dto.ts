import {  IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class updateUserDto{

    @IsString()
    @IsOptional()
    firstName?:string
    
    
    @IsString()
    @IsOptional()
    lastName?:string


    @IsOptional()
    @IsEmail()
    email: number;


    @IsOptional()
    @IsString()
    link: number;


}