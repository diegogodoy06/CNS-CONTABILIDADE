import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  Length,
  IsObject,
} from 'class-validator';
import { TipoNotificacao, CanalNotificacao } from '@prisma/client';

export class CreateNotificacaoDto {
  @ApiProperty({
    description: 'ID do usuário destinatário',
  })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({
    description: 'Tipo da notificação',
    enum: TipoNotificacao,
    example: TipoNotificacao.SISTEMA,
  })
  @IsEnum(TipoNotificacao)
  tipo: TipoNotificacao;

  @ApiProperty({
    description: 'Canal de entrega',
    enum: CanalNotificacao,
    example: CanalNotificacao.APP,
  })
  @IsEnum(CanalNotificacao)
  canal: CanalNotificacao;

  @ApiProperty({
    description: 'Título da notificação',
    example: 'Nova guia disponível',
  })
  @IsString()
  @Length(3, 200)
  titulo: string;

  @ApiProperty({
    description: 'Mensagem da notificação',
    example: 'A guia DAS de dezembro/2024 está disponível para pagamento',
  })
  @IsString()
  mensagem: string;

  @ApiPropertyOptional({
    description: 'Dados adicionais em JSON',
  })
  @IsOptional()
  @IsObject()
  dados?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Link de redirecionamento',
    example: '/guias/123',
  })
  @IsOptional()
  @IsString()
  link?: string;
}
