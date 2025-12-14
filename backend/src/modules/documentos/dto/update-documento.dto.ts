import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  Length,
} from 'class-validator';
import { TipoDocumento, StatusDocumento } from '@prisma/client';

export class UpdateDocumentoDto {
  @ApiPropertyOptional({
    description: 'Tipo do documento',
    enum: TipoDocumento,
  })
  @IsOptional()
  @IsEnum(TipoDocumento)
  tipo?: TipoDocumento;

  @ApiPropertyOptional({
    description: 'Título do documento',
  })
  @IsOptional()
  @IsString()
  @Length(3, 200)
  titulo?: string;

  @ApiPropertyOptional({
    description: 'Descrição do documento',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({
    description: 'Status do documento',
    enum: StatusDocumento,
  })
  @IsOptional()
  @IsEnum(StatusDocumento)
  status?: StatusDocumento;
}
