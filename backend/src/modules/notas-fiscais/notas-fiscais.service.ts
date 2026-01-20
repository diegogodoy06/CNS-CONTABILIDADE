import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotaFiscalDto } from './dto/create-nota-fiscal.dto';
import { UpdateNotaFiscalDto } from './dto/update-nota-fiscal.dto';
import { FilterNotaFiscalDto } from './dto/filter-nota-fiscal.dto';
import { CancelarNotaFiscalDto } from './dto/cancelar-nota-fiscal.dto';
import { createPaginatedResult } from '../../common/dto/pagination.dto';
import { Usuario, TipoUsuario, StatusNota, Prisma } from '@prisma/client';

@Injectable()
export class NotasFiscaisService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova nota fiscal (rascunho)
   */
  async create(dto: CreateNotaFiscalDto, currentUser: Usuario) {
    // Verifica acesso à empresa
    await this.checkEmpresaAccess(dto.empresaId, currentUser);

    // Verifica se tomador pertence à empresa
    const tomador = await this.prisma.tomador.findFirst({
      where: {
        id: dto.tomadorId,
        empresaId: dto.empresaId,
        ativo: true,
      },
    });

    if (!tomador) {
      throw new BadRequestException('Tomador não encontrado ou não pertence à empresa');
    }

    // Busca dados da empresa para alíquota padrão
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: dto.empresaId },
    });

    // Calcula impostos
    const calculos = this.calcularImpostos({
      valorServico: dto.valorServico,
      valorDeducoes: dto.valorDeducoes || 0,
      aliquotaIss: dto.aliquotaIss ?? Number(empresa?.aliquotaIss || 0),
      issRetido: dto.issRetido || false,
      aliquotaPis: dto.aliquotaPis || 0,
      aliquotaCofins: dto.aliquotaCofins || 0,
      aliquotaInss: dto.aliquotaInss || 0,
      aliquotaIr: dto.aliquotaIr || 0,
      aliquotaCsll: dto.aliquotaCsll || 0,
      outrasRetencoes: dto.outrasRetencoes || 0,
    });

    return this.prisma.notaFiscal.create({
      data: {
        empresaId: dto.empresaId,
        tomadorId: dto.tomadorId,
        dataEmissao: new Date(dto.dataEmissao),
        competencia: new Date(dto.competencia),
        descricaoServico: dto.descricaoServico,
        codigoServico: dto.codigoServico,
        valorServico: dto.valorServico,
        valorDeducoes: dto.valorDeducoes || 0,
        baseCalculo: calculos.baseCalculo,
        aliquotaIss: calculos.aliquotaIss,
        valorIss: calculos.valorIss,
        issRetido: dto.issRetido || false,
        valorIssRetido: calculos.valorIssRetido,
        valorPis: calculos.valorPis,
        valorCofins: calculos.valorCofins,
        valorInss: calculos.valorInss,
        valorIr: calculos.valorIr,
        valorCsll: calculos.valorCsll,
        outrasRetencoes: dto.outrasRetencoes || 0,
        valorLiquido: calculos.valorLiquido,
        localPrestacaoMunicipioCodigo: dto.localPrestacaoMunicipioCodigo,
        status: StatusNota.RASCUNHO,
      },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            cnpj: true,
          },
        },
        tomador: {
          select: {
            id: true,
            razaoSocial: true,
            cpfCnpj: true,
          },
        },
      },
    });
  }

  /**
   * Lista notas fiscais com filtros e paginação
   */
  async findAll(dto: FilterNotaFiscalDto, currentUser: Usuario) {
    const where: Prisma.NotaFiscalWhereInput = {};

    // Filtro por empresa
    if (dto.empresaId) {
      await this.checkEmpresaAccess(dto.empresaId, currentUser);
      where.empresaId = dto.empresaId;
    } else {
      const empresasIds = await this.getEmpresasAcessiveis(currentUser);
      where.empresaId = { in: empresasIds };
    }

    // Filtros opcionais
    if (dto.tomadorId) {
      where.tomadorId = dto.tomadorId;
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

    if (dto.dataEmissaoInicio || dto.dataEmissaoFim) {
      where.dataEmissao = {};
      if (dto.dataEmissaoInicio) {
        where.dataEmissao.gte = new Date(dto.dataEmissaoInicio);
      }
      if (dto.dataEmissaoFim) {
        where.dataEmissao.lte = new Date(dto.dataEmissaoFim);
      }
    }

    if (dto.numero) {
      where.numero = parseInt(dto.numero);
    }

    const [items, total] = await Promise.all([
      this.prisma.notaFiscal.findMany({
        where,
        skip: dto.skip,
        take: dto.take,
        orderBy: dto.sortBy
          ? { [dto.sortBy]: dto.sortOrder }
          : { dataEmissao: 'desc' },
        include: {
          empresa: {
            select: {
              id: true,
              razaoSocial: true,
              nomeFantasia: true,
            },
          },
          tomador: {
            select: {
              id: true,
              razaoSocial: true,
              cpfCnpj: true,
            },
          },
        },
      }),
      this.prisma.notaFiscal.count({ where }),
    ]);

    return createPaginatedResult(items, total, dto);
  }

  /**
   * Busca nota fiscal por ID
   */
  async findOne(id: string, currentUser: Usuario) {
    const nota = await this.prisma.notaFiscal.findUnique({
      where: { id },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
            inscricaoMunicipal: true,
            email: true,
            telefone: true,
            logradouro: true,
            numero: true,
            bairro: true,
            municipio: true,
            estado: true,
          },
        },
        tomador: {
          include: {
            estado: true,
            municipio: true,
          },
        },
        localPrestacao: true,
        notaSubstituida: {
          select: {
            id: true,
            numero: true,
            dataEmissao: true,
          },
        },
        notasSubstitutas: {
          select: {
            id: true,
            numero: true,
            dataEmissao: true,
          },
        },
      },
    });

    if (!nota) {
      throw new NotFoundException('Nota fiscal não encontrada');
    }

    await this.checkEmpresaAccess(nota.empresaId, currentUser);

    return nota;
  }

  /**
   * Atualiza uma nota fiscal (apenas rascunhos)
   */
  async update(id: string, dto: UpdateNotaFiscalDto, currentUser: Usuario) {
    const nota = await this.prisma.notaFiscal.findUnique({
      where: { id },
      include: { empresa: true },
    });

    if (!nota) {
      throw new NotFoundException('Nota fiscal não encontrada');
    }

    if (nota.status !== StatusNota.RASCUNHO) {
      throw new BadRequestException('Apenas notas em rascunho podem ser editadas');
    }

    await this.checkEmpresaAccess(nota.empresaId, currentUser);

    // Recalcula impostos se valores foram alterados
    const valorServico = dto.valorServico ?? Number(nota.valorServico);
    const valorDeducoes = dto.valorDeducoes ?? Number(nota.valorDeducoes);
    const aliquotaIss = dto.aliquotaIss ?? Number(nota.aliquotaIss);
    const issRetido = dto.issRetido ?? nota.issRetido;

    const calculos = this.calcularImpostos({
      valorServico,
      valorDeducoes,
      aliquotaIss,
      issRetido,
      aliquotaPis: dto.aliquotaPis || 0,
      aliquotaCofins: dto.aliquotaCofins || 0,
      aliquotaInss: dto.aliquotaInss || 0,
      aliquotaIr: dto.aliquotaIr || 0,
      aliquotaCsll: dto.aliquotaCsll || 0,
      outrasRetencoes: dto.outrasRetencoes ?? Number(nota.outrasRetencoes),
    });

    return this.prisma.notaFiscal.update({
      where: { id },
      data: {
        dataEmissao: dto.dataEmissao ? new Date(dto.dataEmissao) : undefined,
        competencia: dto.competencia ? new Date(dto.competencia) : undefined,
        descricaoServico: dto.descricaoServico,
        codigoServico: dto.codigoServico,
        valorServico: dto.valorServico,
        valorDeducoes: dto.valorDeducoes,
        baseCalculo: calculos.baseCalculo,
        aliquotaIss: calculos.aliquotaIss,
        valorIss: calculos.valorIss,
        issRetido,
        valorIssRetido: calculos.valorIssRetido,
        valorPis: calculos.valorPis,
        valorCofins: calculos.valorCofins,
        valorInss: calculos.valorInss,
        valorIr: calculos.valorIr,
        valorCsll: calculos.valorCsll,
        outrasRetencoes: dto.outrasRetencoes,
        valorLiquido: calculos.valorLiquido,
        localPrestacaoMunicipioCodigo: dto.localPrestacaoMunicipioCodigo,
      },
      include: {
        empresa: {
          select: { id: true, razaoSocial: true },
        },
        tomador: {
          select: { id: true, razaoSocial: true },
        },
      },
    });
  }

  /**
   * Emite uma nota fiscal (muda status para EMITIDA)
   */
  async emitir(id: string, currentUser: Usuario) {
    const nota = await this.prisma.notaFiscal.findUnique({
      where: { id },
    });

    if (!nota) {
      throw new NotFoundException('Nota fiscal não encontrada');
    }

    if (nota.status !== StatusNota.RASCUNHO) {
      throw new BadRequestException('Apenas notas em rascunho podem ser emitidas');
    }

    await this.checkEmpresaAccess(nota.empresaId, currentUser);

    // Gera número da nota
    const ultimaNota = await this.prisma.notaFiscal.findFirst({
      where: {
        empresaId: nota.empresaId,
        numero: { not: null },
      },
      orderBy: { numero: 'desc' },
    });

    const proximoNumero = (ultimaNota?.numero || 0) + 1;

    return this.prisma.notaFiscal.update({
      where: { id },
      data: {
        status: StatusNota.EMITIDA,
        numero: proximoNumero,
        serie: 'A',
        codigoVerificacao: this.gerarCodigoVerificacao(),
      },
      include: {
        empresa: {
          select: { id: true, razaoSocial: true },
        },
        tomador: {
          select: { id: true, razaoSocial: true },
        },
      },
    });
  }

  /**
   * Cancela uma nota fiscal
   */
  async cancelar(id: string, dto: CancelarNotaFiscalDto, currentUser: Usuario) {
    const nota = await this.prisma.notaFiscal.findUnique({
      where: { id },
    });

    if (!nota) {
      throw new NotFoundException('Nota fiscal não encontrada');
    }

    if (nota.status === StatusNota.CANCELADA) {
      throw new BadRequestException('Nota já está cancelada');
    }

    if (nota.status === StatusNota.SUBSTITUIDA) {
      throw new BadRequestException('Nota substituída não pode ser cancelada');
    }

    await this.checkEmpresaAccess(nota.empresaId, currentUser);

    return this.prisma.notaFiscal.update({
      where: { id },
      data: {
        status: StatusNota.CANCELADA,
        motivoCancelamento: dto.motivoCancelamento,
      },
    });
  }

  /**
   * Remove uma nota fiscal (apenas rascunhos)
   */
  async remove(id: string, currentUser: Usuario) {
    const nota = await this.prisma.notaFiscal.findUnique({
      where: { id },
    });

    if (!nota) {
      throw new NotFoundException('Nota fiscal não encontrada');
    }

    if (nota.status !== StatusNota.RASCUNHO) {
      throw new BadRequestException('Apenas notas em rascunho podem ser excluídas');
    }

    await this.checkEmpresaAccess(nota.empresaId, currentUser);

    return this.prisma.notaFiscal.delete({
      where: { id },
    });
  }

  /**
   * Calcula impostos da nota fiscal
   */
  private calcularImpostos(dados: {
    valorServico: number;
    valorDeducoes: number;
    aliquotaIss: number;
    issRetido: boolean;
    aliquotaPis: number;
    aliquotaCofins: number;
    aliquotaInss: number;
    aliquotaIr: number;
    aliquotaCsll: number;
    outrasRetencoes: number;
  }) {
    const baseCalculo = dados.valorServico - dados.valorDeducoes;
    const valorIss = (baseCalculo * dados.aliquotaIss) / 100;
    const valorIssRetido = dados.issRetido ? valorIss : 0;
    const valorPis = (dados.valorServico * dados.aliquotaPis) / 100;
    const valorCofins = (dados.valorServico * dados.aliquotaCofins) / 100;
    const valorInss = (dados.valorServico * dados.aliquotaInss) / 100;
    const valorIr = (dados.valorServico * dados.aliquotaIr) / 100;
    const valorCsll = (dados.valorServico * dados.aliquotaCsll) / 100;

    const totalRetencoes =
      valorIssRetido +
      valorPis +
      valorCofins +
      valorInss +
      valorIr +
      valorCsll +
      dados.outrasRetencoes;

    const valorLiquido = dados.valorServico - totalRetencoes;

    return {
      baseCalculo: this.round(baseCalculo),
      aliquotaIss: dados.aliquotaIss,
      valorIss: this.round(valorIss),
      valorIssRetido: this.round(valorIssRetido),
      valorPis: this.round(valorPis),
      valorCofins: this.round(valorCofins),
      valorInss: this.round(valorInss),
      valorIr: this.round(valorIr),
      valorCsll: this.round(valorCsll),
      valorLiquido: this.round(valorLiquido),
    };
  }

  /**
   * Arredonda para 2 casas decimais
   */
  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  /**
   * Gera código de verificação
   */
  private gerarCodigoVerificacao(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 8; i++) {
      codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return codigo;
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
      return empresas.map((e: any) => e.id);
    }

    if (user.tipo === TipoUsuario.CLIENTE) {
      const vinculos = await this.prisma.usuarioEmpresa.findMany({
        where: { usuarioId: user.id, ativo: true },
        select: { empresaId: true },
      });
      return vinculos.map((v: any) => v.empresaId);
    }

    const colaborador = await this.prisma.colaboradorEscritorio.findUnique({
      where: { usuarioId: user.id },
    });

    if (colaborador) {
      const empresas = await this.prisma.empresa.findMany({
        where: { escritorioId: colaborador.escritorioId },
        select: { id: true },
      });
      return empresas.map((e: any) => e.id);
    }

    return [];
  }
}
