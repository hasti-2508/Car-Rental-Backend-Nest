import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Car } from './schemas/car.schemas';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCarDto } from './dto/createCar.dto';
import { UpdateCarDto } from './dto/updateCar.dto';
import { SortDto } from './dto/sort.dto';
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectModel(Car.name)
    private carModel: mongoose.Model<Car>,
  ) {}

  async findCar(filterDto: FilterDto, sortDto: SortDto): Promise<Car[]> {
    let query = this.carModel.find();

    // Filtering
    if (filterDto) {
      if (filterDto.brand) {
        query = query.where('brand').equals(filterDto.brand);
      }
      if (filterDto.model) {
        query = query.where('model').equals(filterDto.model);
      }
      if (filterDto.minCapacity) {
        query = query.where('capacity').gte(filterDto.minCapacity);
      }
      if (filterDto.maxCapacity) {
        query = query.where('capacity').lte(filterDto.maxCapacity);
      }
      if (filterDto.colors && filterDto.colors.length > 0) {
        //  $in operator to match cars with any of the specified colors
        query = query.where('colors').in(filterDto.colors);
      }
    }

    // Sorting
    if (sortDto && sortDto.sortBy) {
      const sortOrder = sortDto.sortOrder === 'desc' ? -1 : 1;
      query = query.sort({ [sortDto.sortBy]: sortOrder });
    }

    return query.exec();
  }

  async findCarWithId(id: string) {
    const car = await this.carModel.findById(id);
    return car;
  }

  async findCarById(id: string): Promise<Car> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new HttpException('Invalid ID', 400);
    }

    const car = await this.carModel.findById(id);
    console.log('Car:', car);
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  async searchCars(query: any): Promise<Car[]> {
    return this.carModel.find(query).exec();
  }

  async createCar(createCarDto: CreateCarDto): Promise<Car> {
    const car = await this.carModel.create(createCarDto);
    car.save();
    return car;
  }

  async addRating(userId: string, carId: string, rating: number): Promise<Car> {
    console.log(userId);
    if (!userId) {
      throw new NotFoundException('User Not Found');
    }

    const isValid = mongoose.Types.ObjectId.isValid(carId);
    if (!isValid) {
      throw new HttpException('Invalid ID', 400);
    }
    const car = await this.carModel.findById(carId);
    console.log(car);

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    const existingRating = car.ratings.find((r) => r.userId === userId);
    if (existingRating) {
      throw new HttpException('User has already rated this car', 400);
    }   
    car.ratings.push({
      rating,
      userId
    });
    const averageRating =
      car.ratings.reduce((acc, curr) => acc + curr.rating, 0) / car.ratings.length;
    car.averageRating = averageRating;
    return car.save();
  }

  async updateCar(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new HttpException('Invalid Id', 400);
    }

    const updateCar = await this.carModel.findByIdAndUpdate(id, updateCarDto, {
      new: true,
    });
    if (!updateCar) {
      throw new NotFoundException('Car not found');
    }
    return updateCar;
  }

  async deleteCar(id: string): Promise<void> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new HttpException('Invalid Id', 400);
    }

    const car = await this.carModel.findByIdAndDelete(id);
    if (!car) {
      throw new NotFoundException('Car not found');
    }
  }
}
