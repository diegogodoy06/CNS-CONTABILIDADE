import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID, IsString } from 'class-validator';
import { TipoDocumento, StatusDocumento } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterDocumentoDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por empresa',
  })
  @IsOptional()
  @IsUUID()
  empresaId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tipo de documento',
    enum: TipoDocumento,
  })
  @IsOptional()
  @IsEnum(TipoDocumento)
  tipo?: TipoDocumento;

  @ApiPropertyOptional({
    description: 'Filtrar por status',
    enum: StatusDocumento,
  })
  @IsOptional()
  @IsEnum(StatusDocumento)
  status?: StatusDocumento;

  @ApiPropertyOptional({
    description: 'Busca por título',
  })
  @IsOptional()
  @IsString()
  busca?: string;
}
