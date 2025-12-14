import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LocalidadesService } from './localidades.service';
import { BuscarMunicipiosDto } from './dto/buscar-municipios.dto';
import { Public } from '../../common/decorators/roles.decorator';

@ApiTags('Localidades')
@Controller({
  path: 'localidades',
  version: '1',
})
export class LocalidadesController {
  constructor(private readonly localidadesService: LocalidadesService) {}

  @Get('regioes')
  @Public()
  @ApiOperation({ summary: 'Listar todas as regiões do Brasil' })
  @ApiResponse({ status: 200, description: 'Lista de regiões' })
  async listarRegioes() {
    return this.localidadesService.listarRegioes();
  }

  @Get('estados')
  @Public()
  @ApiOperation({ summary: 'Listar todos os estados do Brasil' })
  @ApiQuery({
    name: 'regiaoId',
    required: false,
    type: Number,
    description: 'Filtrar por região',
  })
  @ApiResponse({ status: 200, description: 'Lista de estados' })
  async listarEstados(@Query('regiaoId') regiaoId?: number) {
    return this.localidadesService.listarEstados(regiaoId);
  }

  @Get('estados/:idOuSigla')
  @Public()
  @ApiOperation({ summary: 'Buscar estado por ID ou sigla' })
  @ApiResponse({ status: 200, description: 'Dados do estado' })
  @ApiResponse({ status: 404, description: 'Estado não encontrado' })
  async buscarEstado(@Param('idOuSigla') idOuSigla: string) {
    return this.localidadesService.buscarEstado(idOuSigla);
  }

  @Get('municipios')
  @Public()
  @ApiOperation({
    summary: 'Buscar municípios',
    description: 'Busca municípios por termo, estado ou UF. Ideal para autocomplete.',
  })
  @ApiResponse({ status: 200, description: 'Lista de municípios' })
  async buscarMunicipios(@Query() dto: BuscarMunicipiosDto) {
    return this.localidadesService.buscarMunicipios(dto);
  }

  @Get('municipios/:codigo')
  @Public()
  @ApiOperation({ summary: 'Buscar município por código IBGE' })
  @ApiResponse({ status: 200, description: 'Dados do município' })
  @ApiResponse({ status: 404, description: 'Município não encontrado' })
  async buscarMunicipio(@Param('codigo', ParseIntPipe) codigo: number) {
    return this.localidadesService.buscarMunicipioPorCodigo(codigo);
  }

  @Get('estados/:estadoId/municipios')
  @Public()
  @ApiOperation({ summary: 'Listar todos os municípios de um estado' })
  @ApiResponse({ status: 200, description: 'Lista de municípios do estado' })
  async listarMunicipiosPorEstado(
    @Param('estadoId', ParseIntPipe) estadoId: number,
  ) {
    return this.localidadesService.listarMunicipiosPorEstado(estadoId);
  }

  @Get('estatisticas')
  @Public()
  @ApiOperation({ summary: 'Obter estatísticas de localidades' })
  @ApiResponse({ status: 200, description: 'Estatísticas' })
  async obterEstatisticas() {
    return this.localidadesService.obterEstatisticas();
  }
}
