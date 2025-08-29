import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @Matches(/^[a-z0-9]{1,10}$/) 
  username!: string;

  @ApiProperty()
  @IsString()
  @Matches(/^[A-Za-z]{1,7}\d{2}\$$/)
  password!: string;
}
