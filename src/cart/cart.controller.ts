import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, Roles } from 'src/common/decorator/custom.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { CartDTO, RemoveCartDTO } from './dto/cart.dto';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserRole } from 'src/user/dto/create-user.dto';

@Controller('cart')
@UseGuards(RolesGuard)
@Roles(UserRole.CUSTOMER)
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add')
  async addToCart(
    @Body() cartData: CartDTO,
    @CurrentUser('id') userId: number,
  ) {
    const { productId, quantity } = cartData;
    return this.cartService.addToCart(userId, productId, quantity);
  }

  @Get('get')
  getCartItems(@CurrentUser('id') userId: number) {
    // return this.cartService.getCart(userId);
  }

  @Post('remove-item')
  removeCartItems(
    @Body() { productId, removeQty }: RemoveCartDTO,
    @CurrentUser('id') userId: number,
  ) {
    return this.cartService.removeFromCart(userId, { productId, removeQty });
  }

  @Post('clear-cart')
  clearCart(@CurrentUser('id') userId: number) {
    return this.cartService.clearCart(userId);
  }
}
