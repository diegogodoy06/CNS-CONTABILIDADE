import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsDateString } from 'class-validator';

export class FilterDashboardDto {
  @ApiPropertyOptional({
    description: 'Filtrar por empresa específica',
  })
  @IsOptional()
  @IsUUID()
  empresaId?: string;

  @ApiPropertyOptional({
    description: 'Data inicial do período',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiPropertyOptional({
    description: 'Data final do período',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiPropertyOptional({
    description: 'Competência inicial',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  competenciaInicio?: string;

  @ApiPropertyOptional({
    description: 'Competência final',
    example: '2024-12-01',
  })
  @IsOptional()
  @IsDateString()
  competenciaFim?: string;
}
