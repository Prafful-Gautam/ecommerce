import { Optional } from '@nestjs/common';
import { IsEnum, IsNumber, IsOptional, IsString, Max } from 'class-validator';

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
export enum ProductType {
  ELECTRONICS = 'electronics',
  PHONE = 'phone',
}
export interface ProductI {
  name: string;
  description: string;
  type: ProductType;
  price: string;
  inStock: number;
  holdUnit?: number;
  active?: Status;
}

export class ProductDTO {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsEnum(ProductType)
  type!: ProductType;

  @IsNumber()
  @Max(999.99)
  price!: number;

  @IsNumber()
  inStock!: number;

  @IsEnum(Status)
  @IsOptional()
  active?: Status;
}

export class UpdateProductDTO {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @IsOptional()
  @IsNumber()
  @Max(999.99)
  price!: string;

  @Optional()
  @IsNumber()
  inStock!: number;

  @IsOptional()
  @IsEnum(Status)
  @IsOptional()
  active?: Status;
}
