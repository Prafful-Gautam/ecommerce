import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationPipe } from './common/validation/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // Register global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(helmet());
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
