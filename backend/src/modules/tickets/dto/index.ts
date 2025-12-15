import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, Min, Max, IsUUID } from 'class-validator';
import { PrioridadeTicket, StatusTicket } from '@prisma/client';

export class CreateTicketDto {
  @ApiProperty({ description: 'Título do ticket' })
  @IsString()
  titulo: string;

  @ApiProperty({ description: 'Descrição detalhada' })
  @IsString()
  descricao: string;

  @ApiProperty({ description: 'Categoria do ticket' })
  @IsString()
  categoria: string;

  @ApiPropertyOptional({ enum: PrioridadeTicket })
  @IsOptional()
  @IsEnum(PrioridadeTicket)
  prioridade?: PrioridadeTicket;
}

export class ResponderTicketDto {
  @ApiProperty({ description: 'Conteúdo da resposta' })
  @IsString()
  conteudo: string;

  @ApiPropertyOptional({ description: 'Se é nota interna (não visível ao cliente)' })
  @IsOptional()
  interno?: boolean;
}

export class AtribuirTicketDto {
  @ApiProperty({ description: 'ID do colaborador' })
  @IsUUID()
  colaboradorId: string;
}

export class FiltroTicketsDto {
  @ApiPropertyOptional({ enum: StatusTicket })
  @IsOptional()
  @IsEnum(StatusTicket)
  status?: StatusTicket;

  @ApiPropertyOptional({ enum: PrioridadeTicket })
  @IsOptional()
  @IsEnum(PrioridadeTicket)
  prioridade?: PrioridadeTicket;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  empresaId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  pagina?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limite?: number;
}
