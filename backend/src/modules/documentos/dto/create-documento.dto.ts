import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  Length,
} from 'class-validator';
import { TipoDocumento } from '@prisma/client';

export class CreateDocumentoDto {
  @ApiProperty({
    description: 'ID da empresa',
  })
  @IsUUID()
  empresaId: string;

  @ApiProperty({
    description: 'Tipo do documento',
    enum: TipoDocumento,
    example: TipoDocumento.CONTRATO_SOCIAL,
  })
  @IsEnum(TipoDocumento)
  tipo: TipoDocumento;

  @ApiProperty({
    description: 'Título do documento',
    example: 'Contrato Social 2024',
  })
  @IsString()
  @Length(3, 200)
  titulo: string;

  @ApiPropertyOptional({
    description: 'Descrição do documento',
    example: 'Contrato social atualizado com alterações de dezembro/2024',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({
    description: 'ID do documento original (para versionamento)',
  })
  @IsOptional()
  @IsUUID()
  documentoOriginalId?: string;
}
