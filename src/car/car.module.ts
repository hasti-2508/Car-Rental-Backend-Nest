import { Module } from '@nestjs/common';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CarSchema } from './schemas/car.schemas';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports:[
    MongooseModule.forFeature([{name: 'Car', schema: CarSchema}])],                                                    
  controllers: [CarController],
  providers: [CarService, CloudinaryService]
})
export class CarModule {}
