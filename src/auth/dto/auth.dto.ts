import { IsString, IsEmail } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName?: string;

  @IsString()
  password!: string;
}
