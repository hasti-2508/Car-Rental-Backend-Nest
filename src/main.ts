import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // app.enableCors({
  //   origin: 'http://localhost:3000',
  //   credentials: true
  // })
  // app.use(express.json());
  // app.use(express.urlencoded({extended: true}))
  app.useGlobalPipes(new ValidationPipe()); 
  await app.listen(3001);
}
bootstrap();
