import { Controller, Post, Patch, Get, UploadedFile,  Param, ParseIntPipe,  UseInterceptors, Body, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { follwersDto, LikesDto, updateUserDto } from './dto';
import { UserService } from './user.service';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';



const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('file not supported'), false);
    }
    callback(null, true);
  };

  const editFileName = (req, file, callback) => {
 
    callback(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  };

@Controller('user')
export class UserController {

    constructor(private _us: UserService){}
    
    @Post('/followers')
    Followers(@Body() dto:follwersDto){
        return this._us.Followers(dto)
    }

    @Post('/unfollow')
    unFollow(@Body() dto:follwersDto){
        return this._us.unFollower(dto)
    }

    @Post('/likes')
    updateLikes(@Body() dto:LikesDto){
        return this._us.addLikes(dto)
    }

    @Post('/removelikes')
    removeLikes(@Body() dto:LikesDto){
        return this._us.removeLikes(dto)
    }

    @Post('/adddislikes')
    addDislikes(@Body() dto:LikesDto){
        return this._us.addDisLikes(dto)
    }

    @Post('/removedislikes')
    removeDislikes(@Body() dto:LikesDto){
        return this._us.rmDisLikes(dto)
    }

    @Get()
    getAllUsers(){
        return this._us.getAllUsers()
    }

    @Post('/addfav')
    updateFavs(@Body() dto:LikesDto){
        return this._us.updateFavs(dto)
    }

    @Post('/removefav')
    removeFavs(@Body() dto:LikesDto){
        return this._us.removeFavs(dto)
    }

    @Get('/download/:id')
    download(@Param('id', ParseIntPipe) mediaId:number){
        return this._us.addDownloads(mediaId)
    }

    @UseGuards(JwtGuard)
    @Get('loggedIn')
    getUserId(@GetUser('id') userId: number){
        return userId
    }

    @UseGuards(JwtGuard)
    @Get('userInfo')
    getUser(@GetUser() user){
        return user
    }

    @UseGuards(JwtGuard)
    @Patch('updatepass')
    async updatepass(@GetUser('password') user: any, @Body() dto){
        return this._us.updatepass(user,dto)
    }

    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './files',
            filename: editFileName,
          }),
          fileFilter: imageFileFilter,
          limits:{
            fileSize: 1024*1024 * 5
          }
    }))

    @UseGuards(JwtGuard)
    @Patch('updateUser')
    updateUser(@GetUser('id') userId: number, @Body() dto:updateUserDto, @UploadedFile() file: Express.Multer.File){
        return this._us.updateUser(dto,file, userId)
    }

    @Get('mediaUser/:id')
    getmediaUser(@Param('id', ParseIntPipe) id:number){
        return this._us.getmediaUser(id)
    }
}
