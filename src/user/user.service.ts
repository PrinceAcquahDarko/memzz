import { ForbiddenException, Injectable } from '@nestjs/common';
import { prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { follwersDto, LikesDto } from './dto';
import * as argon from 'argon2'
import {v2} from '../utils'

@Injectable()
export class UserService {
    constructor( private ps: PrismaService){}

    async Followers(dto:follwersDto){
     
        const update = await this.ps.user.update({
            where:{
                id: dto.person
            },
            data:{
                followedBy:{
                    connect:{
                        id: dto.followerId
                    }
                }
            },
            include:{
                following:true,
                media:true,
                followedBy:true
            }
          
        })
        delete update.password
        return update
    }

    async unFollower(dto:follwersDto){
     
        
        const update = await this.ps.user.update({
            where:{
                id: dto.person
            },
            data:{
                followedBy:{
                    disconnect:{
                        id: dto.followerId
                    }
                }
            },
            include:{
                media:true,
                followedBy:true,
                following:true
            }
          
        })
        delete update.password
        return update
    }

    async updatepass(pass, incomingpass){
        const psMatches = await this.verfiyPassword(pass, incomingpass.password)

        if(!psMatches) throw new ForbiddenException('Incorrect password')

        let password = await argon.hash(incomingpass.newPass)

        const user = await this.ps.user.update({
            where:{
                id:pass.id
            },
            data:{
                password

            },
           
        })
        delete user.password
        return user 

    }

    async getAllUsers(){
        const media = await this.ps.user.findMany({
            include:{
                followedBy:true,
                following:true,
                favourites:{
                    include: {
                        media:true
                    }
                }
            }
        })

        return media
    }

    async updateFavs(dto:LikesDto){
        const favs = await this.ps.favourites.create({
            data:{
                mediaId: dto.mediaId,
                userId: dto.userId
            }
        })
        

        return favs
    }

    async removeFavs(dto:LikesDto){
        const favs = await this.ps.user.update({
            where:{
                id: dto.userId
            },
            data:{
                favourites:{
                    disconnect:{
                        id: dto.mediaId  //here we using mediaId for favId
                    }
                }
            
            }
        })

        return favs
    }

    async addLikes(dto:LikesDto){
        const favs = await this.ps.media.update({
            where:{
                id: dto.mediaId
            },
            data:{
                likes:{
                    push: dto.userId
                }
            
            }
        })

        return favs
    }
    async removeLikes(dto:LikesDto){
        const media = await this.ps.media.findUnique({
            where:{
                id: dto.mediaId
            }
        })

        if(media.likes.length){
            const newLikes = media.likes.filter(x => x !== dto.userId )
            const likes = await this.ps.media.update({
                where:{
                    id: dto.mediaId
                },
                data:{
                    likes:newLikes
                
                }
            })
        }
       

        return  media
    }

    async addDisLikes(dto:LikesDto){
        const favs = await this.ps.media.update({
            where:{
                id: dto.mediaId
            },
            data:{
                dislikes:{
                    push: dto.userId
                }
            
            }
        })

        return favs
    }

    async rmDisLikes(dto){
        const media = await this.ps.media.findUnique({
            where:{
                id: dto.mediaId
            }
        })

        if(media.dislikes.length){
            const newdislikes = media.dislikes.filter(x => x !== dto.userId )
            const dislikes = await this.ps.media.update({
                where:{
                    id: dto.mediaId
                },
                data:{
                    dislikes:newdislikes
                
                }
            })
        }
       

        return  media
    }


    async addDownloads(mediaId){
        let count = 1
       const media = await this.ps.media.findUnique({
           where:{
               id: mediaId
           }
       })

       if(media.downloads){
            count = media.downloads + 1
       }
       const updatedDownloads = await this.ps.media.update({
           where:{
               id: mediaId
           },
           data:{
               downloads: count
           }
       })

        return updatedDownloads
    }


   
   async updateUser(dto,file, userId){
        if(file){
            let cloudi = v2()
            let res = await cloudi.uploader.upload(file.path)
            dto.link = res.secure_url
        }
        const updatedUser = await this.ps.user.update({
            where:{
                id:userId
            },
            data:{
                ...dto
            }
        })
        delete updatedUser.password
        return updatedUser
    }

   async getmediaUser(id){
       const user = await this.ps.user.findUnique({
           where:{
               id
           },
           include:{
               following:true,
               media:true,
               followedBy:true
           }
       })

       return user
   }


    ImageUrl(dto, file){
        const url = "https://gentle-atoll-57493.herokuapp.com"
        dto.link = `${url}/${file?.path}`
    }

    async verfiyPassword(user, dto){
        const psMatches = await argon.verify(
            user.password,
            dto
        )

        return psMatches
    }

}
