import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let statusCode: number = 500;
    let message: string = 'Internal server error';
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const { message: msgError } = exception.getResponse() as any;
      message = statusCode === 500 ? 'Internal server error' : msgError;
    }
    console.log(exception.stack);
    const responseBody = {
      statusCode,
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
