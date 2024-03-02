import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Car {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  brand: string;

  @Prop()
  model: string;

  @Prop()
  colors?: string[];

  @Prop()
  capacity: number;

  @Prop({ required: true })
  rentPrice: Number;

  @Prop()
  ratings: number[];
  
  @Prop()
  averageRating: number; 

  @Prop()
  imageUrl: string;
}

export const CarSchema = SchemaFactory.createForClass(Car);
