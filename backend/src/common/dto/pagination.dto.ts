import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min, IsString, IsIn } from 'class-validator';

/**
 * DTO base para paginação
 * Usado em todas as listagens da API
 */
export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Número da página (1-based)',
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página',
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  perPage?: number = 20;

  @ApiPropertyOptional({
    description: 'Campo para ordenação',
  })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Direção da ordenação',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    description: 'Termo de busca geral',
  })
  @IsString()
  @IsOptional()
  search?: string;

  /**
   * Calcula o offset para queries do Prisma
   */
  get skip(): number {
    return ((this.page || 1) - 1) * (this.perPage || 20);
  }

  /**
   * Retorna o take para queries do Prisma
   */
  get take(): number {
    return this.perPage || 20;
  }
}

/**
 * Interface para resposta paginada
 */
export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Metadados de paginação
 */
export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Helper para criar resposta paginada
 */
export function createPaginatedResult<T>(
  items: T[],
  total: number,
  pagination: PaginationDto,
): PaginatedResult<T> {
  const page = pagination.page || 1;
  const perPage = pagination.perPage || 20;
  const totalPages = Math.ceil(total / perPage);

  return {
    items,
    meta: {
      total,
      page,
      perPage,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
