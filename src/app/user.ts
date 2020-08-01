export interface User{
  email: string;
  name: string;
  password: string;
  confirmPassword?: string;
  roles?: any[];
  token?: string;
  expiresIn?: number;
  user?: any;
}
