import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(10)
  @Matches(/^[a-z0-9]+$/, {
    message:
      'Username must contain only lowercase letters and numbers. Min. length of 5 characters. Ex: janedoe1',
  })
  username!: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  @Matches(/^[A-Za-z]{1,7}\d{2}\$$/, {
    message:
      'Password must start with 1–7 letters, followed by 2 digits, and end with `$`. Example: MyPass12$',
  })
  password!: string;
}
