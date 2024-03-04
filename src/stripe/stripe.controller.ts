import {
  Body,
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  reservationService: any;

  constructor(private stripeService: StripeService) {}

  @Get('/:reservationId')
  checkout(@Param('reservationId') reservationId: string) {
    try {
      return this.stripeService.checkout(reservationId);
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
