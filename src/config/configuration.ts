export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  jwt: {
    secret: process.env.JWT_SECRET ?? 'your_jwt_secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '60s',
  },
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASS ?? '',
    name: process.env.DB_NAME ?? 'ecommerce',
  },
});