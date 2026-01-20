import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BuscarMunicipiosDto } from './dto/buscar-municipios.dto';

@Injectable()
export class LocalidadesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lista todas as regiões
   */
  async listarRegioes() {
    return this.prisma.regiao.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  /**
   * Lista todos os estados
   */
  async listarEstados(regiaoId?: number) {
    return this.prisma.estado.findMany({
      where: regiaoId ? { regiaoId } : undefined,
      include: {
        regiao: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  /**
   * Busca um estado por ID ou sigla
   */
  async buscarEstado(idOuSigla: string | number) {
    if (typeof idOuSigla === 'number' || !isNaN(Number(idOuSigla))) {
      return this.prisma.estado.findUnique({
        where: { id: Number(idOuSigla) },
        include: { regiao: true },
      });
    }

    return this.prisma.estado.findUnique({
      where: { sigla: String(idOuSigla).toUpperCase() },
      include: { regiao: true },
    });
  }

  /**
   * Busca municípios com filtros e paginação
   */
  async buscarMunicipios(dto: BuscarMunicipiosDto) {
    const { termo, estadoId, uf, limit = 20 } = dto;

    const where: any = {};

    // Filtro por estado
    if (estadoId) {
      where.estadoId = estadoId;
    } else if (uf) {
      const estado = await this.prisma.estado.findUnique({
        where: { sigla: uf.toUpperCase() },
      });
      if (estado) {
        where.estadoId = estado.id;
      }
    }

    // Filtro por termo de busca
    if (termo) {
      where.nome = {
        contains: termo,
        mode: 'insensitive',
      };
    }

    const municipios = await this.prisma.municipio.findMany({
      where,
      include: {
        estado: {
          select: {
            id: true,
            sigla: true,
            nome: true,
          },
        },
      },
      orderBy: { nome: 'asc' },
      take: limit,
    });

    return municipios.map((m: any) => ({
      codigo: m.codigo,
      nome: m.nome,
      nomeCompleto: `${m.nome} - ${m.estado.sigla}`,
      estado: m.estado,
    }));
  }

  /**
   * Busca um município por código IBGE
   */
  async buscarMunicipioPorCodigo(codigo: number) {
    return this.prisma.municipio.findUnique({
      where: { codigo },
      include: {
        estado: {
          include: {
            regiao: true,
          },
        },
      },
    });
  }

  /**
   * Lista municípios de um estado
   */
  async listarMunicipiosPorEstado(estadoId: number) {
    return this.prisma.municipio.findMany({
      where: { estadoId },
      orderBy: { nome: 'asc' },
    });
  }

  /**
   * Estatísticas de localidades
   */
  async obterEstatisticas() {
    const [regioes, estados, municipios] = await Promise.all([
      this.prisma.regiao.count(),
      this.prisma.estado.count(),
      this.prisma.municipio.count(),
    ]);

    return {
      regioes,
      estados,
      municipios,
    };
  }
}
