import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID, IsDateString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { TipoGuia, StatusGuia } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterGuiaDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por empresa',
  })
  @IsOptional()
  @IsUUID()
  empresaId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tipo de guia',
    enum: TipoGuia,
  })
  @IsOptional()
  @IsEnum(TipoGuia)
  tipo?: TipoGuia;

  @ApiPropertyOptional({
    description: 'Filtrar por status',
    enum: StatusGuia,
  })
  @IsOptional()
  @IsEnum(StatusGuia)
  status?: StatusGuia;

  @ApiPropertyOptional({
    description: 'Competência inicial',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  competenciaInicio?: string;

  @ApiPropertyOptional({
    description: 'Competência final',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  competenciaFim?: string;

  @ApiPropertyOptional({
    description: 'Vencimento inicial',
  })
  @IsOptional()
  @IsDateString()
  vencimentoInicio?: string;

  @ApiPropertyOptional({
    description: 'Vencimento final',
  })
  @IsOptional()
  @IsDateString()
  vencimentoFim?: string;

  @ApiPropertyOptional({
    description: 'Apenas guias vencidas',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  apenasVencidas?: boolean;

  @ApiPropertyOptional({
    description: 'Apenas guias pendentes',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  apenasPendentes?: boolean;
}
