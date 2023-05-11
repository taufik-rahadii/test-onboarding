import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorMessageInterface } from './response/response.interface';
import { camelToSnake } from './utils/general-utils';
import { SuccessFormatterInterceptor } from './common/interceptors/success-formatter.interceptor';
import { ErrorFormatterInterceptor } from './common/interceptors/error-formatter.interceptor';

const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Prefix
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const errorMessages: ErrorMessageInterface[] = [];
        for (const keyError in errors) {
          const { property, constraints } = errors[keyError];
          for (const key in constraints) {
            const errorMessageSingle: ErrorMessageInterface = {
              code: `VALIDATION_${camelToSnake(key).toUpperCase()}`,
              field: property,
              message: constraints[key],
            };
            errorMessages.push(errorMessageSingle);
          }
        }

        throw new BadRequestException({
          message: 'Bad Request',
          errors: errorMessages,
        });
      },
    }),
  );
  app.setGlobalPrefix('/api');
  app.useGlobalInterceptors(new SuccessFormatterInterceptor(new Reflector()));
  app.useGlobalInterceptors(new ErrorFormatterInterceptor());

  await app.listen(process.env.HTTP_PORT || 4001, () => {
    logger.log(`Running on ${process.env.HTTP_PORT || 4001}`);
  });
}
bootstrap();
