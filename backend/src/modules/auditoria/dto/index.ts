import { IsOptional, IsString, IsDateString, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FiltroAuditoriaDto {
  @ApiPropertyOptional({ description: 'ID do usuário' })
  @IsOptional()
  @IsString()
  usuarioId?: string;

  @ApiPropertyOptional({ description: 'Tipo de ação (ex: LOGIN, CREATE, UPDATE, DELETE)' })
  @IsOptional()
  @IsString()
  acao?: string;

  @ApiPropertyOptional({ description: 'Entidade afetada' })
  @IsOptional()
  @IsString()
  entidade?: string;

  @ApiPropertyOptional({ description: 'ID do registro afetado' })
  @IsOptional()
  @IsString()
  entidadeId?: string;

  @ApiPropertyOptional({ description: 'ID da empresa' })
  @IsOptional()
  @IsString()
  empresaId?: string;

  @ApiPropertyOptional({ description: 'Data início' })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiPropertyOptional({ description: 'Data fim' })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiPropertyOptional({ description: 'Página atual', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number = 1;

  @ApiPropertyOptional({ description: 'Itens por página', default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limite?: number = 50;
}

export class RegistrarLogDto {
  @IsString()
  acao: string;

  @IsOptional()
  @IsString()
  entidade?: string;

  @IsOptional()
  @IsString()
  entidadeId?: string;

  @IsOptional()
  detalhes?: any;
}
