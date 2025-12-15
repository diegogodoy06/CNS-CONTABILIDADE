import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  AtualizarEscritorioDto,
  AtualizarPerfilDto,
  AlterarSenhaDto,
} from './dto';

@Injectable()
export class ConfiguracoesService {
  constructor(private prisma: PrismaService) {}

  // ==================== ESCRITÓRIO ====================

  /**
   * Busca dados do escritório
   */
  async buscarEscritorio(escritorioId: string) {
    const escritorio = await this.prisma.escritorio.findUnique({
      where: { id: escritorioId },
    });

    if (!escritorio) {
      throw new NotFoundException('Escritório não encontrado');
    }

    return escritorio;
  }

  /**
   * Atualiza dados do escritório
   */
  async atualizarEscritorio(escritorioId: string, dto: AtualizarEscritorioDto) {
    return this.prisma.escritorio.update({
      where: { id: escritorioId },
      data: {
        nomeFantasia: dto.nomeFantasia,
        cnpj: dto.cnpj,
        telefone: dto.telefone,
        email: dto.email,
        logoUrl: dto.logoUrl,
      },
    });
  }

  // ==================== USUÁRIO ====================

  /**
   * Busca perfil do usuário
   */
  async buscarPerfil(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        avatarUrl: true,
        tipo: true,
        status: true,
        criadoEm: true,
        atualizadoEm: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  /**
   * Atualiza perfil do usuário
   */
  async atualizarPerfil(usuarioId: string, dto: AtualizarPerfilDto) {
    return this.prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        nome: dto.nome,
        telefone: dto.telefone,
        avatarUrl: dto.avatarUrl,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        avatarUrl: true,
      },
    });
  }

  /**
   * Altera senha do usuário
   */
  async alterarSenha(usuarioId: string, dto: AlterarSenhaDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, senhaHash: true },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verifica senha atual
    const senhaValida = await bcrypt.compare(dto.senhaAtual, usuario.senhaHash);
    if (!senhaValida) {
      throw new BadRequestException('Senha atual incorreta');
    }

    // Hash da nova senha
    const novaSenhaHash = await bcrypt.hash(dto.novaSenha, 10);

    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { senhaHash: novaSenhaHash },
    });

    return { message: 'Senha alterada com sucesso' };
  }

  // ==================== EMPRESAS DO CLIENTE ====================

  /**
   * Lista empresas vinculadas ao usuário cliente
   */
  async listarEmpresasCliente(usuarioId: string) {
    const vinculos = await this.prisma.usuarioEmpresa.findMany({
      where: { usuarioId },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
            status: true,
          },
        },
      },
    });

    return vinculos.map((v) => ({
      ...v.empresa,
      role: v.role,
    }));
  }

  /**
   * Seleciona empresa ativa para o cliente
   */
  async selecionarEmpresa(usuarioId: string, empresaId: string) {
    // Verifica se o usuário tem acesso à empresa
    const vinculo = await this.prisma.usuarioEmpresa.findUnique({
      where: {
        usuarioId_empresaId: {
          usuarioId,
          empresaId,
        },
      },
    });

    if (!vinculo) {
      throw new BadRequestException('Você não tem acesso a esta empresa');
    }

    return {
      empresaId,
      message: 'Empresa selecionada com sucesso',
    };
  }

  // ==================== COLABORADORES (ADMIN) ====================

  /**
   * Lista colaboradores do escritório
   */
  async listarColaboradores(escritorioId: string) {
    const colaboradores = await this.prisma.colaboradorEscritorio.findMany({
      where: {
        escritorioId,
        ativo: true,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            tipo: true,
            telefone: true,
            criadoEm: true,
          },
        },
      },
      orderBy: { usuario: { nome: 'asc' } },
    });

    return colaboradores.map((c) => ({
      ...c.usuario,
      cargo: c.cargo,
      departamento: c.departamento,
    }));
  }

  /**
   * Desativa colaborador
   */
  async desativarColaborador(colaboradorId: string, escritorioId: string) {
    const colaborador = await this.prisma.colaboradorEscritorio.findFirst({
      where: {
        id: colaboradorId,
        escritorioId,
      },
    });

    if (!colaborador) {
      throw new NotFoundException('Colaborador não encontrado');
    }

    return this.prisma.colaboradorEscritorio.update({
      where: { id: colaboradorId },
      data: { ativo: false },
    });
  }

  // ==================== ESTATÍSTICAS ====================

  /**
   * Estatísticas do sistema (Admin)
   */
  async estatisticasSistema() {
    const [
      totalEmpresas,
      totalUsuarios,
      empresasAtivas,
      usuariosAtivos,
    ] = await Promise.all([
      this.prisma.empresa.count(),
      this.prisma.usuario.count(),
      this.prisma.empresa.count({ where: { status: 'ATIVA' } }),
      this.prisma.usuario.count({ where: { status: 'ATIVO' } }),
    ]);

    return {
      totalEmpresas,
      totalUsuarios,
      empresasAtivas,
      usuariosAtivos,
      taxaAtivacaoEmpresas: totalEmpresas > 0 
        ? ((empresasAtivas / totalEmpresas) * 100).toFixed(1) 
        : 0,
      taxaAtivacaoUsuarios: totalUsuarios > 0 
        ? ((usuariosAtivos / totalUsuarios) * 100).toFixed(1) 
        : 0,
    };
  }
}
