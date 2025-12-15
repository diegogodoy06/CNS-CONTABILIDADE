import { IsOptional, IsString, IsBoolean, IsObject, IsEmail } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class AtualizarEscritorioDto {
  @ApiPropertyOptional({ description: 'Nome fantasia do escritório' })
  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @ApiPropertyOptional({ description: 'CNPJ do escritório' })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiPropertyOptional({ description: 'Telefone' })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({ description: 'Email de contato' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Endereço' })
  @IsOptional()
  @IsString()
  endereco?: string;

  @ApiPropertyOptional({ description: 'URL do logo' })
  @IsOptional()
  @IsString()
  logoUrl?: string;
}

export class AtualizarPerfilDto {
  @ApiPropertyOptional({ description: 'Nome do usuário' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ description: 'Telefone' })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({ description: 'URL do avatar' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class AlterarSenhaDto {
  @ApiProperty({ description: 'Senha atual' })
  @IsString()
  senhaAtual: string;

  @ApiProperty({ description: 'Nova senha' })
  @IsString()
  novaSenha: string;
}

export class ConfiguracaoNotificacaoDto {
  @ApiPropertyOptional({ description: 'Receber por email' })
  @IsOptional()
  @IsBoolean()
  email?: boolean;

  @ApiPropertyOptional({ description: 'Receber push' })
  @IsOptional()
  @IsBoolean()
  push?: boolean;

  @ApiPropertyOptional({ description: 'Tipos de notificação habilitados' })
  @IsOptional()
  @IsObject()
  tipos?: Record<string, boolean>;
}

export class ConfiguracaoSistemaDto {
  @ApiPropertyOptional({ description: 'Configurações de email SMTP' })
  @IsOptional()
  @IsObject()
  smtp?: {
    host: string;
    port: number;
    user: string;
    pass: string;
    secure: boolean;
  };

  @ApiPropertyOptional({ description: 'Integração com prefeitura' })
  @IsOptional()
  @IsObject()
  prefeitura?: {
    urlHomologacao: string;
    urlProducao: string;
    ambiente: 'homologacao' | 'producao';
  };

  @ApiPropertyOptional({ description: 'Configurações de backup' })
  @IsOptional()
  @IsObject()
  backup?: {
    habilitado: boolean;
    horario: string;
    retencaoDias: number;
  };
}
