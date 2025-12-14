import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateNotaFiscalDto {
  @ApiPropertyOptional({
    description: 'Data de emissão',
  })
  @IsOptional()
  @IsDateString()
  dataEmissao?: string;

  @ApiPropertyOptional({
    description: 'Competência',
  })
  @IsOptional()
  @IsDateString()
  competencia?: string;

  @ApiPropertyOptional({
    description: 'Descrição do serviço',
  })
  @IsOptional()
  @IsString()
  @Length(10, 2000)
  descricaoServico?: string;

  @ApiPropertyOptional({
    description: 'Código do serviço',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  codigoServico?: string;

  @ApiPropertyOptional({
    description: 'Valor do serviço',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valorServico?: number;

  @ApiPropertyOptional({
    description: 'Valor das deduções',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorDeducoes?: number;

  @ApiPropertyOptional({
    description: 'Alíquota ISS (%)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10)
  aliquotaIss?: number;

  @ApiPropertyOptional({
    description: 'ISS retido?',
  })
  @IsOptional()
  @IsBoolean()
  issRetido?: boolean;

  @ApiPropertyOptional({
    description: 'Alíquota PIS (%)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  aliquotaPis?: number;

  @ApiPropertyOptional({
    description: 'Alíquota COFINS (%)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10)
  aliquotaCofins?: number;

  @ApiPropertyOptional({
    description: 'Alíquota INSS (%)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(20)
  aliquotaInss?: number;

  @ApiPropertyOptional({
    description: 'Alíquota IR (%)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10)
  aliquotaIr?: number;

  @ApiPropertyOptional({
    description: 'Alíquota CSLL (%)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10)
  aliquotaCsll?: number;

  @ApiPropertyOptional({
    description: 'Outras retenções',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  outrasRetencoes?: number;

  @ApiPropertyOptional({
    description: 'Código município prestação',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  localPrestacaoMunicipioCodigo?: number;
}
