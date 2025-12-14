import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { FilterEmpresaDto } from './dto/filter-empresa.dto';
import { createPaginatedResult } from '../../common/dto/pagination.dto';
import { Usuario, TipoUsuario, StatusEmpresa } from '@prisma/client';

@Injectable()
export class EmpresasService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova empresa
   */
  async create(dto: CreateEmpresaDto, userId: string) {
    // Verifica se o usuário tem acesso ao escritório
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: { colaborador: true },
    });

    if (!user) {
      throw new ForbiddenException('Usuário não encontrado');
    }

    // Apenas admins e colaboradores do escritório podem criar empresas
    if (
      user.tipo !== TipoUsuario.ADMIN_SISTEMA &&
      user.tipo !== TipoUsuario.ADMIN_ESCRITORIO &&
      !user.colaborador
    ) {
      throw new ForbiddenException('Sem permissão para criar empresas');
    }

    const escritorioId =
      user.colaborador?.escritorioId || dto.escritorioId;

    if (!escritorioId) {
      throw new ForbiddenException('Escritório não informado');
    }

    return this.prisma.empresa.create({
      data: {
        escritorioId,
        razaoSocial: dto.razaoSocial,
        nomeFantasia: dto.nomeFantasia,
        cnpj: dto.cnpj,
        inscricaoEstadual: dto.inscricaoEstadual,
        inscricaoMunicipal: dto.inscricaoMunicipal,
        regimeTributario: dto.regimeTributario,
        ramoAtividade: dto.ramoAtividade,
        cnaePrincipal: dto.cnaePrincipal,
        dataAbertura: dto.dataAbertura ? new Date(dto.dataAbertura) : null,
        email: dto.email,
        telefone: dto.telefone,
        celular: dto.celular,
        logradouro: dto.logradouro,
        numero: dto.numero,
        complemento: dto.complemento,
        bairro: dto.bairro,
        cep: dto.cep,
        estadoId: dto.estadoId,
        municipioCodigo: dto.municipioCodigo,
        municipioPrestacaoCodigo: dto.municipioPrestacaoCodigo,
        codigoServico: dto.codigoServico,
        aliquotaIss: dto.aliquotaIss,
      },
      include: {
        estado: true,
        municipio: true,
        municipioPrestacao: true,
      },
    });
  }

  /**
   * Lista empresas com filtros e paginação
   */
  async findAll(dto: FilterEmpresaDto, user: Usuario) {
    const where: any = {};

    // Aplica filtros baseado no tipo de usuário
    if (user.tipo === TipoUsuario.CLIENTE) {
      // Cliente só vê suas próprias empresas
      where.usuarios = {
        some: {
          usuarioId: user.id,
          ativo: true,
        },
      };
    } else if (user.tipo === TipoUsuario.COLABORADOR) {
      // Colaborador vê empresas do escritório
      const colaborador = await this.prisma.colaboradorEscritorio.findUnique({
        where: { usuarioId: user.id },
      });
      if (colaborador) {
        where.escritorioId = colaborador.escritorioId;
      }
    } else if (user.tipo === TipoUsuario.ADMIN_ESCRITORIO) {
      // Admin do escritório vê todas do escritório
      const colaborador = await this.prisma.colaboradorEscritorio.findUnique({
        where: { usuarioId: user.id },
      });
      if (colaborador) {
        where.escritorioId = colaborador.escritorioId;
      }
    }
    // ADMIN_SISTEMA vê todas

    // Filtros adicionais
    if (dto.escritorioId) {
      where.escritorioId = dto.escritorioId;
    }

    if (dto.status) {
      where.status = dto.status;
    }

    if (dto.regimeTributario) {
      where.regimeTributario = dto.regimeTributario;
    }

    if (dto.search) {
      where.OR = [
        { razaoSocial: { contains: dto.search, mode: 'insensitive' } },
        { nomeFantasia: { contains: dto.search, mode: 'insensitive' } },
        { cnpj: { contains: dto.search } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.empresa.findMany({
        where,
        include: {
          escritorio: {
            select: { id: true, razaoSocial: true, nomeFantasia: true },
          },
          estado: { select: { id: true, sigla: true, nome: true } },
          municipio: { select: { codigo: true, nome: true } },
        },
        orderBy: { [dto.sortBy || 'razaoSocial']: dto.sortOrder || 'asc' },
        skip: dto.skip,
        take: dto.take,
      }),
      this.prisma.empresa.count({ where }),
    ]);

    return createPaginatedResult(items, total, dto);
  }

  /**
   * Busca uma empresa por ID
   */
  async findOne(id: string, user: Usuario) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id },
      include: {
        escritorio: true,
        estado: true,
        municipio: true,
        municipioPrestacao: true,
        usuarios: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        obrigacoes: {
          include: {
            obrigacao: true,
          },
        },
      },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    // Verifica permissão de acesso
    await this.verificarPermissao(empresa, user);

    return empresa;
  }

  /**
   * Atualiza uma empresa
   */
  async update(id: string, dto: UpdateEmpresaDto, user: Usuario) {
    const empresa = await this.findOne(id, user);

    return this.prisma.empresa.update({
      where: { id },
      data: {
        razaoSocial: dto.razaoSocial,
        nomeFantasia: dto.nomeFantasia,
        inscricaoEstadual: dto.inscricaoEstadual,
        inscricaoMunicipal: dto.inscricaoMunicipal,
        regimeTributario: dto.regimeTributario,
        ramoAtividade: dto.ramoAtividade,
        cnaePrincipal: dto.cnaePrincipal,
        dataAbertura: dto.dataAbertura ? new Date(dto.dataAbertura) : undefined,
        email: dto.email,
        telefone: dto.telefone,
        celular: dto.celular,
        logradouro: dto.logradouro,
        numero: dto.numero,
        complemento: dto.complemento,
        bairro: dto.bairro,
        cep: dto.cep,
        estadoId: dto.estadoId,
        municipioCodigo: dto.municipioCodigo,
        municipioPrestacaoCodigo: dto.municipioPrestacaoCodigo,
        codigoServico: dto.codigoServico,
        aliquotaIss: dto.aliquotaIss,
        status: dto.status,
      },
      include: {
        estado: true,
        municipio: true,
        municipioPrestacao: true,
      },
    });
  }

  /**
   * Remove (desativa) uma empresa
   */
  async remove(id: string, user: Usuario) {
    await this.findOne(id, user);

    // Soft delete - apenas muda o status
    return this.prisma.empresa.update({
      where: { id },
      data: { status: StatusEmpresa.BAIXADA },
    });
  }

  /**
   * Verifica se o usuário tem permissão para acessar a empresa
   */
  private async verificarPermissao(empresa: any, user: Usuario) {
    // Admin do sistema tem acesso total
    if (user.tipo === TipoUsuario.ADMIN_SISTEMA) {
      return true;
    }

    // Admin/Colaborador do escritório
    if (
      user.tipo === TipoUsuario.ADMIN_ESCRITORIO ||
      user.tipo === TipoUsuario.COLABORADOR
    ) {
      const colaborador = await this.prisma.colaboradorEscritorio.findUnique({
        where: { usuarioId: user.id },
      });

      if (colaborador?.escritorioId === empresa.escritorioId) {
        return true;
      }
    }

    // Cliente - verifica vínculo com a empresa
    const vinculo = await this.prisma.usuarioEmpresa.findFirst({
      where: {
        usuarioId: user.id,
        empresaId: empresa.id,
        ativo: true,
      },
    });

    if (vinculo) {
      return true;
    }

    throw new ForbiddenException('Sem permissão para acessar esta empresa');
  }
}
