import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = 400;
    let message: string | string[] = 'Database error';

    switch (exception.code) {
      case 'P2002': 
        status = 409;
        message = 'Resource already exists';
        break;
      case 'P2025': 
        status = 404;
        message = 'Resource not found';
        break;
      default:
        status = 400;
        message = exception.message;
        break;
    }

    res.status(status).json({
      statusCode: status,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
      code: exception.code,
    });
  }
}
