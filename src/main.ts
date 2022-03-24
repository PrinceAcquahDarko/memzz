import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'files'),{
    index:false,
    prefix: '/files'
  })
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
