import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificacaoDto } from './dto/create-notificacao.dto';
import { FilterNotificacaoDto, MarcarLidaDto } from './dto/filter-notificacao.dto';
import { UpdateConfiguracoesDto } from './dto/configuracao-notificacao.dto';
import { createPaginatedResult } from '../../common/dto/pagination.dto';
import {
  Usuario,
  TipoUsuario,
  StatusNotificacao,
  Prisma,
  TipoNotificacao,
  CanalNotificacao,
} from '@prisma/client';

@Injectable()
export class NotificacoesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova notificação
   */
  async create(dto: CreateNotificacaoDto, currentUser: Usuario) {
    // Apenas admins podem criar notificações para outros usuários
    if (
      dto.usuarioId !== currentUser.id &&
      currentUser.tipo !== TipoUsuario.ADMIN_SISTEMA &&
      currentUser.tipo !== TipoUsuario.ADMIN_ESCRITORIO
    ) {
      throw new ForbiddenException('Sem permissão para criar notificações');
    }

    return this.prisma.notificacao.create({
      data: {
        usuarioId: dto.usuarioId,
        tipo: dto.tipo,
        canal: dto.canal,
        titulo: dto.titulo,
        mensagem: dto.mensagem,
        dados: dto.dados,
        link: dto.link,
        status: StatusNotificacao.PENDENTE,
      },
    });
  }

  /**
   * Cria notificações em lote para múltiplos usuários
   */
  async createBulk(
    usuariosIds: string[],
    notificacao: Omit<CreateNotificacaoDto, 'usuarioId'>,
    currentUser: Usuario,
  ) {
    if (
      currentUser.tipo !== TipoUsuario.ADMIN_SISTEMA &&
      currentUser.tipo !== TipoUsuario.ADMIN_ESCRITORIO
    ) {
      throw new ForbiddenException('Sem permissão para criar notificações em lote');
    }

    const data = usuariosIds.map((usuarioId) => ({
      usuarioId,
      tipo: notificacao.tipo,
      canal: notificacao.canal,
      titulo: notificacao.titulo,
      mensagem: notificacao.mensagem,
      dados: notificacao.dados || undefined,
      link: notificacao.link,
      status: StatusNotificacao.PENDENTE,
    }));

    return this.prisma.notificacao.createMany({
      data,
    });
  }

  /**
   * Lista notificações do usuário
   */
  async findAll(dto: FilterNotificacaoDto, currentUser: Usuario) {
    const where: Prisma.NotificacaoWhereInput = {
      usuarioId: currentUser.id,
    };

    if (dto.tipo) {
      where.tipo = dto.tipo;
    }

    if (dto.canal) {
      where.canal = dto.canal;
    }

    if (dto.status) {
      where.status = dto.status;
    }

    if (dto.apenasNaoLidas) {
      where.lidaEm = null;
    }

    const [items, total] = await Promise.all([
      this.prisma.notificacao.findMany({
        where,
        skip: dto.skip,
        take: dto.take,
        orderBy: dto.sortBy
          ? { [dto.sortBy]: dto.sortOrder }
          : { criadoEm: 'desc' },
      }),
      this.prisma.notificacao.count({ where }),
    ]);

    return createPaginatedResult(items, total, dto);
  }

  /**
   * Busca notificação por ID
   */
  async findOne(id: string, currentUser: Usuario) {
    const notificacao = await this.prisma.notificacao.findUnique({
      where: { id },
    });

    if (!notificacao) {
      throw new NotFoundException('Notificação não encontrada');
    }

    if (notificacao.usuarioId !== currentUser.id) {
      throw new ForbiddenException('Sem acesso a esta notificação');
    }

    return notificacao;
  }

  /**
   * Marca notificações como lidas
   */
  async marcarComoLida(dto: MarcarLidaDto, currentUser: Usuario) {
    const where: Prisma.NotificacaoWhereInput = {
      usuarioId: currentUser.id,
      lidaEm: null,
    };

    if (!dto.todas && dto.ids?.length) {
      where.id = { in: dto.ids };
    }

    const updated = await this.prisma.notificacao.updateMany({
      where,
      data: {
        status: StatusNotificacao.LIDA,
        lidaEm: new Date(),
      },
    });

    return { count: updated.count };
  }

  /**
   * Remove uma notificação
   */
  async remove(id: string, currentUser: Usuario) {
    const notificacao = await this.prisma.notificacao.findUnique({
      where: { id },
    });

    if (!notificacao) {
      throw new NotFoundException('Notificação não encontrada');
    }

    if (notificacao.usuarioId !== currentUser.id) {
      throw new ForbiddenException('Sem acesso a esta notificação');
    }

    return this.prisma.notificacao.delete({
      where: { id },
    });
  }

  /**
   * Retorna contagem de notificações não lidas
   */
  async countNaoLidas(currentUser: Usuario) {
    const count = await this.prisma.notificacao.count({
      where: {
        usuarioId: currentUser.id,
        lidaEm: null,
      },
    });

    return { count };
  }

  /**
   * Retorna configurações de notificação do usuário
   */
  async getConfiguracoes(currentUser: Usuario) {
    const configuracoes = await this.prisma.configuracaoNotificacao.findMany({
      where: { usuarioId: currentUser.id },
    });

    // Se não tem configurações, retorna defaults
    if (configuracoes.length === 0) {
      return this.getConfiguracoesDefault();
    }

    return configuracoes;
  }

  /**
   * Atualiza configurações de notificação
   */
  async updateConfiguracoes(dto: UpdateConfiguracoesDto, currentUser: Usuario) {
    const operations = dto.configuracoes.map((config) =>
      this.prisma.configuracaoNotificacao.upsert({
        where: {
          usuarioId_tipo_canal: {
            usuarioId: currentUser.id,
            tipo: config.tipo,
            canal: config.canal,
          },
        },
        create: {
          usuarioId: currentUser.id,
          tipo: config.tipo,
          canal: config.canal,
          ativo: config.ativo,
        },
        update: {
          ativo: config.ativo,
        },
      }),
    );

    await this.prisma.$transaction(operations);

    return this.getConfiguracoes(currentUser);
  }

  /**
   * Retorna configurações padrão
   */
  private getConfiguracoesDefault() {
    const tipos = Object.values(TipoNotificacao);
    const canais = Object.values(CanalNotificacao);

    const defaults = [];

    for (const tipo of tipos) {
      for (const canal of canais) {
        defaults.push({
          tipo,
          canal,
          ativo: canal === CanalNotificacao.APP, // Apenas APP ativo por padrão
        });
      }
    }

    return defaults;
  }

  /**
   * Verifica se usuário deve receber notificação
   */
  async deveNotificar(
    usuarioId: string,
    tipo: TipoNotificacao,
    canal: CanalNotificacao,
  ): Promise<boolean> {
    const config = await this.prisma.configuracaoNotificacao.findUnique({
      where: {
        usuarioId_tipo_canal: {
          usuarioId,
          tipo,
          canal,
        },
      },
    });

    // Se não tem configuração, assume default (APP = true, outros = false)
    if (!config) {
      return canal === CanalNotificacao.APP;
    }

    return config.ativo;
  }
}
