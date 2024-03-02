// // upload-car-image.dto.ts

// import { IsNotEmpty } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';
// // import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// export class UploadCarImageDto {
//   @ApiProperty({ type: 'string', format: 'binary' })
//   @IsNotEmpty()
//   image: any;
// }

// // export const multerOptions: MulterOptions = {
// //     fileFilter: (req, file, callback) => {
// //       if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
// //         return callback(new Error('Only image files are allowed!'), false);
// //       }
// //       callback(null, true);
// //     },
// //   };
