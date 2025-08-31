import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const response = exception.getResponse();
    const payload = typeof response === 'string' ? { message: response } : response;

    res.status(status).json({
      statusCode: status,
      message: payload['message'] ?? payload,
      error: payload['error'] ?? undefined,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
