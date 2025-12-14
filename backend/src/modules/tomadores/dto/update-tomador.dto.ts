import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  Length,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoPessoa } from '@prisma/client';
import { IsCpfOrCnpj } from '../../../common/decorators/validators.decorator';

export class UpdateTomadorDto {
  @ApiPropertyOptional({
    description: 'Tipo de pessoa',
    enum: TipoPessoa,
  })
  @IsOptional()
  @IsEnum(TipoPessoa)
  tipoPessoa?: TipoPessoa;

  @ApiPropertyOptional({
    description: 'CPF (11 dígitos) ou CNPJ (14 dígitos)',
    example: '12345678000199',
  })
  @IsOptional()
  @IsString()
  @Length(11, 14)
  @IsCpfOrCnpj()
  cpfCnpj?: string;

  @ApiPropertyOptional({
    description: 'Razão social ou nome completo',
    example: 'Empresa Cliente LTDA',
  })
  @IsOptional()
  @IsString()
  @Length(3, 200)
  razaoSocial?: string;

  @ApiPropertyOptional({
    description: 'Nome fantasia',
    example: 'Cliente',
  })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  nomeFantasia?: string;

  @ApiPropertyOptional({
    description: 'Inscrição estadual',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  inscricaoEstadual?: string;

  @ApiPropertyOptional({
    description: 'Inscrição municipal',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  inscricaoMunicipal?: string;

  @ApiPropertyOptional({
    description: 'E-mail do tomador',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Telefone',
  })
  @IsOptional()
  @IsString()
  @Length(10, 20)
  telefone?: string;

  @ApiPropertyOptional({
    description: 'Logradouro',
  })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  logradouro?: string;

  @ApiPropertyOptional({
    description: 'Número',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  numero?: string;

  @ApiPropertyOptional({
    description: 'Complemento',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  complemento?: string;

  @ApiPropertyOptional({
    description: 'Bairro',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  bairro?: string;

  @ApiPropertyOptional({
    description: 'CEP (apenas números)',
  })
  @IsOptional()
  @IsString()
  @Length(8, 8)
  cep?: string;

  @ApiPropertyOptional({
    description: 'ID do estado',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  estadoId?: number;

  @ApiPropertyOptional({
    description: 'Código IBGE do município',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  municipioCodigo?: number;

  @ApiPropertyOptional({
    description: 'Observações',
  })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiPropertyOptional({
    description: 'Tomador ativo',
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
