import { IsOptional, IsString, IsIn } from "class-validator";

export class SortDto {
  @IsOptional()
  @IsString()
  @IsIn(["brand", "model", "capacity", "rating", "rentPrice"])
  sortBy?: string;

  @IsOptional()
  @IsString()
  @IsIn(["asc", "desc"])
  sortOrder?: string;
}
