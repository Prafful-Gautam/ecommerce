import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO } from './interface/product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('create')
  creatProduct(@Body() create: ProductDTO) {
    const createdProduct = { ...create, price: create.price.toString() };
    return this.productService.addProduct(createdProduct);
  }

  @Get('get')
  getProducts(@Query('limit') limit: number, @Query('cursor') cursor: number) {
    return this.productService.getAllActiveProducts({});
  }
}
