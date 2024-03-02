import { IsNumber, IsDate, IsString } from 'class-validator';

export class ReservationDto {
  // @IsString()
  // userId: string;

  // @IsString()
  // carId: string;

  // @IsDate()
  // startDate: Date;

  // @IsDate()
  // endDate: Date;

  @IsNumber()
  durationInDays: number;

  totalPrice: number;
  startDate: any;
  endDate: any;
}
