import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO, UpdateProductDTO } from './interface/product.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator/custom.decorator';
import { UserRole } from 'src/user/dto/create-user.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('create')
  creatProduct(@Body() create: ProductDTO) {
    const createdProduct = { ...create, price: create.price.toString() };
    return this.productService.addProduct(createdProduct);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('update/:id')
  async updateProduct(
    @Param('id') id: number,
    @Body() update: UpdateProductDTO,
  ) {
    const updatedProduct = { ...update };

    const data = await this.productService.updateProduct(id, updatedProduct);
    if (data.affected) {
      return 'update success';
    } else return 'invalid product id';
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('get')
  async getProducts(
    @Query('limit') limit: number,
    @Query('cursor') cursor: number,
    @Req() req: any,
  ) {
    const { user } = req;
    const data = await this.productService.getAllActiveProducts(user.role, {
      limit,
      cursor,
    });
    return data;
  }
}
