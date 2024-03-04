import { Controller, Get, Param } from '@nestjs/common';
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
      return err;
    }
  }
}
