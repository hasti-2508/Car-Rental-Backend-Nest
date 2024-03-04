import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { Reservation } from 'src/reservation/schemas/reservation.schema';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  createPaymentMethod(paymentMethodDetails: any) {
    throw new Error('Method not implemented.');
  }
  private stripe;

  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: mongoose.Model<Reservation>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async checkout(reservationId: string) {
    const isValid = mongoose.Types.ObjectId.isValid(reservationId);

    if (!isValid) {
      throw new HttpException('Invalid ID', 400);
    }

    const reservation = await this.reservationModel.find();
    if (!reservation) {
      throw new NotFoundException('reservation not found');
    }

    const idToMatch = reservationId; //findById method was retrieving null object so had to do it

    const matchedData = reservation.filter((data) =>
      data._id.equals(new ObjectId(idToMatch)),
    );

    const reserve = matchedData[0];
    const total = reserve.totalPrice;

    return this.stripe.paymentIntents.create({
      amount: total * 100,
      currency: 'inr',
      payment_method_types: ['card'],
    });
  }
}
