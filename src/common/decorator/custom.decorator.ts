import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { UserRole } from 'src/user/dto/create-user.dto';

export const Roles = (...roles: UserRole[]) => SetMetadata('role', roles);

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // added by Passport JWT
    return data ? user?.[data] : user; // e.g., @User('id') returns user.id
  },
);
