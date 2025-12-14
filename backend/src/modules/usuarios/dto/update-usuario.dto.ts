import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { StatusUsuario } from '@prisma/client';
import { IsCpf } from '../../../common/decorators/validators.decorator';

export class UpdateUsuarioDto {
  @ApiPropertyOptional({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
  })
  @IsOptional()
  @IsString()
  @Length(3, 200)
  nome?: string;

  @ApiPropertyOptional({
    description: 'E-mail do usuário',
    example: 'joao@exemplo.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Nova senha do usuário',
    example: 'NovaSenha@123',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Senha deve conter maiúscula, minúscula, número e caractere especial',
  })
  senha?: string;

  @ApiPropertyOptional({
    description: 'CPF do usuário (apenas números)',
    example: '12345678901',
  })
  @IsOptional()
  @IsString()
  @Length(11, 11)
  @IsCpf()
  cpf?: string;

  @ApiPropertyOptional({
    description: 'Telefone fixo',
    example: '1133334444',
  })
  @IsOptional()
  @IsString()
  @Length(10, 20)
  telefone?: string;

  @ApiPropertyOptional({
    description: 'Celular',
    example: '11999998888',
  })
  @IsOptional()
  @IsString()
  @Length(11, 20)
  celular?: string;

  @ApiPropertyOptional({
    description: 'URL do avatar',
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Status do usuário',
    enum: StatusUsuario,
  })
  @IsOptional()
  @IsEnum(StatusUsuario)
  status?: StatusUsuario;

  @ApiPropertyOptional({
    description: 'Cargo do colaborador',
    example: 'Contador',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  cargo?: string;

  @ApiPropertyOptional({
    description: 'Departamento do colaborador',
    example: 'Contabilidade',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  departamento?: string;
}
