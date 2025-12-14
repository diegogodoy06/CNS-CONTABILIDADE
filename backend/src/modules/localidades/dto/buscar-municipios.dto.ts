import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsIn, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class BuscarMunicipiosDto {
  @ApiPropertyOptional({
    description: 'Termo de busca (nome do município)',
    example: 'São Paulo',
  })
  @IsOptional()
  @IsString()
  termo?: string;

  @ApiPropertyOptional({
    description: 'ID do estado (IBGE)',
    example: 35,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  estadoId?: number;

  @ApiPropertyOptional({
    description: 'Sigla do estado (UF)',
    example: 'SP',
  })
  @IsOptional()
  @IsString()
  @IsIn([
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  ])
  uf?: string;

  @ApiPropertyOptional({
    description: 'Limite de resultados',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
