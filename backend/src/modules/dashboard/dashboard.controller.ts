import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { FilterDashboardDto } from './dto/filter-dashboard.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '@prisma/client';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'dashboard',
  version: '1',
})
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('resumo')
  @ApiOperation({ summary: 'Resumo geral do dashboard' })
  @ApiResponse({ status: 200, description: 'Dados do resumo' })
  getResumo(
    @Query() dto: FilterDashboardDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.dashboardService.getResumo(dto, user);
  }

  @Get('financeiro')
  @ApiOperation({ summary: 'Resumo financeiro' })
  @ApiResponse({ status: 200, description: 'Dados financeiros' })
  getResumoFinanceiro(
    @Query() dto: FilterDashboardDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.dashboardService.getResumoFinanceiro(dto, user);
  }

  @Get('faturamento-mensal')
  @ApiOperation({ summary: 'Faturamento mensal (últimos 12 meses)' })
  @ApiResponse({ status: 200, description: 'Dados de faturamento mensal' })
  getFaturamentoMensal(
    @Query() dto: FilterDashboardDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.dashboardService.getFaturamentoMensal(dto, user);
  }

  @Get('alertas')
  @ApiOperation({ summary: 'Alertas do sistema' })
  @ApiResponse({ status: 200, description: 'Lista de alertas' })
  getAlertas(
    @Query() dto: FilterDashboardDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.dashboardService.getAlertas(dto, user);
  }

  @Get('ranking-empresas')
  @ApiOperation({ summary: 'Ranking de empresas por faturamento' })
  @ApiResponse({ status: 200, description: 'Ranking de empresas' })
  getRankingEmpresas(
    @Query() dto: FilterDashboardDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.dashboardService.getRankingEmpresas(dto, user);
  }

  @Get('estatisticas-guias')
  @ApiOperation({ summary: 'Estatísticas de guias por tipo' })
  @ApiResponse({ status: 200, description: 'Estatísticas de guias' })
  getEstatisticasGuias(
    @Query() dto: FilterDashboardDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.dashboardService.getEstatisticasGuias(dto, user);
  }
}
