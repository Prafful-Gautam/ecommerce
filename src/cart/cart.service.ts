import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { DataSource, Repository } from 'typeorm';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Status } from 'src/product/interface/product.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
  ) {}

  async addToCart(userId: number, productId: number, quantity: number) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      const product = await manager.findOne(Product, {
        where: { id: productId },
        lock: { mode: 'pessimistic_write' }, // prevents race conditions
      });
      console.log(product);
      if (!user || !product) {
        throw new BadRequestException('User or Product not found');
      }

      let cartItem = await manager.findOne(CartItem, {
        where: {
          user: { id: userId },
          product: { id: productId },
        },
      });

      const existingQty = cartItem ? cartItem.quantity : 0;
      const diffQty = quantity - existingQty;

      if (diffQty > 0) {
        if (product.inStock - product.holdUnit < diffQty) {
          throw new ForbiddenException('Not enough stock');
        }
      }

      if (!cartItem && quantity > 0) {
        cartItem = manager.create(CartItem, {
          user,
          product,
          quantity,
        });
        await manager.save(cartItem);
      }

      if (cartItem && quantity > 0) {
        cartItem.quantity = quantity;
        await manager.save(cartItem);
      }

      if (cartItem && quantity === 0) {
        await manager.remove(cartItem);
      }

      product.holdUnit += diffQty;
      await manager.save(product);

      return {
        productId,
        quantity,
      };
    });
  }

  async getCart(userId: number) {
    return this.cartItemRepo.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  async removeFromCart(
    userId: number,
    { productId, removeQty }: { productId: number; removeQty: number },
  ) {
    return await this.dataSource.transaction(async (manager) => {
      const cartItem = await manager.findOne(CartItem, {
        where: {
          user: { id: userId },
          product: { id: productId },
        },
        relations: ['product'],
      });

      if (!cartItem) {
        throw new BadRequestException('CART_ITEM_NOT_FOUND');
      }

      if (removeQty <= 0) {
        throw new BadRequestException('INVALID_REMOVE_QUANTITY');
      }

      if (removeQty > cartItem.quantity) {
        throw new BadRequestException('REMOVE_QTY_EXCEEDS_CART_QTY');
      }

      const product = cartItem.product;

      cartItem.quantity -= removeQty;
      product.holdUnit -= removeQty;

      if (cartItem.quantity === 0) {
        await manager.remove(cartItem);
      } else {
        await manager.save(cartItem);
      }

      await manager.save(product);

      return {
        productId,
        removed: removeQty,
        remainingQuantity: cartItem.quantity,
      };
    });
  }

  async clearCart(userId: number) {
    return this.cartItemRepo.delete({ user: { id: userId } });
  }
}
