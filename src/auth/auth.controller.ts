import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/auth.user.schema';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/auth.user.dto';
import { AuthGuard } from './guards/authetication.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/register')
  async register(
    @Body() body: CreateUserDto,
  ): Promise<User> {
    const { name, email, password } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      password: hashedPassword,
      role: 'user',
    };

    const newUser = await this.authService.register(user);
    return newUser;
  }

  @Post('/login')
  async login(
    @Body() body: User,
    @Res({ passthrough: true }) response: Response,
  ): Promise<object> {
    const { email, password } = body;

    const user = await this.authService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('USER NOT FOUND');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('PASSWORD INCORRECT');
    }
    const payload = {
      email: user.email,
      role: user.role,
      userId: user._id,
    };
    const jwt = await this.jwtService.signAsync(payload);
    response.cookie('jwt', jwt, { httpOnly: true });
    return { token: jwt };
  }

  @UseGuards(AuthGuard)
  @Get('/currentUser')
  async currentUser(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException('No Data found');
      }
      const user = await this.authService.findByEmail(data.email);
      // console.log(user)
      //  // Convert Mongoose document to plain JavaScript object
      // //  const userData = user.toJSON();
      //  // Exclude password field
      //  delete user.password;
      return user;
    } catch (error) {
      throw new UnauthorizedException('No user found');
    }
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { message: 'Logged out' };
  }
}
