import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID, IsString } from 'class-validator';
import { TipoUsuario, StatusUsuario } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterUsuarioDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de usuário',
    enum: TipoUsuario,
  })
  @IsOptional()
  @IsEnum(TipoUsuario)
  tipo?: TipoUsuario;

  @ApiPropertyOptional({
    description: 'Filtrar por status',
    enum: StatusUsuario,
  })
  @IsOptional()
  @IsEnum(StatusUsuario)
  status?: StatusUsuario;

  @ApiPropertyOptional({
    description: 'Filtrar por escritório',
  })
  @IsOptional()
  @IsUUID()
  escritorioId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por empresa',
  })
  @IsOptional()
  @IsUUID()
  empresaId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por nome ou email',
  })
  @IsOptional()
  @IsString()
  busca?: string;
}
