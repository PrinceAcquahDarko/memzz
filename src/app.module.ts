import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
  }),
   AuthModule, PrismaModule, UserModule, MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
