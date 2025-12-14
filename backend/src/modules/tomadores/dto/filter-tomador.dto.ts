import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { TipoPessoa } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterTomadorDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por empresa',
  })
  @IsOptional()
  @IsUUID()
  empresaId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tipo de pessoa',
    enum: TipoPessoa,
  })
  @IsOptional()
  @IsEnum(TipoPessoa)
  tipoPessoa?: TipoPessoa;

  @ApiPropertyOptional({
    description: 'Filtrar por CPF/CNPJ',
  })
  @IsOptional()
  @IsString()
  cpfCnpj?: string;

  @ApiPropertyOptional({
    description: 'Filtrar apenas ativos',
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  ativo?: boolean;

  @ApiPropertyOptional({
    description: 'Busca por nome ou razão social',
  })
  @IsOptional()
  @IsString()
  busca?: string;
}
