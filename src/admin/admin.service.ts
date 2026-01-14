import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(private userService: UserService) {}

  async register(createUserDto: CreateUserDto) {
    return this.userService.createAdmin(createUserDto);
  }
}
