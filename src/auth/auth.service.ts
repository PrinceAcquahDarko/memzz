import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import * as argon from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(private ps: PrismaService,private config:ConfigService, private jwt:JwtService){}

    async signUp(dto:SignUpDto){

        try {
            const user = await this.insertUser(dto)            

            return this.signToken(user)

        } catch (error) {

            if(error instanceof PrismaClientKnownRequestError){
               
                if(error.code === 'P2002'){
                  throw new ForbiddenException('Email already taken')
                }

              }
    
              throw error
        }
    }


    async signIn(dto:SignInDto){
        const user = await this.insertSignIn(dto)
        
        if(!user) throw new ForbiddenException('No such email')

        const psMatches = await this.verfiyPassword(user, dto)

        if(!psMatches) throw new ForbiddenException('Incorrect password')

        delete user.password

        return this.signToken(user)


    }

    async insertSignIn(dto){
        const user = await this.ps.user.findUnique({
            where:{
                email: dto.email
            }
        })

        return user
    }

    async insertUser(dto){
        try {
            dto.password = await argon.hash(dto.password)
            const user = await this.ps.user.create({
                data:{
                    ...dto
                },
                select:{
                    id:true,
                    email:true
                }
            })
            
            return user 
        } catch (error) {
            throw error
            
        }
  
    }

    async signToken(user){
        const payload = {
          sub: user.id,
          email: user.email
        }
        const secret = this.config.get('SECRET')
    
        const token = await this.jwt.signAsync(payload, {
          secret: secret
        })
    
        return {
          accesstoken:token
        }
    }


    async verfiyPassword(user, dto){
        const psMatches = await argon.verify(
            user.password,
            dto.password
        )

        return psMatches
    }
}
