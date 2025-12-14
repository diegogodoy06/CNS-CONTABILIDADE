import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { FilterDocumentoDto } from './dto/filter-documento.dto';
import { createPaginatedResult } from '../../common/dto/pagination.dto';
import { Usuario, TipoUsuario, StatusDocumento, Prisma } from '@prisma/client';
import * as crypto from 'crypto';

interface FileInfo {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  path?: string;
}

@Injectable()
export class DocumentosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo documento com arquivo
   */
  async create(dto: CreateDocumentoDto, file: FileInfo, currentUser: Usuario) {
    await this.checkEmpresaAccess(dto.empresaId, currentUser);

    // Validação do arquivo
    if (!file) {
      throw new BadRequestException('Arquivo é obrigatório');
    }

    // Gera hash do arquivo
    const hashArquivo = crypto
      .createHash('sha256')
      .update(file.buffer)
      .digest('hex');

    // Caminho do arquivo (em produção, seria S3, Azure Blob, etc.)
    const caminhoArquivo = `/uploads/documentos/${dto.empresaId}/${Date.now()}_${file.originalname}`;

    // Calcula versão
    let versao = 1;
    if (dto.documentoOriginalId) {
      const docOriginal = await this.prisma.documento.findUnique({
        where: { id: dto.documentoOriginalId },
        include: {
          versoes: {
            orderBy: { versao: 'desc' },
            take: 1,
          },
        },
      });

      if (docOriginal) {
        versao = (docOriginal.versoes[0]?.versao || docOriginal.versao) + 1;
      }
    }

    const documento = await this.prisma.documento.create({
      data: {
        empresaId: dto.empresaId,
        tipo: dto.tipo,
        titulo: dto.titulo,
        descricao: dto.descricao,
        nomeArquivo: file.originalname,
        caminhoArquivo,
        tamanhoBytes: BigInt(file.size),
        mimeType: file.mimetype,
        hashArquivo,
        versao,
        documentoOriginalId: dto.documentoOriginalId,
        status: StatusDocumento.ATIVO,
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

    // Registra acesso
    await this.registrarAcesso(documento.id, currentUser.id, 'CREATE');

    return {
      ...documento,
      tamanhoBytes: documento.tamanhoBytes.toString(),
    };
  }

  /**
   * Lista documentos com filtros e paginação
   */
  async findAll(dto: FilterDocumentoDto, currentUser: Usuario) {
    const where: Prisma.DocumentoWhereInput = {};

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
    } else {
      // Por padrão, não mostra excluídos
      where.status = { not: StatusDocumento.EXCLUIDO };
    }

    if (dto.busca) {
      where.OR = [
        { titulo: { contains: dto.busca, mode: 'insensitive' } },
        { descricao: { contains: dto.busca, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.documento.findMany({
        where,
        skip: dto.skip,
        take: dto.take,
        orderBy: dto.sortBy
          ? { [dto.sortBy]: dto.sortOrder }
          : { criadoEm: 'desc' },
        include: {
          empresa: {
            select: {
              id: true,
              razaoSocial: true,
              nomeFantasia: true,
            },
          },
          _count: {
            select: {
              versoes: true,
            },
          },
        },
      }),
      this.prisma.documento.count({ where }),
    ]);

    // Converte BigInt para string
    const itemsFormatted = items.map((item) => ({
      ...item,
      tamanhoBytes: item.tamanhoBytes.toString(),
    }));

    return createPaginatedResult(itemsFormatted, total, dto);
  }

  /**
   * Busca documento por ID
   */
  async findOne(id: string, currentUser: Usuario) {
    const documento = await this.prisma.documento.findUnique({
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
        documentoOriginal: {
          select: {
            id: true,
            titulo: true,
            versao: true,
          },
        },
        versoes: {
          orderBy: { versao: 'desc' },
          select: {
            id: true,
            titulo: true,
            versao: true,
            criadoEm: true,
            nomeArquivo: true,
          },
        },
        acessos: {
          take: 10,
          orderBy: { criadoEm: 'desc' },
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    if (!documento) {
      throw new NotFoundException('Documento não encontrado');
    }

    await this.checkEmpresaAccess(documento.empresaId, currentUser);

    // Registra acesso de leitura
    await this.registrarAcesso(documento.id, currentUser.id, 'READ');

    return {
      ...documento,
      tamanhoBytes: documento.tamanhoBytes.toString(),
    };
  }

  /**
   * Atualiza metadados do documento
   */
  async update(id: string, dto: UpdateDocumentoDto, currentUser: Usuario) {
    const documento = await this.prisma.documento.findUnique({
      where: { id },
    });

    if (!documento) {
      throw new NotFoundException('Documento não encontrado');
    }

    if (documento.status === StatusDocumento.EXCLUIDO) {
      throw new BadRequestException('Documento excluído não pode ser editado');
    }

    await this.checkEmpresaAccess(documento.empresaId, currentUser);

    const updated = await this.prisma.documento.update({
      where: { id },
      data: {
        tipo: dto.tipo,
        titulo: dto.titulo,
        descricao: dto.descricao,
        status: dto.status,
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

    // Registra acesso
    await this.registrarAcesso(documento.id, currentUser.id, 'UPDATE');

    return {
      ...updated,
      tamanhoBytes: updated.tamanhoBytes.toString(),
    };
  }

  /**
   * Arquiva um documento
   */
  async arquivar(id: string, currentUser: Usuario) {
    const documento = await this.prisma.documento.findUnique({
      where: { id },
    });

    if (!documento) {
      throw new NotFoundException('Documento não encontrado');
    }

    await this.checkEmpresaAccess(documento.empresaId, currentUser);

    return this.prisma.documento.update({
      where: { id },
      data: { status: StatusDocumento.ARQUIVADO },
    });
  }

  /**
   * Remove um documento (soft delete)
   */
  async remove(id: string, currentUser: Usuario) {
    const documento = await this.prisma.documento.findUnique({
      where: { id },
    });

    if (!documento) {
      throw new NotFoundException('Documento não encontrado');
    }

    await this.checkEmpresaAccess(documento.empresaId, currentUser);

    // Soft delete
    const deleted = await this.prisma.documento.update({
      where: { id },
      data: { status: StatusDocumento.EXCLUIDO },
    });

    // Registra acesso
    await this.registrarAcesso(documento.id, currentUser.id, 'DELETE');

    return deleted;
  }

  /**
   * Faz download do documento
   */
  async download(id: string, currentUser: Usuario) {
    const documento = await this.prisma.documento.findUnique({
      where: { id },
    });

    if (!documento) {
      throw new NotFoundException('Documento não encontrado');
    }

    if (documento.status === StatusDocumento.EXCLUIDO) {
      throw new BadRequestException('Documento não disponível');
    }

    await this.checkEmpresaAccess(documento.empresaId, currentUser);

    // Registra acesso de download
    await this.registrarAcesso(documento.id, currentUser.id, 'DOWNLOAD');

    // Em produção, retornaria URL assinada do S3 ou similar
    return {
      url: documento.caminhoArquivo,
      nomeArquivo: documento.nomeArquivo,
      mimeType: documento.mimeType,
    };
  }

  /**
   * Registra acesso ao documento
   */
  private async registrarAcesso(documentoId: string, usuarioId: string, acao: string) {
    await this.prisma.acessoDocumento.create({
      data: {
        documentoId,
        usuarioId,
        acao,
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
