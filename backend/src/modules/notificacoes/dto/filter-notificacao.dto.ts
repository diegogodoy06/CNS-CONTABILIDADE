import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsBoolean, IsArray, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { TipoNotificacao, CanalNotificacao, StatusNotificacao } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterNotificacaoDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por tipo',
    enum: TipoNotificacao,
  })
  @IsOptional()
  @IsEnum(TipoNotificacao)
  tipo?: TipoNotificacao;

  @ApiPropertyOptional({
    description: 'Filtrar por canal',
    enum: CanalNotificacao,
  })
  @IsOptional()
  @IsEnum(CanalNotificacao)
  canal?: CanalNotificacao;

  @ApiPropertyOptional({
    description: 'Filtrar por status',
    enum: StatusNotificacao,
  })
  @IsOptional()
  @IsEnum(StatusNotificacao)
  status?: StatusNotificacao;

  @ApiPropertyOptional({
    description: 'Apenas não lidas',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  apenasNaoLidas?: boolean;
}

export class MarcarLidaDto {
  @ApiPropertyOptional({
    description: 'IDs das notificações a marcar como lidas',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  ids?: string[];

  @ApiPropertyOptional({
    description: 'Marcar todas como lidas',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  todas?: boolean;
}
