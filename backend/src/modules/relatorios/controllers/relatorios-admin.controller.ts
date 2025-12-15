import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TipoUsuario } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RelatoriosService } from '../relatorios.service';
import { FiltroRelatorioDto, GerarRelatorioDto } from '../dto';

@ApiTags('Admin - Relatórios')
@ApiBearerAuth()
@Controller('admin/relatorios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TipoUsuario.ADMIN_SISTEMA, TipoUsuario.ADMIN_ESCRITORIO, TipoUsuario.COLABORADOR)
export class RelatoriosAdminController {
  constructor(private relatoriosService: RelatoriosService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard consolidado do sistema' })
  async dashboard() {
    return this.relatoriosService.dashboardAdmin();
  }

  @Post('gerar')
  @ApiOperation({ summary: 'Gerar relatório por tipo' })
  async gerarRelatorio(@Body() dto: GerarRelatorioDto) {
    return this.relatoriosService.gerarRelatorio(dto);
  }

  @Get('faturamento')
  @ApiOperation({ summary: 'Relatório de faturamento' })
  async faturamento(@Query() filtros: FiltroRelatorioDto) {
    return this.relatoriosService.relatorioFaturamento(filtros);
  }

  @Get('impostos')
  @ApiOperation({ summary: 'Relatório de impostos' })
  async impostos(@Query() filtros: FiltroRelatorioDto) {
    return this.relatoriosService.relatorioImpostos(filtros);
  }

  @Get('notas-emitidas')
  @ApiOperation({ summary: 'Relatório de notas emitidas' })
  async notasEmitidas(@Query() filtros: FiltroRelatorioDto) {
    return this.relatoriosService.relatorioNotasEmitidas(filtros);
  }

  @Get('guias')
  @ApiOperation({ summary: 'Relatório de guias geradas' })
  async guias(@Query() filtros: FiltroRelatorioDto) {
    return this.relatoriosService.relatorioGuias(filtros);
  }
}
