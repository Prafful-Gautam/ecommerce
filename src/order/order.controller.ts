import { Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, Roles } from 'src/common/decorator/custom.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserRole } from 'src/user/dto/create-user.dto';
import { OrderService } from './order.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('create')
  createOrder(@CurrentUser('id') userId: number) {
    return this.orderService.createOrder(userId);
  }
}
