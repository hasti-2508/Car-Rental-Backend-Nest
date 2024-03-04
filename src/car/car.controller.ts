import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { CarService } from './car.service';
import { Car } from './schemas/car.schemas';
import { CreateCarDto } from './dto/createCar.dto';
import { UpdateCarDto } from './dto/updateCar.dto';
import { FilterDto } from './dto/filter.dto';
import { SortDto } from './dto/sort.dto';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { RolesGuard } from 'src/role/guard/role.guard';
import { RateDto } from './dto/rating.dto';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ObjectId } from 'mongodb';

@Controller('car')
export class CarController {
  constructor(
    private cloudinaryService: CloudinaryService,
    private carservice: CarService,
    private jwtService: JwtService,
  ) {}

  @Get()
  async findCar(
    @Query() filterDto: FilterDto,
    @Query() sortDto: SortDto,
  ): Promise<Car[]> {
    return this.carservice.findCar(filterDto, sortDto);
  }

  @Get('/:id')
  async findCarById(@Param('id') id: string): Promise<Car> {
    return this.carservice.findCarById(id);
  }

  @Get()
  async searchCars(
    @Query('brand') brand?: string,
    @Query('model') model?: string,
    @Query('color') color?: string,
    @Query('capacity') capacity?: number,
  ): Promise<Car[]> {
    const query: any = {};
    if (brand) query.brand = brand;
    if (model) query.model = model;
    if (color) query.colors = color;
    if (capacity) query.capacity = capacity;

    // Perform the search query
    return this.carservice.searchCars(query);
  }

  @Get('/:id')
  async findCarWithId(@Param() id: string) {
    return this.carservice.findCarWithId(id);
  }

  @Post('/')
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN)
  async createCar(@Body() createCarDto: CreateCarDto) {
    return this.carservice.createCar(createCarDto);
  }

  @Post(':id/rate')
  async rateCar(
    @Req() req,
    @Param('id') carId: string,
    @Body() rateDto: RateDto, // DTO containing rating value
  ): Promise<Car> {
    const token = req.cookies?.jwt;
    if (!token) {
      throw new NotFoundException('User should be logged in!');
    }
    const decodedToken = this.jwtService.decode(token) as { userId: string };
    const userId = decodedToken.userId;
    console.log(userId);
    return this.carservice.addRating(userId, carId, rateDto.rating);
  }

  @Put('/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async updateCar(@Body() updateCarDto: UpdateCarDto, @Param('id') id: string) {
    return this.carservice.updateCar(id, updateCarDto);
  }

  @Delete('/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async deleteCar(@Param('id') id: string) {
    return this.carservice.deleteCar(id);
  }

  @Post(':id/uploadImage')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './assets/',
        filename: (req, file, callback) => {
          const fileName =
            path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
          const extension = path.parse(file.originalname).ext;
          callback(null, `${fileName}${extension}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file,
    @Res() res,
    @Param('id') carId: string,
  ) {
    console.log(carId);
    try {
      if (!file || !file.path) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'No file uploaded or file path is missing.',
        });
      }

      const cloudinaryResponse =
        await this.cloudinaryService.uploadOnCloudinary(file.path);
      const car = await this.carservice.findCarWithId(carId);
      car.imageUrl = cloudinaryResponse.url;
      car.save();

      return res.status(HttpStatus.OK).json({
        success: true,
        data: file.path,
        cloudinaryResponse: cloudinaryResponse,
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to upload image',
      });
    }
  }
}
