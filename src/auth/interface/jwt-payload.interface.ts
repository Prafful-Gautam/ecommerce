export interface JwtPayload {
  username: string;
  sub: number | string;
  iat?: number;
  exp?: number;
}
