import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Length,
  Matches,
  IsEmail,
  IsUUID,
  IsInt,
  IsNumber,
} from 'class-validator';

/**
 * Validador de CNPJ
 */
export class CnpjDto {
  @ApiProperty({
    description: 'CNPJ (apenas números)',
    example: '12345678000199',
  })
  @IsString()
  @Length(14, 14, { message: 'CNPJ deve ter exatamente 14 dígitos' })
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter apenas números' })
  cnpj: string;
}

/**
 * Validador de CPF
 */
export class CpfDto {
  @ApiProperty({
    description: 'CPF (apenas números)',
    example: '12345678901',
  })
  @IsString()
  @Length(11, 11, { message: 'CPF deve ter exatamente 11 dígitos' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter apenas números' })
  cpf: string;
}

/**
 * Validador de Email
 */
export class EmailDto {
  @ApiProperty({
    description: 'Endereço de email',
    example: 'usuario@exemplo.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;
}

/**
 * DTO de endereço completo
 */
export class EnderecoDto {
  @ApiPropertyOptional({
    description: 'Logradouro (rua, avenida, etc)',
    example: 'Rua das Flores',
  })
  @IsString()
  @IsOptional()
  @Length(1, 200)
  logradouro?: string;

  @ApiPropertyOptional({
    description: 'Número',
    example: '123',
  })
  @IsString()
  @IsOptional()
  @Length(1, 20)
  numero?: string;

  @ApiPropertyOptional({
    description: 'Complemento',
    example: 'Sala 101',
  })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  complemento?: string;

  @ApiPropertyOptional({
    description: 'Bairro',
    example: 'Centro',
  })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  bairro?: string;

  @ApiPropertyOptional({
    description: 'CEP (apenas números)',
    example: '01310100',
  })
  @IsString()
  @IsOptional()
  @Length(8, 8, { message: 'CEP deve ter exatamente 8 dígitos' })
  @Matches(/^\d{8}$/, { message: 'CEP deve conter apenas números' })
  cep?: string;

  @ApiPropertyOptional({
    description: 'ID do estado (IBGE)',
    example: 35,
  })
  @IsInt()
  @IsOptional()
  estadoId?: number;

  @ApiPropertyOptional({
    description: 'Código do município (IBGE)',
    example: 3550308,
  })
  @IsInt()
  @IsOptional()
  municipioCodigo?: number;
}

/**
 * DTO de contato
 */
export class ContatoDto {
  @ApiProperty({
    description: 'Email de contato',
    example: 'contato@empresa.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiPropertyOptional({
    description: 'Telefone fixo',
    example: '1132451234',
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{10,11}$/, { message: 'Telefone deve ter 10 ou 11 dígitos' })
  telefone?: string;

  @ApiPropertyOptional({
    description: 'Celular',
    example: '11987654321',
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{10,11}$/, { message: 'Celular deve ter 10 ou 11 dígitos' })
  celular?: string;
}

/**
 * DTO para filtro por período
 */
export class PeriodoDto {
  @ApiPropertyOptional({
    description: 'Data inicial (ISO 8601)',
    example: '2024-01-01',
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  })
  dataInicio?: string;

  @ApiPropertyOptional({
    description: 'Data final (ISO 8601)',
    example: '2024-12-31',
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  })
  dataFim?: string;
}

/**
 * DTO para valores monetários
 */
export class ValorMonetarioDto {
  @ApiProperty({
    description: 'Valor em reais',
    example: 1500.50,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Valor deve ter no máximo 2 casas decimais' },
  )
  valor: number;
}

/**
 * DTO genérico para ID UUID
 */
export class UuidParamDto {
  @ApiProperty({
    description: 'ID único (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'ID deve ser um UUID válido' })
  id: string;
}
