import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PagarGuiaDto {
  @ApiProperty({
    description: 'Data do pagamento',
    example: '2024-12-15',
  })
  @IsDateString()
  dataPagamento: string;

  @ApiPropertyOptional({
    description: 'Valor efetivamente pago',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valorPago?: number;

  @ApiPropertyOptional({
    description: 'Juros pagos',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  juros?: number;

  @ApiPropertyOptional({
    description: 'Multa paga',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  multa?: number;
}
