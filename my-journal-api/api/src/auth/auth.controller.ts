import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token, user } = await this.auth.loginOrCreate(dto.username, dto.password);
    res.cookie('Authorization', `Bearer ${token}`, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { ok: true, user: { id: user?.id, username: user?.username, createdAt: user?.createdAt } };
  }

  @ApiCookieAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Res({ passthrough: true }) _res: Response, @Req() req: Request) {
    return this.auth.me((req as any).user.userId);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('Authorization');
    return { ok: true };
  }
}
