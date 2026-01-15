import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.cartItems, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, (product) => product.cartItems, { eager: true })
  product: Product;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
