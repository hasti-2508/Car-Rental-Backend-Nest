// reservation.service.ts
import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Reservation } from './schemas/reservation.schema';
import { ReservationDto } from './dto/reservation.dto';
import { User } from 'src/auth/schemas/auth.user.schema';
import { Car } from 'src/car/schemas/car.schemas';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class ReservationService {
  constructor(

    @InjectModel(Reservation.name)
    private reservationModel: mongoose.Model<Reservation>,
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    @InjectModel(Car.name)
    private carModel: mongoose.Model<Car>,
    private jwtService: JwtService,
  ) {}

  async createReservation(
    userId: string,
    carId: string,
    createReservationDto: ReservationDto,
  ): Promise<Reservation> {
    const existingReservations = await this.reservationModel.find({
      carId: carId,
      startDate: { $lt: createReservationDto.endDate },
      endDate: { $gt: createReservationDto.startDate }
  });

  if (existingReservations.length > 0) {
      throw new ConflictException('Car is already booked during the requested period');
  }
  
    const isValid = mongoose.Types.ObjectId.isValid(carId);
    if (!isValid) {
      throw new HttpException('Invalid ID', 400);
    }

    const car = await this.carModel.findById(carId);

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    const totalPrice = Number(
      Number(car.rentPrice) * createReservationDto.durationInDays,
    );

    const reservationData = {
      ...createReservationDto,
      userId: userId,
      carId: carId,
      totalPrice: totalPrice,
    };

    const createdReservation = new this.reservationModel(reservationData);
    return createdReservation.save();
  }

  async getReservationById(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(id);
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    return reservation;
  }

  async updateReservation(
    id: string,
    updateReservationDto: ReservationDto,
  ): Promise<Reservation> {
    const updatedReservation = await this.reservationModel.findByIdAndUpdate(
      id,
      updateReservationDto,
      { new: true },
    );
    if (!updatedReservation) {
      throw new NotFoundException('Reservation not found');
    }
    return updatedReservation;
  }

  async deleteReservation(id: string): Promise<void> {
    const result = await this.reservationModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Reservation not found');
    }
  }
}
