import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from './dto/create-user.dto';
import { CartItem } from 'src/cart/cart-item.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];

  @CreateDateColumn()
  createdAt: Date;
}
