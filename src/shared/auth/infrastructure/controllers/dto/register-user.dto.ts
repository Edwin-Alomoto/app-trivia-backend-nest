import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan ',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({
    description: ' Apellido del usuario',
    example: 'Pérez',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiPropertyOptional({
    description: 'Dirección del usuario',
    example: 'Calle 123',
    minLength: 1,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'juanperez',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
    format: 'email',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'Contraseña del usuario (debe ser fuerte: al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos)',
    example: 'MiContraseña123!',
    minLength: 8,
  })
  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    description: 'Teléfono del usuario',
    example: '12345678',
    minLength: 8,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento del usuario',
    example: '1990-01-01',
    type: String,
  })
  @IsOptional()
  @IsString()
  birth_date?: string;

  @ApiPropertyOptional({
    description: 'Género del usuario',
    example: 'Masculino',
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({
    description: 'Estado del usuario',
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsString()
  status: string = 'ACTIVE';
}
