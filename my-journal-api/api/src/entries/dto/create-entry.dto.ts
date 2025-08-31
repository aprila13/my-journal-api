import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateEntryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 200, { message: 'Title must be 1–200 characters if provided' })
  title?: string;

  @ApiProperty()
  @IsString()
  @Length(1, 5000, { message: 'Body must be 1–5000 characters' })
  body!: string;
}
