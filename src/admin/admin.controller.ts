import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('register')
  async register(@Body() createDto: AuthDto) {
    return this.adminService.register(createDto);
  }
}
