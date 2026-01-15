import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CartItem } from 'src/cart/cart-item.entity';
import { User } from 'src/user/user.entity';
import { DataSource } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from 'src/product/product.entity';

@Injectable()
export class OrderService {
  constructor(private readonly dataSource: DataSource) {}

  async createOrder(userId: number) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
      });
      if (!user) throw new ForbiddenException('User not found');

      const cartItems = await manager.find(CartItem, {
        where: { user: { id: userId } },
        relations: ['product'],
      });

      if (cartItems.length == 0) throw new BadRequestException('Cart is empty');

      let totalAmount = 0;
      const order = manager.create(Order, {
        user,
        totalAmount: 0,
      });
      await manager.save(order);

      const orderItems: OrderItem[] = [];

      for (const ci of cartItems) {
        const product = await manager.findOne(Product, {
          where: { id: ci.product.id },
        });
        if (!product) {
          throw new BadRequestException('product not found');
        }

        product.inStock -= ci.quantity;
        product.holdUnit -= ci.quantity;

        if (product.inStock < 0 || product.holdUnit < 0) {
          throw new InternalServerErrorException('Stock mismatch');
        }

        await manager.save(product);

        const itemTotal = ci.quantity * Number(product.price);

        totalAmount += itemTotal;

        const orderItem = manager.create(OrderItem, {
          order,
          product,
          ci,
          quantity: ci.quantity,
          priceAtPurchase: Number(product.price),
        });

        orderItems.push(orderItem);
      }

      await manager.save(orderItems);
      order.totalAmount = totalAmount;
      order.items = orderItems;
      await manager.save(order);

      await manager.remove(cartItems);
      return order;
    });
  }
}
