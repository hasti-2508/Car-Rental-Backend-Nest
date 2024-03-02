import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarModule } from './car/car.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import mongoose from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { ReservationModule } from './reservation/reservation.module';
import { StripeModule } from './stripe/stripe.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    CarModule,
    AuthModule,
    ReservationModule,
    StripeModule],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {
  async onModuleInit() {
    try {
      await mongoose.connection;
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection error:', error);
    }
  }
}
