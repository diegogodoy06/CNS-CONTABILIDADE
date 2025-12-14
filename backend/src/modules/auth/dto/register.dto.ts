import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
  Length,
} from 'class-validator';
import { IsCpf } from '../../../common/decorators/validators.decorator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 8 caracteres, com letras e números)',
    example: 'MinhaS3nh@Forte',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @MaxLength(100)
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*\d)/,
    { message: 'Senha deve conter pelo menos uma letra e um número' },
  )
  senha: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
    minLength: 3,
    maxLength: 200,
  })
  @IsString()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(200)
  nome: string;

  @ApiPropertyOptional({
    description: 'CPF do usuário (apenas números)',
    example: '12345678901',
  })
  @IsOptional()
  @IsString()
  @Length(11, 11, { message: 'CPF deve ter 11 dígitos' })
  @IsCpf({ message: 'CPF inválido' })
  cpf?: string;

  @ApiPropertyOptional({
    description: 'Telefone fixo (apenas números)',
    example: '1132451234',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10,11}$/, { message: 'Telefone inválido' })
  telefone?: string;

  @ApiPropertyOptional({
    description: 'Celular (apenas números)',
    example: '11987654321',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10,11}$/, { message: 'Celular inválido' })
  celular?: string;
}
