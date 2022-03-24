import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(config: ConfigService, private prisma: PrismaService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('SECRET')
        })
    }

    async validate(payload:any){
        const user = await this.prisma.user.findUnique({
            where:{
              id: payload.sub,
            },
            include:{
                followedBy:{
                    include:{
                        media:true,
                        followedBy:true,
                        following:true
                    }
                },
                favourites:{
                    include:{
                        media:{
                            include:{
                                Favourites:true,
                                user:true
                            }
                        }
                    }
                },
                following:{
                    include:{
                        media:{
                            orderBy:{
                                createdAt: 'desc'
                            },
                            include:{
                                Favourites:true,
                                user:{
                                    include:{
                                        followedBy:true,
                                        following:true,
                                        media:true
                                    }
                                }
                            }
                        },
                        followedBy:true,
                        following:true,
                    }
                },
                media:{
                    orderBy:{
                        createdAt: 'desc'
                    },
                    include:{
                        Favourites:true
                    }
                }
            }
            })
        return user
    }
}