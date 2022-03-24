import {  IsNumber, IsOptional, IsString } from "class-validator";

export class editMediaDto{

    @IsString()
    @IsOptional()
    title?:string
    
    
    @IsString()
    @IsOptional()
    description?:string


    @IsOptional()
    @IsNumber()
    likes: number;


    @IsOptional()
    @IsNumber()
    dislikes: number;


}