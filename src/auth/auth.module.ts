import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from './schemas/auth.user.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
JwtModule.register({
  global: true,
  secret: process.env.SECRET, 
  signOptions: {expiresIn: '60d'}

})],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
