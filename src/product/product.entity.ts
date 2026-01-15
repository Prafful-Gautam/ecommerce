import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Status } from './interface/product.dto';
import { CartItem } from 'src/cart/cart-item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  price: string;

  @Column()
  inStock: number;

  @Column({ default: 0 })
  holdUnit: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  active: Status;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
