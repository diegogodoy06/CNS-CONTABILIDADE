import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGuiaDto } from './dto/create-guia.dto';
import { UpdateGuiaDto } from './dto/update-guia.dto';
import { FilterGuiaDto } from './dto/filter-guia.dto';
import { PagarGuiaDto } from './dto/pagar-guia.dto';
import { createPaginatedResult } from '../../common/dto/pagination.dto';
import { Usuario, TipoUsuario, StatusGuia, Prisma } from '@prisma/client';

@Injectable()
export class GuiasService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova guia
   */
  async create(dto: CreateGuiaDto, currentUser: Usuario) {
    await this.checkEmpresaAccess(dto.empresaId, currentUser);

    return this.prisma.guia.create({
      data: {
        empresaId: dto.empresaId,
        tipo: dto.tipo,
        competencia: new Date(dto.competencia),
        dataVencimento: new Date(dto.dataVencimento),
        valor: dto.valor,
        codigoBarras: dto.codigoBarras,
        linhaDigitavel: dto.linhaDigitavel,
        numeroDocumento: dto.numeroDocumento,
        observacoes: dto.observacoes,
        status: StatusGuia.PENDENTE,
      },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          },
        },
      },
    });
  }

  /**
   * Lista guias com filtros e paginação
   */
  async findAll(dto: FilterGuiaDto, currentUser: Usuario) {
    const where: Prisma.GuiaWhereInput = {};

    // Filtro por empresa
    if (dto.empresaId) {
      await this.checkEmpresaAccess(dto.empresaId, currentUser);
      where.empresaId = dto.empresaId;
    } else {
      const empresasIds = await this.getEmpresasAcessiveis(currentUser);
      where.empresaId = { in: empresasIds };
    }

    // Filtros opcionais
    if (dto.tipo) {
      where.tipo = dto.tipo;
    }

    if (dto.status) {
      where.status = dto.status;
    }

    if (dto.competenciaInicio || dto.competenciaFim) {
      where.competencia = {};
      if (dto.competenciaInicio) {
        where.competencia.gte = new Date(dto.competenciaInicio);
      }
      if (dto.competenciaFim) {
        where.competencia.lte = new Date(dto.competenciaFim);
      }
    }

    if (dto.vencimentoInicio || dto.vencimentoFim) {
      where.dataVencimento = {};
      if (dto.vencimentoInicio) {
        where.dataVencimento.gte = new Date(dto.vencimentoInicio);
      }
      if (dto.vencimentoFim) {
        where.dataVencimento.lte = new Date(dto.vencimentoFim);
      }
    }

    if (dto.apenasVencidas) {
      where.dataVencimento = { lt: new Date() };
      where.status = StatusGuia.PENDENTE;
    }

    if (dto.apenasPendentes) {
      where.status = StatusGuia.PENDENTE;
    }

    const [items, total] = await Promise.all([
      this.prisma.guia.findMany({
        where,
        skip: dto.skip,
        take: dto.take,
        orderBy: dto.sortBy
          ? { [dto.sortBy]: dto.sortOrder }
          : { dataVencimento: 'asc' },
        include: {
          empresa: {
            select: {
              id: true,
              razaoSocial: true,
              nomeFantasia: true,
            },
          },
        },
      }),
      this.prisma.guia.count({ where }),
    ]);

    return createPaginatedResult(items, total, dto);
  }

  /**
   * Busca guia por ID
   */
  async findOne(id: string, currentUser: Usuario) {
    const guia = await this.prisma.guia.findUnique({
      where: { id },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
          },
        },
      },
    });

    if (!guia) {
      throw new NotFoundException('Guia não encontrada');
    }

    await this.checkEmpresaAccess(guia.empresaId, currentUser);

    return guia;
  }

  /**
   * Atualiza uma guia
   */
  async update(id: string, dto: UpdateGuiaDto, currentUser: Usuario) {
    const guia = await this.prisma.guia.findUnique({
      where: { id },
    });

    if (!guia) {
      throw new NotFoundException('Guia não encontrada');
    }

    await this.checkEmpresaAccess(guia.empresaId, currentUser);

    // Não pode editar guia paga ou cancelada
    if (guia.status === StatusGuia.PAGA || guia.status === StatusGuia.CANCELADA) {
      throw new BadRequestException('Não é possível editar guia paga ou cancelada');
    }

    return this.prisma.guia.update({
      where: { id },
      data: {
        tipo: dto.tipo,
        competencia: dto.competencia ? new Date(dto.competencia) : undefined,
        dataVencimento: dto.dataVencimento ? new Date(dto.dataVencimento) : undefined,
        dataPagamento: dto.dataPagamento ? new Date(dto.dataPagamento) : undefined,
        valor: dto.valor,
        valorPago: dto.valorPago,
        juros: dto.juros,
        multa: dto.multa,
        codigoBarras: dto.codigoBarras,
        linhaDigitavel: dto.linhaDigitavel,
        numeroDocumento: dto.numeroDocumento,
        status: dto.status,
        observacoes: dto.observacoes,
      },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
          },
        },
      },
    });
  }

  /**
   * Registra pagamento de guia
   */
  async pagar(id: string, dto: PagarGuiaDto, currentUser: Usuario) {
    const guia = await this.prisma.guia.findUnique({
      where: { id },
    });

    if (!guia) {
      throw new NotFoundException('Guia não encontrada');
    }

    await this.checkEmpresaAccess(guia.empresaId, currentUser);

    if (guia.status === StatusGuia.PAGA) {
      throw new BadRequestException('Guia já foi paga');
    }

    if (guia.status === StatusGuia.CANCELADA) {
      throw new BadRequestException('Guia cancelada não pode ser paga');
    }

    return this.prisma.guia.update({
      where: { id },
      data: {
        status: StatusGuia.PAGA,
        dataPagamento: new Date(dto.dataPagamento),
        valorPago: dto.valorPago ?? Number(guia.valor),
        juros: dto.juros ?? 0,
        multa: dto.multa ?? 0,
      },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
          },
        },
      },
    });
  }

  /**
   * Cancela uma guia
   */
  async cancelar(id: string, currentUser: Usuario) {
    const guia = await this.prisma.guia.findUnique({
      where: { id },
    });

    if (!guia) {
      throw new NotFoundException('Guia não encontrada');
    }

    await this.checkEmpresaAccess(guia.empresaId, currentUser);

    if (guia.status === StatusGuia.PAGA) {
      throw new BadRequestException('Guia paga não pode ser cancelada');
    }

    return this.prisma.guia.update({
      where: { id },
      data: { status: StatusGuia.CANCELADA },
    });
  }

  /**
   * Remove uma guia
   */
  async remove(id: string, currentUser: Usuario) {
    const guia = await this.prisma.guia.findUnique({
      where: { id },
    });

    if (!guia) {
      throw new NotFoundException('Guia não encontrada');
    }

    await this.checkEmpresaAccess(guia.empresaId, currentUser);

    // Só pode excluir guias pendentes
    if (guia.status !== StatusGuia.PENDENTE) {
      throw new BadRequestException('Apenas guias pendentes podem ser excluídas');
    }

    return this.prisma.guia.delete({
      where: { id },
    });
  }

  /**
   * Retorna guias próximas do vencimento
   */
  async getProximasVencer(diasAntecedencia: number, currentUser: Usuario) {
    const empresasIds = await this.getEmpresasAcessiveis(currentUser);

    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + diasAntecedencia);

    return this.prisma.guia.findMany({
      where: {
        empresaId: { in: empresasIds },
        status: StatusGuia.PENDENTE,
        dataVencimento: {
          gte: new Date(),
          lte: dataLimite,
        },
      },
      orderBy: { dataVencimento: 'asc' },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          },
        },
      },
    });
  }

  /**
   * Retorna guias vencidas
   */
  async getVencidas(currentUser: Usuario) {
    const empresasIds = await this.getEmpresasAcessiveis(currentUser);

    return this.prisma.guia.findMany({
      where: {
        empresaId: { in: empresasIds },
        status: StatusGuia.PENDENTE,
        dataVencimento: { lt: new Date() },
      },
      orderBy: { dataVencimento: 'asc' },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          },
        },
      },
    });
  }

  /**
   * Verifica acesso à empresa
   */
  private async checkEmpresaAccess(empresaId: string, user: Usuario) {
    if (user.tipo === TipoUsuario.ADMIN_SISTEMA) {
      return;
    }

    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
      include: {
        usuarios: {
          where: { usuarioId: user.id, ativo: true },
        },
        escritorio: {
          include: {
            colaboradores: {
              where: { usuarioId: user.id, ativo: true },
            },
          },
        },
      },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    const hasAccess =
      empresa.usuarios.length > 0 ||
      empresa.escritorio.colaboradores.length > 0;

    if (!hasAccess) {
      throw new ForbiddenException('Sem acesso a esta empresa');
    }
  }

  /**
   * Retorna IDs das empresas acessíveis
   */
  private async getEmpresasAcessiveis(user: Usuario): Promise<string[]> {
    if (user.tipo === TipoUsuario.ADMIN_SISTEMA) {
      const empresas = await this.prisma.empresa.findMany({
        select: { id: true },
      });
      return empresas.map((e) => e.id);
    }

    if (user.tipo === TipoUsuario.CLIENTE) {
      const vinculos = await this.prisma.usuarioEmpresa.findMany({
        where: { usuarioId: user.id, ativo: true },
        select: { empresaId: true },
      });
      return vinculos.map((v) => v.empresaId);
    }

    const colaborador = await this.prisma.colaboradorEscritorio.findUnique({
      where: { usuarioId: user.id },
    });

    if (colaborador) {
      const empresas = await this.prisma.empresa.findMany({
        where: { escritorioId: colaborador.escritorioId },
        select: { id: true },
      });
      return empresas.map((e) => e.id);
    }

    return [];
  }
}
