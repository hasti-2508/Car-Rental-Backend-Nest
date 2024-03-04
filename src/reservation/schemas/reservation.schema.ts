import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation extends Document {
  _id: mongoose.Types.ObjectId;

  @Prop()
  userId: mongoose.Types.ObjectId;

  @Prop()
  carId: mongoose.Types.ObjectId;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  durationInDays: number;

  @Prop()
  totalPrice: number;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
