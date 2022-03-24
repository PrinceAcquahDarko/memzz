import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {

    constructor(private As: AuthService){}

    @Post('/signup')
    signUp(@Body() dto:SignUpDto){
        return this.As.signUp(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('/signin')
    signIn(@Body() dto:SignInDto){
        return this.As.signIn(dto)
    }
    
}
