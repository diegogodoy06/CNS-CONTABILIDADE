import { IsOptional, IsString, IsDateString, IsInt, Min, IsEnum } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum TipoRelatorio {
  FATURAMENTO = 'FATURAMENTO',
  IMPOSTOS = 'IMPOSTOS',
  NOTAS_EMITIDAS = 'NOTAS_EMITIDAS',
  GUIAS_GERADAS = 'GUIAS_GERADAS',
  OBRIGACOES = 'OBRIGACOES',
  DOCUMENTOS = 'DOCUMENTOS',
  TICKETS = 'TICKETS',
}

export class FiltroRelatorioDto {
  @ApiPropertyOptional({ description: 'ID da empresa' })
  @IsOptional()
  @IsString()
  empresaId?: string;

  @ApiProperty({ description: 'Data início do período' })
  @IsDateString()
  dataInicio: string;

  @ApiProperty({ description: 'Data fim do período' })
  @IsDateString()
  dataFim: string;

  @ApiPropertyOptional({ description: 'Agrupar por (mes, trimestre, ano)' })
  @IsOptional()
  @IsString()
  agruparPor?: 'mes' | 'trimestre' | 'ano';
}

export class GerarRelatorioDto {
  @ApiProperty({ enum: TipoRelatorio, description: 'Tipo do relatório' })
  @IsEnum(TipoRelatorio)
  tipo: TipoRelatorio;

  @ApiProperty({ description: 'Data início do período' })
  @IsDateString()
  dataInicio: string;

  @ApiProperty({ description: 'Data fim do período' })
  @IsDateString()
  dataFim: string;

  @ApiPropertyOptional({ description: 'ID da empresa (opcional para admin)' })
  @IsOptional()
  @IsString()
  empresaId?: string;

  @ApiPropertyOptional({ description: 'Formato de exportação' })
  @IsOptional()
  @IsString()
  formato?: 'json' | 'csv' | 'pdf';
}
