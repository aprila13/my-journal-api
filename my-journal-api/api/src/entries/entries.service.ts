import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';

@Injectable()
export class EntriesService {
  constructor(private prisma: PrismaService) {}

  listForUser(userId: string) {
    return this.prisma.entry.findMany({
      where: { userId },
      orderBy: { timeCreated: 'desc' },
    });
  }

  createForUser(userId: string, dto: CreateEntryDto) {
    return this.prisma.entry.create({
      data: { userId, title: dto.title ?? null, body: dto.body },
    });
  }

  async getOwned(userId: string, id: string) {
    const e = await this.prisma.entry.findUnique({ where: { id } });
    if (!e) throw new NotFoundException();
    if (e.userId !== userId) throw new ForbiddenException();
    return e;
  }

  async updateOwned(userId: string, id: string, dto: UpdateEntryDto) {
    await this.getOwned(userId, id);

    const data: Record<string, any> = {};

    if (dto.body !== undefined) {
      data.body = dto.body;
    }

    // Keep previous title unless explicitly changed to a non-empty string
    if (dto.title !== undefined && dto.title.trim() !== '') {
      data.title = dto.title;
    }
    // If you want to allow explicit clearing:
    // else if (dto.title === null) { data.title = null; }

    return this.prisma.entry.update({ where: { id }, data });
  }

  async deleteOwned(userId: string, id: string) {
    await this.getOwned(userId, id);
    await this.prisma.entry.delete({ where: { id } });
    return { ok: true };
  }
}
