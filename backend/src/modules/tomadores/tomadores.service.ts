import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTomadorDto } from './dto/create-tomador.dto';
import { UpdateTomadorDto } from './dto/update-tomador.dto';
import { FilterTomadorDto } from './dto/filter-tomador.dto';
import { createPaginatedResult } from '../../common/dto/pagination.dto';
import { Usuario, TipoUsuario, Prisma } from '@prisma/client';

@Injectable()
export class TomadoresService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo tomador
   */
  async create(dto: CreateTomadorDto, currentUser: Usuario) {
    // Verifica acesso à empresa
    await this.checkEmpresaAccess(dto.empresaId, currentUser);

    // Verifica se CPF/CNPJ já existe para esta empresa
    const existing = await this.prisma.tomador.findUnique({
      where: {
        empresaId_cpfCnpj: {
          empresaId: dto.empresaId,
          cpfCnpj: dto.cpfCnpj,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Tomador com este CPF/CNPJ já cadastrado para esta empresa');
    }

    return this.prisma.tomador.create({
      data: {
        empresaId: dto.empresaId,
        tipoPessoa: dto.tipoPessoa,
        cpfCnpj: dto.cpfCnpj,
        razaoSocial: dto.razaoSocial,
        nomeFantasia: dto.nomeFantasia,
        inscricaoEstadual: dto.inscricaoEstadual,
        inscricaoMunicipal: dto.inscricaoMunicipal,
        email: dto.email,
        telefone: dto.telefone,
        logradouro: dto.logradouro,
        numero: dto.numero,
        complemento: dto.complemento,
        bairro: dto.bairro,
        cep: dto.cep,
        estadoId: dto.estadoId,
        municipioCodigo: dto.municipioCodigo,
        observacoes: dto.observacoes,
        tags: dto.tags,
      },
      include: {
        estado: true,
        municipio: true,
      },
    });
  }

  /**
   * Lista tomadores com filtros e paginação
   */
  async findAll(dto: FilterTomadorDto, currentUser: Usuario) {
    const where: Prisma.TomadorWhereInput = {};

    // Filtro obrigatório por empresa (exceto admin sistema)
    if (dto.empresaId) {
      await this.checkEmpresaAccess(dto.empresaId, currentUser);
      where.empresaId = dto.empresaId;
    } else {
      // Busca empresas acessíveis pelo usuário
      const empresasIds = await this.getEmpresasAcessiveis(currentUser);
      where.empresaId = { in: empresasIds };
    }

    // Filtros opcionais
    if (dto.tipoPessoa) {
      where.tipoPessoa = dto.tipoPessoa;
    }

    if (dto.cpfCnpj) {
      where.cpfCnpj = dto.cpfCnpj;
    }

    if (dto.ativo !== undefined) {
      where.ativo = dto.ativo;
    }

    if (dto.busca) {
      where.OR = [
        { razaoSocial: { contains: dto.busca, mode: 'insensitive' } },
        { nomeFantasia: { contains: dto.busca, mode: 'insensitive' } },
        { cpfCnpj: { contains: dto.busca } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.tomador.findMany({
        where,
        skip: dto.skip,
        take: dto.take,
        orderBy: dto.sortBy
          ? { [dto.sortBy]: dto.sortOrder }
          : { razaoSocial: 'asc' },
        include: {
          empresa: {
            select: {
              id: true,
              razaoSocial: true,
              nomeFantasia: true,
            },
          },
          estado: true,
          municipio: true,
          _count: {
            select: {
              notasFiscais: true,
            },
          },
        },
      }),
      this.prisma.tomador.count({ where }),
    ]);

    return createPaginatedResult(items, total, dto);
  }

  /**
   * Busca tomador por ID
   */
  async findOne(id: string, currentUser: Usuario) {
    const tomador = await this.prisma.tomador.findUnique({
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
        estado: true,
        municipio: true,
        notasFiscais: {
          take: 10,
          orderBy: { dataEmissao: 'desc' },
          select: {
            id: true,
            numero: true,
            dataEmissao: true,
            valorServico: true,
            status: true,
          },
        },
      },
    });

    if (!tomador) {
      throw new NotFoundException('Tomador não encontrado');
    }

    await this.checkEmpresaAccess(tomador.empresaId, currentUser);

    return tomador;
  }

  /**
   * Atualiza um tomador
   */
  async update(id: string, dto: UpdateTomadorDto, currentUser: Usuario) {
    const tomador = await this.prisma.tomador.findUnique({
      where: { id },
    });

    if (!tomador) {
      throw new NotFoundException('Tomador não encontrado');
    }

    await this.checkEmpresaAccess(tomador.empresaId, currentUser);

    // Verifica duplicidade de CPF/CNPJ
    if (dto.cpfCnpj && dto.cpfCnpj !== tomador.cpfCnpj) {
      const existing = await this.prisma.tomador.findUnique({
        where: {
          empresaId_cpfCnpj: {
            empresaId: tomador.empresaId,
            cpfCnpj: dto.cpfCnpj,
          },
        },
      });

      if (existing) {
        throw new ConflictException('Tomador com este CPF/CNPJ já cadastrado para esta empresa');
      }
    }

    return this.prisma.tomador.update({
      where: { id },
      data: {
        tipoPessoa: dto.tipoPessoa,
        cpfCnpj: dto.cpfCnpj,
        razaoSocial: dto.razaoSocial,
        nomeFantasia: dto.nomeFantasia,
        inscricaoEstadual: dto.inscricaoEstadual,
        inscricaoMunicipal: dto.inscricaoMunicipal,
        email: dto.email,
        telefone: dto.telefone,
        logradouro: dto.logradouro,
        numero: dto.numero,
        complemento: dto.complemento,
        bairro: dto.bairro,
        cep: dto.cep,
        estadoId: dto.estadoId,
        municipioCodigo: dto.municipioCodigo,
        observacoes: dto.observacoes,
        tags: dto.tags,
        ativo: dto.ativo,
      },
      include: {
        estado: true,
        municipio: true,
      },
    });
  }

  /**
   * Remove um tomador (soft delete)
   */
  async remove(id: string, currentUser: Usuario) {
    const tomador = await this.prisma.tomador.findUnique({
      where: { id },
      include: {
        _count: {
          select: { notasFiscais: true },
        },
      },
    });

    if (!tomador) {
      throw new NotFoundException('Tomador não encontrado');
    }

    await this.checkEmpresaAccess(tomador.empresaId, currentUser);

    // Se tem notas fiscais, apenas desativa
    if (tomador._count.notasFiscais > 0) {
      return this.prisma.tomador.update({
        where: { id },
        data: { ativo: false },
      });
    }

    // Senão, pode excluir
    return this.prisma.tomador.delete({
      where: { id },
    });
  }

  /**
   * Verifica se usuário tem acesso à empresa
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
      empresa.escritorio.colaboradores.length > 0 ||
      user.tipo === TipoUsuario.ADMIN_ESCRITORIO;

    if (!hasAccess) {
      throw new ForbiddenException('Sem acesso a esta empresa');
    }
  }

  /**
   * Retorna IDs das empresas acessíveis pelo usuário
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

    // Colaborador ou admin escritório
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
