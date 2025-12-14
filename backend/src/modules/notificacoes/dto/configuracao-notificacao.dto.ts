import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { TipoNotificacao, CanalNotificacao } from '@prisma/client';

export class ConfiguracaoNotificacaoDto {
  @ApiProperty({
    description: 'Tipo da notificação',
    enum: TipoNotificacao,
  })
  @IsEnum(TipoNotificacao)
  tipo: TipoNotificacao;

  @ApiProperty({
    description: 'Canal de notificação',
    enum: CanalNotificacao,
  })
  @IsEnum(CanalNotificacao)
  canal: CanalNotificacao;

  @ApiProperty({
    description: 'Notificação ativa',
    default: true,
  })
  @IsBoolean()
  ativo: boolean;
}

export class UpdateConfiguracoesDto {
  @ApiProperty({
    description: 'Lista de configurações de notificação',
    type: [ConfiguracaoNotificacaoDto],
  })
  configuracoes: ConfiguracaoNotificacaoDto[];
}
