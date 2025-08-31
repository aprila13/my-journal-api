import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const raw = req.cookies?.Authorization || req.headers['authorization'];
    if (!raw) throw new UnauthorizedException('No auth token');

    const token = String(raw).replace(/^Bearer\s+/i, '');
    try {
      const payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET! });
      req.user = { userId: payload.sub, username: payload.username };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
