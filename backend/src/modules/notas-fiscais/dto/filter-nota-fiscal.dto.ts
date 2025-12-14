import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID, IsString, IsDateString } from 'class-validator';
import { StatusNota } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterNotaFiscalDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por empresa',
  })
  @IsOptional()
  @IsUUID()
  empresaId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tomador',
  })
  @IsOptional()
  @IsUUID()
  tomadorId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por status',
    enum: StatusNota,
  })
  @IsOptional()
  @IsEnum(StatusNota)
  status?: StatusNota;

  @ApiPropertyOptional({
    description: 'Competência inicial (formato ISO)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  competenciaInicio?: string;

  @ApiPropertyOptional({
    description: 'Competência final (formato ISO)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  competenciaFim?: string;

  @ApiPropertyOptional({
    description: 'Data emissão inicial',
  })
  @IsOptional()
  @IsDateString()
  dataEmissaoInicio?: string;

  @ApiPropertyOptional({
    description: 'Data emissão final',
  })
  @IsOptional()
  @IsDateString()
  dataEmissaoFim?: string;

  @ApiPropertyOptional({
    description: 'Busca por número da nota',
  })
  @IsOptional()
  @IsString()
  numero?: string;
}
