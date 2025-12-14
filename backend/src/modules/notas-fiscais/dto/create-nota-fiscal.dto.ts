import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsDateString,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNotaFiscalDto {
  @ApiProperty({
    description: 'ID da empresa emissora',
  })
  @IsUUID()
  empresaId: string;

  @ApiProperty({
    description: 'ID do tomador do serviço',
  })
  @IsUUID()
  tomadorId: string;

  @ApiProperty({
    description: 'Data de emissão (formato ISO)',
    example: '2024-12-14',
  })
  @IsDateString()
  dataEmissao: string;

  @ApiProperty({
    description: 'Competência (formato ISO, primeiro dia do mês)',
    example: '2024-12-01',
  })
  @IsDateString()
  competencia: string;

  @ApiProperty({
    description: 'Descrição detalhada do serviço prestado',
    example: 'Serviços de consultoria em tecnologia da informação',
  })
  @IsString()
  @Length(10, 2000)
  descricaoServico: string;

  @ApiProperty({
    description: 'Código do serviço (código municipal)',
    example: '1.01',
  })
  @IsString()
  @Length(1, 20)
  codigoServico: string;

  @ApiProperty({
    description: 'Valor total do serviço',
    example: 5000.00,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valorServico: number;

  @ApiPropertyOptional({
    description: 'Valor das deduções',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorDeducoes?: number;

  @ApiPropertyOptional({
    description: 'Alíquota ISS (%) - se não informado, usa da empresa',
    example: 5.00,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10)
  aliquotaIss?: number;

  @ApiPropertyOptional({
    description: 'ISS será retido pelo tomador?',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  issRetido?: boolean;

  @ApiPropertyOptional({
    description: 'Alíquota PIS (%)',
    example: 0.65,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  aliquotaPis?: number;

  @ApiPropertyOptional({
    description: 'Alíquota COFINS (%)',
    example: 3.00,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10)
  aliquotaCofins?: number;

  @ApiPropertyOptional({
    description: 'Alíquota INSS (%)',
    example: 11.00,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(20)
  aliquotaInss?: number;

  @ApiPropertyOptional({
    description: 'Alíquota IR (%)',
    example: 1.50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10)
  aliquotaIr?: number;

  @ApiPropertyOptional({
    description: 'Alíquota CSLL (%)',
    example: 1.00,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10)
  aliquotaCsll?: number;

  @ApiPropertyOptional({
    description: 'Outras retenções',
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  outrasRetencoes?: number;

  @ApiPropertyOptional({
    description: 'Código IBGE do município de prestação do serviço',
    example: 3550308,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  localPrestacaoMunicipioCodigo?: number;
}
