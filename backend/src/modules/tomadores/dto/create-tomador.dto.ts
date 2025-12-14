import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  Length,
  IsUUID,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoPessoa } from '@prisma/client';
import { IsCpfOrCnpj } from '../../../common/decorators/validators.decorator';

export class CreateTomadorDto {
  @ApiProperty({
    description: 'ID da empresa',
  })
  @IsUUID()
  empresaId: string;

  @ApiProperty({
    description: 'Tipo de pessoa',
    enum: TipoPessoa,
    example: TipoPessoa.JURIDICA,
  })
  @IsEnum(TipoPessoa)
  tipoPessoa: TipoPessoa;

  @ApiProperty({
    description: 'CPF (11 dígitos) ou CNPJ (14 dígitos)',
    example: '12345678000199',
  })
  @IsString()
  @Length(11, 14)
  @IsCpfOrCnpj()
  cpfCnpj: string;

  @ApiProperty({
    description: 'Razão social ou nome completo',
    example: 'Empresa Cliente LTDA',
  })
  @IsString()
  @Length(3, 200)
  razaoSocial: string;

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
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  inscricaoEstadual?: string;

  @ApiPropertyOptional({
    description: 'Inscrição municipal',
    example: '12345',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  inscricaoMunicipal?: string;

  @ApiPropertyOptional({
    description: 'E-mail do tomador',
    example: 'contato@cliente.com.br',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Telefone',
    example: '1133334444',
  })
  @IsOptional()
  @IsString()
  @Length(10, 20)
  telefone?: string;

  @ApiPropertyOptional({
    description: 'Logradouro',
    example: 'Rua das Flores',
  })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  logradouro?: string;

  @ApiPropertyOptional({
    description: 'Número',
    example: '123',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  numero?: string;

  @ApiPropertyOptional({
    description: 'Complemento',
    example: 'Sala 101',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  complemento?: string;

  @ApiPropertyOptional({
    description: 'Bairro',
    example: 'Centro',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  bairro?: string;

  @ApiPropertyOptional({
    description: 'CEP (apenas números)',
    example: '01234567',
  })
  @IsOptional()
  @IsString()
  @Length(8, 8)
  cep?: string;

  @ApiPropertyOptional({
    description: 'ID do estado',
    example: 35,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  estadoId?: number;

  @ApiPropertyOptional({
    description: 'Código IBGE do município',
    example: 3550308,
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
}
