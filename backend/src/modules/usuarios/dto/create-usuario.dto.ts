import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  Length,
  Matches,
  IsUUID,
  MinLength,
} from 'class-validator';
import { TipoUsuario, StatusUsuario } from '@prisma/client';
import { IsCpf } from '../../../common/decorators/validators.decorator';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
  })
  @IsString()
  @Length(3, 200)
  nome: string;

  @ApiProperty({
    description: 'E-mail do usuário (será usado para login)',
    example: 'joao@exemplo.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 8 caracteres)',
    example: 'Senha@123',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Senha deve conter maiúscula, minúscula, número e caractere especial',
  })
  senha: string;

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

  @ApiProperty({
    description: 'Tipo do usuário',
    enum: TipoUsuario,
    example: TipoUsuario.CLIENTE,
  })
  @IsEnum(TipoUsuario)
  tipo: TipoUsuario;

  @ApiPropertyOptional({
    description: 'Status do usuário',
    enum: StatusUsuario,
    default: StatusUsuario.PENDENTE,
  })
  @IsOptional()
  @IsEnum(StatusUsuario)
  status?: StatusUsuario;

  @ApiPropertyOptional({
    description: 'ID do escritório (para colaboradores)',
  })
  @IsOptional()
  @IsUUID()
  escritorioId?: string;

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
