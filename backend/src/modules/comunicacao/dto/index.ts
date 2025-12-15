import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsNumber, Min, Max } from 'class-validator';

export class EnviarMensagemDto {
  @ApiProperty({ description: 'ID do usuário destinatário' })
  @IsUUID()
  destinatarioId: string;

  @ApiPropertyOptional({ description: 'Assunto da mensagem' })
  @IsOptional()
  @IsString()
  assunto?: string;

  @ApiProperty({ description: 'Conteúdo da mensagem' })
  @IsString()
  conteudo: string;
}

export class ResponderMensagemDto {
  @ApiProperty({ description: 'Conteúdo da resposta' })
  @IsString()
  conteudo: string;
}

export class FiltroMensagensDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  usuarioId?: string;

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
