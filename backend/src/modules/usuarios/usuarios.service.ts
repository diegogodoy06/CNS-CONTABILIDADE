import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { FilterUsuarioDto } from './dto/filter-usuario.dto';
import { createPaginatedResult } from '../../common/dto/pagination.dto';
import { Usuario, TipoUsuario, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo usuário
   */
  async create(dto: CreateUsuarioDto, currentUser: Usuario) {
    // Verifica permissões
    if (
      currentUser.tipo !== TipoUsuario.ADMIN_SISTEMA &&
      currentUser.tipo !== TipoUsuario.ADMIN_ESCRITORIO
    ) {
      throw new ForbiddenException('Sem permissão para criar usuários');
    }

    // Verifica se email já existe
    const existingEmail = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (existingEmail) {
      throw new ConflictException('E-mail já cadastrado');
    }

    // Verifica se CPF já existe (se fornecido)
    if (dto.cpf) {
      const existingCpf = await this.prisma.usuario.findUnique({
        where: { cpf: dto.cpf },
      });

      if (existingCpf) {
        throw new ConflictException('CPF já cadastrado');
      }
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(dto.senha, 10);

    // Cria o usuário
    const usuario = await this.prisma.usuario.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senhaHash,
        cpf: dto.cpf,
        telefone: dto.telefone,
        celular: dto.celular,
        tipo: dto.tipo,
        status: dto.status,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        telefone: true,
        celular: true,
        tipo: true,
        status: true,
        criadoEm: true,
      },
    });

    // Se for colaborador, cria registro de colaborador
    if (dto.tipo === TipoUsuario.COLABORADOR && dto.escritorioId) {
      await this.prisma.colaboradorEscritorio.create({
        data: {
          usuarioId: usuario.id,
          escritorioId: dto.escritorioId,
          cargo: dto.cargo,
          departamento: dto.departamento,
        },
      });
    }

    return usuario;
  }

  /**
   * Lista usuários com filtros e paginação
   */
  async findAll(dto: FilterUsuarioDto, currentUser: Usuario) {
    const where: Prisma.UsuarioWhereInput = {};

    // Filtros baseados no tipo de usuário atual
    if (currentUser.tipo === TipoUsuario.ADMIN_ESCRITORIO) {
      // Admin do escritório só vê colaboradores do seu escritório e clientes vinculados
      const colaborador = await this.prisma.colaboradorEscritorio.findUnique({
        where: { usuarioId: currentUser.id },
      });

      if (colaborador) {
        where.OR = [
          {
            colaborador: {
              escritorioId: colaborador.escritorioId,
            },
          },
          {
            empresas: {
              some: {
                empresa: {
                  escritorioId: colaborador.escritorioId,
                },
              },
            },
          },
        ];
      }
    } else if (currentUser.tipo !== TipoUsuario.ADMIN_SISTEMA) {
      throw new ForbiddenException('Sem permissão para listar usuários');
    }

    // Aplica filtros
    if (dto.tipo) {
      where.tipo = dto.tipo;
    }

    if (dto.status) {
      where.status = dto.status;
    }

    if (dto.escritorioId) {
      where.colaborador = {
        escritorioId: dto.escritorioId,
      };
    }

    if (dto.empresaId) {
      where.empresas = {
        some: {
          empresaId: dto.empresaId,
        },
      };
    }

    if (dto.busca) {
      where.OR = [
        { nome: { contains: dto.busca, mode: 'insensitive' } },
        { email: { contains: dto.busca, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.usuario.findMany({
        where,
        skip: dto.skip,
        take: dto.take,
        orderBy: dto.sortBy
          ? { [dto.sortBy]: dto.sortOrder }
          : { criadoEm: 'desc' },
        select: {
          id: true,
          nome: true,
          email: true,
          cpf: true,
          telefone: true,
          celular: true,
          avatarUrl: true,
          tipo: true,
          status: true,
          ultimoLogin: true,
          criadoEm: true,
          colaborador: {
            select: {
              cargo: true,
              departamento: true,
              escritorio: {
                select: {
                  id: true,
                  nomeFantasia: true,
                },
              },
            },
          },
          _count: {
            select: {
              empresas: true,
            },
          },
        },
      }),
      this.prisma.usuario.count({ where }),
    ]);

    return createPaginatedResult(items, total, dto);
  }

  /**
   * Busca usuário por ID
   */
  async findOne(id: string, currentUser: Usuario) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        telefone: true,
        celular: true,
        avatarUrl: true,
        tipo: true,
        status: true,
        emailVerificado: true,
        ultimoLogin: true,
        criadoEm: true,
        atualizadoEm: true,
        colaborador: {
          select: {
            id: true,
            cargo: true,
            departamento: true,
            dataAdmissao: true,
            escritorio: {
              select: {
                id: true,
                razaoSocial: true,
                nomeFantasia: true,
              },
            },
          },
        },
        empresas: {
          where: { ativo: true },
          select: {
            role: true,
            empresa: {
              select: {
                id: true,
                razaoSocial: true,
                nomeFantasia: true,
                cnpj: true,
              },
            },
          },
        },
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verifica permissão de acesso
    await this.checkAccess(usuario, currentUser);

    return usuario;
  }

  /**
   * Atualiza um usuário
   */
  async update(id: string, dto: UpdateUsuarioDto, currentUser: Usuario) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: { colaborador: true },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verifica permissão
    await this.checkAccess(usuario, currentUser);

    // Verifica email duplicado
    if (dto.email && dto.email !== usuario.email) {
      const existingEmail = await this.prisma.usuario.findUnique({
        where: { email: dto.email },
      });

      if (existingEmail) {
        throw new ConflictException('E-mail já cadastrado');
      }
    }

    // Verifica CPF duplicado
    if (dto.cpf && dto.cpf !== usuario.cpf) {
      const existingCpf = await this.prisma.usuario.findUnique({
        where: { cpf: dto.cpf },
      });

      if (existingCpf) {
        throw new ConflictException('CPF já cadastrado');
      }
    }

    // Prepara dados para atualização
    const updateData: Prisma.UsuarioUpdateInput = {
      nome: dto.nome,
      email: dto.email,
      cpf: dto.cpf,
      telefone: dto.telefone,
      celular: dto.celular,
      avatarUrl: dto.avatarUrl,
      status: dto.status,
    };

    // Se fornecida nova senha, faz hash
    if (dto.senha) {
      updateData.senhaHash = await bcrypt.hash(dto.senha, 10);
    }

    // Atualiza usuário
    const updated = await this.prisma.usuario.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        telefone: true,
        celular: true,
        avatarUrl: true,
        tipo: true,
        status: true,
        criadoEm: true,
        atualizadoEm: true,
      },
    });

    // Atualiza dados de colaborador se necessário
    if (usuario.colaborador && (dto.cargo || dto.departamento)) {
      await this.prisma.colaboradorEscritorio.update({
        where: { id: usuario.colaborador.id },
        data: {
          cargo: dto.cargo,
          departamento: dto.departamento,
        },
      });
    }

    return updated;
  }

  /**
   * Remove um usuário (soft delete via status)
   */
  async remove(id: string, currentUser: Usuario) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Não pode remover a si mesmo
    if (usuario.id === currentUser.id) {
      throw new ForbiddenException('Não é possível remover seu próprio usuário');
    }

    // Verifica permissão
    if (
      currentUser.tipo !== TipoUsuario.ADMIN_SISTEMA &&
      currentUser.tipo !== TipoUsuario.ADMIN_ESCRITORIO
    ) {
      throw new ForbiddenException('Sem permissão para remover usuários');
    }

    // Soft delete - marca como inativo
    return this.prisma.usuario.update({
      where: { id },
      data: { status: 'INATIVO' },
      select: {
        id: true,
        nome: true,
        status: true,
      },
    });
  }

  /**
   * Verifica permissão de acesso ao usuário
   */
  private async checkAccess(usuario: any, currentUser: Usuario) {
    // Admin do sistema pode tudo
    if (currentUser.tipo === TipoUsuario.ADMIN_SISTEMA) {
      return;
    }

    // Usuário pode acessar seu próprio perfil
    if (usuario.id === currentUser.id) {
      return;
    }

    // Admin do escritório pode acessar colaboradores do seu escritório
    if (currentUser.tipo === TipoUsuario.ADMIN_ESCRITORIO) {
      const colaborador = await this.prisma.colaboradorEscritorio.findUnique({
        where: { usuarioId: currentUser.id },
      });

      if (colaborador && usuario.colaborador?.escritorioId === colaborador.escritorioId) {
        return;
      }
    }

    throw new ForbiddenException('Sem permissão para acessar este usuário');
  }
}
