import {  IsNotEmpty, IsNumber } from "class-validator";

export class LikesDto {
    @IsNumber()
    @IsNotEmpty()
    mediaId: number;

    @IsNumber()
    @IsNotEmpty()
    userId: number;



}