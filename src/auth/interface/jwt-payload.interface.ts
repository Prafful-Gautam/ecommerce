import { UserRole } from 'src/user/dto/create-user.dto';

export interface JwtPayload {
  email: string;
  role: UserRole;
  id: number;
}
