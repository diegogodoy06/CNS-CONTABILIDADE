import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { RegimeTributario, StatusEmpresa } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterEmpresaDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por escritório',
  })
  @IsOptional()
  @IsUUID()
  escritorioId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por status',
    enum: StatusEmpresa,
  })
  @IsOptional()
  @IsEnum(StatusEmpresa)
  status?: StatusEmpresa;

  @ApiPropertyOptional({
    description: 'Filtrar por regime tributário',
    enum: RegimeTributario,
  })
  @IsOptional()
  @IsEnum(RegimeTributario)
  regimeTributario?: RegimeTributario;
}
