import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationSchema } from './schemas/reservation.schema';
import { UserSchema } from 'src/auth/schemas/auth.user.schema';
import { CarSchema } from 'src/car/schemas/car.schemas';


@Module({
  imports:[
    MongooseModule.forFeature([{name: 'Reservation', schema: ReservationSchema}]),
  MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
  MongooseModule.forFeature([{name: 'Car', schema: CarSchema}])
],
  controllers: [ReservationController],
  providers: [ReservationService]
})
export class ReservationModule {}
