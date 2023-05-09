import {
  BadRequestException,
  HttpStatus,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorMessageInterface } from './response/response.interface';
import { camelToSnake } from './utils/general-utils';

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

        return new BadRequestException({
          response_schema: {
            response_code: `${process.env.PROJECT_NAME}-${
              process.env.SERVICE_NAME
            }-${HttpStatus.BAD_REQUEST.toString()}`,
            response_message: 'Bad Request',
          },
          response_output: {
            errors: errorMessages,
          },
        });
      },
    }),
  );

  await app.listen(process.env.HTTP_PORT || 4001, () => {
    logger.log(`Running on ${process.env.HTTP_PORT || 4001}`);
  });
}
bootstrap();
