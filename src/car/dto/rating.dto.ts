// rate.dto.ts
import { IsNumber, IsPositive, Min, Max } from 'class-validator';

export class RateDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  rating: number;
}
