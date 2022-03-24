import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { editMediaDto, MediaDto } from './dto';

@Injectable()
export class MediaService {
    constructor(private ps: PrismaService){}

    async uploadMedia(dto:MediaDto, file, userId:number){
        this.mediaType(dto, file)

        this.ImageUrl(dto,file)
        
        // http://localhost:3000/files\\2022-03-07T17-06-13.326Zavi.jpg
       return await this.createMedia(dto, userId)
        

    }

    async editMedia(dto:editMediaDto, id:number, userId:number){
        const media = await this.findMedia(id)

        if(!media) throw new ForbiddenException('no such media')
        if(media.userId !== userId) throw new ForbiddenException("can't perform operation")


        return  this.updateMediaLogic(id, dto)
    }

    getMedia(id:number){
        return this.findMedia(id)
    }

    getAllMedia(){
        return this.getAllMediaLogic()
    }

    async deleteMedia(id:number, userId:number){
        const media = await this.findMedia(id)

        if(!media) throw new ForbiddenException('no such media')
        if(media.userId !== userId) throw new ForbiddenException("can't perform operation")

        return this.deleteMediaLogic(id)

    }

    mediaType(dto:MediaDto, file){
        // file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'
        switch(file.mimetype){
            case 'image/jpeg':
                dto.Mediatype = 'image';
                break;
            case 'image/png':
                dto.Mediatype = 'image';
                break;
            case 'video/mp4':
                dto.Mediatype = 'video';
                break;
            case 'image/gif':
                dto.Mediatype = 'gif';
                break;
            case 'image/jpg':
                dto.Mediatype = 'image';
                break;
         
        }
    }

    ImageUrl(dto, file){
        const url = "https://gentle-atoll-57493.herokuapp.com" 
        dto.link = `${url}/${file?.path}`
    }

    async createMedia(dto:MediaDto, userId:number){
        try {
            const media = await this.ps.media.create({
                data:{
                    userId,
                    ...dto
                },
                include:{
                    user:{
                        include:{
                            following:true,
                            followedBy:true,
                            media:true
                        }
                    },
                    Favourites:true
                    }
            })

            return media
        } catch (error) {
            throw error
        }
       
    }


    async findMedia(id){
        const media = await this.ps.media.findUnique({
            where:{
                id
            }
        })

        return media
    }

    async updateMediaLogic(id:number, dto:editMediaDto){
        await this.ps.media.update({
            where:{
                id
            },
            data:{
                ...dto
            }
        })
     
    }


    async getAllMediaLogic(){
        const media = await this.ps.media.findMany({
            orderBy:{
                createdAt: 'desc'
            },
            include:{
                user:{
                    include:{
                        following:{
                            include:{
                                media:true,
                                followedBy:true,
                                following:true
                            }
                        },
                        followedBy:{
                            include:{
                                media:true,
                                followedBy:true,
                                following:true
                            }
                        },
                        media:true
                    }
                },
                Favourites:true
                }
        })
        
        return media
    }


    async deleteMediaLogic(id){
     let x =    await this.ps.media.delete({
            where:{
                id
            }
        })

        return x
    }
}
