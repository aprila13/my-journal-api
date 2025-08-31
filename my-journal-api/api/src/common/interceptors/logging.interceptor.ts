import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest();
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - start;
          console.log(`${req.method} ${req.url} -> ${ms}ms`);
        },
        error: (err) => {
          const ms = Date.now() - start;
          console.error(`${req.method} ${req.url} - ERROR -> ${ms}ms`, err?.message);
        },
      }),
    );
  }
}
