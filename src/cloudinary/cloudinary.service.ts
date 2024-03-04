import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  }

  async uploadOnCloudinary(localFilePath: string): Promise<any> {
    try {
      if (!localFilePath) return null;
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: 'auto',
      });
      fs.unlinkSync(localFilePath);
      return response;
    } catch (error) {
      fs.unlinkSync(localFilePath);
      return null;
    }
  }
}
