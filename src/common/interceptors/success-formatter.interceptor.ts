import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class SuccessFormatterInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  private response: Response;

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    this.response = context.switchToHttp().getResponse();

    const responseSchema = this.buildResponseSchema(
      this.reflector.get<string>('RESPONSE_MESSAGE', context.getHandler()),
    );

    return next.handle().pipe(
      map((data) => ({
        response_schema: responseSchema,
        response_output: this.parseResponseOutput(data),
      })),
    );
  }

  private parseStatusCode() {
    const projectName = process.env.PROJECT_NAME;
    const projectCode = process.env.SERVICE_NAME;

    return `${projectName}-${projectCode}-${this.response.statusCode}`;
  }

  private buildResponseSchema(response_message: string) {
    const response_code = this.parseStatusCode();

    return {
      response_code,
      response_message,
    };
  }

  private parseResponseOutput(data: any) {
    if ('pagination' in data && data?.pagination !== null) {
      return { list: data };
    } else {
      return { detail: data };
    }
  }
}
