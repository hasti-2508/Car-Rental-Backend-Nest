import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString({ each: true })
  colors?: string[];

  @IsOptional()
  @IsNumber()
  minCapacity?: number;

  @IsOptional()
  @IsNumber()
  maxCapacity?: number;
}
