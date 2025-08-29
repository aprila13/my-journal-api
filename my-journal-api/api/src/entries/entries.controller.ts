import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { EntriesService } from './entries.service';

@ApiTags('Entries')
@ApiCookieAuth('Authorization')
@UseGuards(JwtAuthGuard)
@Controller('entries')
export class EntriesController {
  constructor(private entries: EntriesService) {}

 @Get()
  list(@Req() req: Request) {
    return this.entries.listForUser((req as any).user.userId);
  }

  @Post()
  create(@Body() dto: CreateEntryDto, @Req() req: Request) {
    return this.entries.createForUser((req as any).user.userId, dto);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: Request) {
    return this.entries.getOwned((req as any).user.userId, id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEntryDto, @Req() req: Request) {
    return this.entries.updateOwned((req as any).user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.entries.deleteOwned((req as any).user.userId, id);
  }
}
