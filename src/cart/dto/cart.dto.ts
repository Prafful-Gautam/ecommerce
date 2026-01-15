import { IsNumber } from 'class-validator';

export interface CartI {
  productId: number;
  quantity: number;
}

export class CartDTO {
  @IsNumber()
  productId!: number;

  @IsNumber()
  quantity!: number;
}

export class RemoveCartDTO {
  @IsNumber()
  productId!: number;

  @IsNumber()
  removeQty!: number;
}
