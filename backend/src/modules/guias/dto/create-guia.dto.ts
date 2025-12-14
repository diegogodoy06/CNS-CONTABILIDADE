import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  IsDateString,
  Min,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoGuia } from '@prisma/client';

export class CreateGuiaDto {
  @ApiProperty({
    description: 'ID da empresa',
  })
  @IsUUID()
  empresaId: string;

  @ApiProperty({
    description: 'Tipo da guia',
    enum: TipoGuia,
    example: TipoGuia.DAS,
  })
  @IsEnum(TipoGuia)
  tipo: TipoGuia;

  @ApiProperty({
    description: 'Competência (formato ISO, primeiro dia do mês)',
    example: '2024-12-01',
  })
  @IsDateString()
  competencia: string;

  @ApiProperty({
    description: 'Data de vencimento',
    example: '2024-12-20',
  })
  @IsDateString()
  dataVencimento: string;

  @ApiProperty({
    description: 'Valor da guia',
    example: 500.00,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor: number;

  @ApiPropertyOptional({
    description: 'Código de barras',
  })
  @IsOptional()
  @IsString()
  codigoBarras?: string;

  @ApiPropertyOptional({
    description: 'Linha digitável',
  })
  @IsOptional()
  @IsString()
  linhaDigitavel?: string;

  @ApiPropertyOptional({
    description: 'Número do documento',
    example: '202412-001',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  numeroDocumento?: string;

  @ApiPropertyOptional({
    description: 'Observações',
  })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
