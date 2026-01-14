import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    // req.user is populated by LocalStrategy
    console.log(req.user);
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createDto: AuthDto) {
    return this.authService.register(createDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}
