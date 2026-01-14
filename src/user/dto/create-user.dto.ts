export class CreateUserDto {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  role?: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}
