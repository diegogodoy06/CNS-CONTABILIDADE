import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoGuia, StatusGuia } from '@prisma/client';

export class UpdateGuiaDto {
  @ApiPropertyOptional({
    description: 'Tipo da guia',
    enum: TipoGuia,
  })
  @IsOptional()
  @IsEnum(TipoGuia)
  tipo?: TipoGuia;

  @ApiPropertyOptional({
    description: 'Competência',
  })
  @IsOptional()
  @IsDateString()
  competencia?: string;

  @ApiPropertyOptional({
    description: 'Data de vencimento',
  })
  @IsOptional()
  @IsDateString()
  dataVencimento?: string;

  @ApiPropertyOptional({
    description: 'Data de pagamento',
  })
  @IsOptional()
  @IsDateString()
  dataPagamento?: string;

  @ApiPropertyOptional({
    description: 'Valor da guia',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor?: number;

  @ApiPropertyOptional({
    description: 'Valor pago',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorPago?: number;

  @ApiPropertyOptional({
    description: 'Juros',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  juros?: number;

  @ApiPropertyOptional({
    description: 'Multa',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  multa?: number;

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
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  numeroDocumento?: string;

  @ApiPropertyOptional({
    description: 'Status da guia',
    enum: StatusGuia,
  })
  @IsOptional()
  @IsEnum(StatusGuia)
  status?: StatusGuia;

  @ApiPropertyOptional({
    description: 'Observações',
  })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
