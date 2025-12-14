import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNumber,
  IsInt,
  Length,
  Matches,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RegimeTributario } from '@prisma/client';
import { IsCnpj } from '../../../common/decorators/validators.decorator';

export class CreateEmpresaDto {
  @ApiPropertyOptional({
    description: 'ID do escritório (obrigatório para admins)',
  })
  @IsOptional()
  @IsUUID()
  escritorioId?: string;

  @ApiProperty({
    description: 'Razão social da empresa',
    example: 'Empresa Exemplo LTDA',
  })
  @IsString()
  @Length(3, 200)
  razaoSocial: string;

  @ApiPropertyOptional({
    description: 'Nome fantasia',
    example: 'Exemplo',
  })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  nomeFantasia?: string;

  @ApiProperty({
    description: 'CNPJ (apenas números)',
    example: '12345678000199',
  })
  @IsString()
  @Length(14, 14)
  @IsCnpj()
  cnpj: string;

  @ApiPropertyOptional({
    description: 'Inscrição Estadual',
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  inscricaoEstadual?: string;

  @ApiPropertyOptional({
    description: 'Inscrição Municipal',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  inscricaoMunicipal?: string;

  @ApiProperty({
    description: 'Regime tributário',
    enum: RegimeTributario,
    example: RegimeTributario.SIMPLES_NACIONAL,
  })
  @IsEnum(RegimeTributario)
  regimeTributario: RegimeTributario;

  @ApiPropertyOptional({
    description: 'Ramo de atividade',
    example: 'Tecnologia da Informação',
  })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  ramoAtividade?: string;

  @ApiPropertyOptional({
    description: 'CNAE Principal',
    example: '6201501',
  })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  cnaePrincipal?: string;

  @ApiPropertyOptional({
    description: 'Data de abertura (YYYY-MM-DD)',
    example: '2020-01-15',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dataAbertura?: string;

  @ApiProperty({
    description: 'Email de contato',
    example: 'contato@empresa.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Telefone fixo (apenas números)',
    example: '1132451234',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10,11}$/)
  telefone?: string;

  @ApiPropertyOptional({
    description: 'Celular (apenas números)',
    example: '11987654321',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10,11}$/)
  celular?: string;

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
    example: '01310100',
  })
  @IsOptional()
  @IsString()
  @Length(8, 8)
  @Matches(/^\d{8}$/)
  cep?: string;

  @ApiPropertyOptional({
    description: 'ID do estado (IBGE)',
    example: 35,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  estadoId?: number;

  @ApiPropertyOptional({
    description: 'Código do município (IBGE)',
    example: 3550308,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  municipioCodigo?: number;

  @ApiPropertyOptional({
    description: 'Código do município de prestação de serviço (IBGE)',
    example: 3550308,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  municipioPrestacaoCodigo?: number;

  @ApiPropertyOptional({
    description: 'Código do serviço (LC 116)',
    example: '1.01',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  codigoServico?: string;

  @ApiPropertyOptional({
    description: 'Alíquota de ISS (%)',
    example: 5.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  aliquotaIss?: number;
}
