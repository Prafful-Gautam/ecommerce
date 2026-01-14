import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interface/jwt-payload.interface';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    // omit password before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user as any;
    return result;
  }

  async validateUserById(id: number) {
    const user = await this.userService.findById(id);
    if (!user) throw new UnauthorizedException();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user as any;
    return result;
  }

  async login(user: any) {
    const payload: JwtPayload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(id: number) {
    const user = await this.userService.findById(id);
    if (!user) throw new UnauthorizedException();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user as any;
    return result;
  }

  async register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
