import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './schemas/auth.user.schema';
import { CreateUserDto } from './dto/auth.user.dto';


@Injectable()
export class AuthService {
    constructor( @InjectModel(User.name)
    private UserModel: mongoose.Model<User>){ }

    async register(user: CreateUserDto): Promise<User>{
        const newUser = await this.UserModel.create(user)
        return newUser;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.UserModel.findOne({ email });
        return user;
    }

    
}
