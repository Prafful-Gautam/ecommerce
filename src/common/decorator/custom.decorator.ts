import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/dto/create-user.dto';

export const Roles = (...roles: UserRole[]) => SetMetadata('role', roles);
