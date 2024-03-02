// reservation.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Reservation } from './schemas/reservation.schema';
import { ReservationDto } from './dto/reservation.dto';
import { JwtService } from '@nestjs/jwt';
import { CarService } from 'src/car/car.service';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private jwtService: JwtService,
  ) {}

  @Post(':carId')
  async create(
    @Req() req,
    @Param('carId') carId: string,
    @Body() createReservationDto: ReservationDto,
  ): Promise<Reservation> {
    const token = req.cookies.jwt; 
    if(!token){
      throw new NotFoundException("User Should be logged in")
    }
    const decodedToken = this.jwtService.decode(token) as { userId: string };
    const userId = decodedToken.userId;
    return this.reservationService.createReservation(
      userId,
      carId,
      createReservationDto,
    );
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Reservation> {
      return this.reservationService.getReservationById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateReservationDto: ReservationDto): Promise<Reservation> {
      return this.reservationService.updateReservation(id, updateReservationDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
      return this.reservationService.deleteReservation(id);
  }
}
