import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateEntryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 200)
  title?: string;

  @ApiProperty()
  @IsString()
  @Length(1, 5000)
  body!: string;
}
