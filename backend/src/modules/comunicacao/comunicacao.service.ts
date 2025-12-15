import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EnviarMensagemDto, FiltroMensagensDto } from './dto';

@Injectable()
export class ComunicacaoService {
  constructor(private prisma: PrismaService) {}

  /**
   * Envia mensagem para usuário
   */
  async enviarMensagem(remetenteId: string, dto: EnviarMensagemDto) {
    return this.prisma.mensagem.create({
      data: {
        remetenteId,
        destinatarioId: dto.destinatarioId,
        assunto: dto.assunto,
        conteudo: dto.conteudo,
      },
      include: {
        remetente: { select: { id: true, nome: true } },
        destinatario: { select: { id: true, nome: true } },
      },
    });
  }

  /**
   * Lista mensagens enviadas pelo usuário
   */
  async listarMensagensEnviadas(usuarioId: string, filtros: FiltroMensagensDto) {
    const where: any = {
      remetenteId: usuarioId,
      arquivadaRemetente: false,
    };

    const [mensagens, total] = await Promise.all([
      this.prisma.mensagem.findMany({
        where,
        include: {
          destinatario: { select: { id: true, nome: true, email: true } },
        },
        orderBy: { criadoEm: 'desc' },
        skip: filtros.pagina ? (filtros.pagina - 1) * (filtros.limite || 20) : 0,
        take: filtros.limite || 20,
      }),
      this.prisma.mensagem.count({ where }),
    ]);

    return { mensagens, total, pagina: filtros.pagina || 1 };
  }

  /**
   * Lista mensagens recebidas pelo usuário
   */
  async listarMensagensRecebidas(usuarioId: string, filtros: FiltroMensagensDto) {
    const where: any = {
      destinatarioId: usuarioId,
      arquivadaDestinatario: false,
    };

    const [mensagens, total] = await Promise.all([
      this.prisma.mensagem.findMany({
        where,
        include: {
          remetente: { select: { id: true, nome: true, email: true } },
        },
        orderBy: { criadoEm: 'desc' },
        skip: filtros.pagina ? (filtros.pagina - 1) * (filtros.limite || 20) : 0,
        take: filtros.limite || 20,
      }),
      this.prisma.mensagem.count({ where }),
    ]);

    return { mensagens, total, pagina: filtros.pagina || 1 };
  }

  /**
   * Busca mensagem por ID
   */
  async buscarMensagem(mensagemId: string, usuarioId: string) {
    const mensagem = await this.prisma.mensagem.findUnique({
      where: { id: mensagemId },
      include: {
        remetente: { select: { id: true, nome: true, email: true } },
        destinatario: { select: { id: true, nome: true, email: true } },
      },
    });

    if (!mensagem) {
      throw new NotFoundException('Mensagem não encontrada');
    }

    // Marcar como lida se for o destinatário
    if (mensagem.destinatarioId === usuarioId && !mensagem.lidaEm) {
      await this.prisma.mensagem.update({
        where: { id: mensagemId },
        data: { lidaEm: new Date() },
      });
    }

    return mensagem;
  }

  /**
   * Conta mensagens não lidas
   */
  async contarNaoLidas(usuarioId: string) {
    return this.prisma.mensagem.count({
      where: {
        destinatarioId: usuarioId,
        lidaEm: null,
        arquivadaDestinatario: false,
      },
    });
  }

  /**
   * Arquiva mensagem
   */
  async arquivarMensagem(mensagemId: string, usuarioId: string) {
    const mensagem = await this.prisma.mensagem.findUnique({
      where: { id: mensagemId },
    });

    if (!mensagem) {
      throw new NotFoundException('Mensagem não encontrada');
    }

    const updateData: any = {};
    if (mensagem.remetenteId === usuarioId) {
      updateData.arquivadaRemetente = true;
    }
    if (mensagem.destinatarioId === usuarioId) {
      updateData.arquivadaDestinatario = true;
    }

    return this.prisma.mensagem.update({
      where: { id: mensagemId },
      data: updateData,
    });
  }

  /**
   * Cria notificação para usuário
   */
  async criarNotificacao(usuarioId: string, tipo: any, titulo: string, mensagem: string, link?: string) {
    return this.prisma.notificacao.create({
      data: {
        usuarioId,
        tipo,
        canal: 'APP',
        titulo,
        mensagem,
        link,
        status: 'PENDENTE',
      },
    });
  }

  /**
   * Lista notificações do usuário
   */
  async listarNotificacoes(usuarioId: string, limite = 20) {
    return this.prisma.notificacao.findMany({
      where: { usuarioId },
      orderBy: { criadoEm: 'desc' },
      take: limite,
    });
  }

  /**
   * Marca notificação como lida
   */
  async marcarNotificacaoLida(notificacaoId: string, usuarioId: string) {
    return this.prisma.notificacao.updateMany({
      where: { id: notificacaoId, usuarioId },
      data: { status: 'LIDA', lidaEm: new Date() },
    });
  }
}
