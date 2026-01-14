import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email, password, role } = createUserDto;
    const userExist = await this.findOne(email);
    if (userExist) {
      throw new BadRequestException('Email already exist');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hash,
      role: role ?? undefined,
    });
    return this.userRepository.save(user);
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Invalid email');
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) throw new UnauthorizedException('Invalid password');
    return user;
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const adminPresent = await this.userRepository.findOne({
      where: { role: UserRole.ADMIN },
    });
    if (adminPresent) throw new UnauthorizedException('admin already exist');

    createUserDto.role = UserRole.ADMIN;
    this.create(createUserDto);
  }
}
