import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  private normalizeUsername(username: string) {
    return username.trim().toLowerCase();
  }

  async loginOrCreate(username: string, password: string) {
    const uname = this.normalizeUsername(username);

    let user = await this.prisma.user.findUnique({
      where: { username: uname },
    });

    if (!user) {
      const passwordHash = await bcrypt.hash(password, 10);
      try {
        user = await this.prisma.user.create({
          data: { username: uname, passwordHash },
        });
      } catch (err) {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code === 'P2002'
        ) {
          user = await this.prisma.user.findUnique({
            where: { username: uname },
          });
        } else {
          throw err;
        }
      }
    } else {
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwt.sign({ sub: user?.id, username: user?.username });
    return { token, user };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
