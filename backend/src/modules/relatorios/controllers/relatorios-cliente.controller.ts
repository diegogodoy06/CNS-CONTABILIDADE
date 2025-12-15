import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TipoUsuario } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RelatoriosService } from '../relatorios.service';
import { FiltroRelatorioDto } from '../dto';

@ApiTags('Cliente - Relatórios')
@ApiBearerAuth()
@Controller('cliente/relatorios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TipoUsuario.CLIENTE)
export class RelatoriosClienteController {
  constructor(private relatoriosService: RelatoriosService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard da empresa do cliente' })
  async dashboard(@Req() req: any) {
    const empresaId = req.user.empresaAtiva;
    if (!empresaId) {
      throw new BadRequestException('Empresa não selecionada');
    }
    return this.relatoriosService.dashboardCliente(empresaId);
  }

  @Get('faturamento')
  @ApiOperation({ summary: 'Relatório de faturamento da empresa' })
  async faturamento(@Req() req: any, @Query() filtros: FiltroRelatorioDto) {
    const empresaId = req.user.empresaAtiva;
    if (!empresaId) {
      throw new BadRequestException('Empresa não selecionada');
    }
    return this.relatoriosService.relatorioFaturamento({
      ...filtros,
      empresaId,
    });
  }

  @Get('impostos')
  @ApiOperation({ summary: 'Relatório de impostos da empresa' })
  async impostos(@Req() req: any, @Query() filtros: FiltroRelatorioDto) {
    const empresaId = req.user.empresaAtiva;
    if (!empresaId) {
      throw new BadRequestException('Empresa não selecionada');
    }
    return this.relatoriosService.relatorioImpostos({
      ...filtros,
      empresaId,
    });
  }

  @Get('notas-emitidas')
  @ApiOperation({ summary: 'Relatório de notas emitidas pela empresa' })
  async notasEmitidas(@Req() req: any, @Query() filtros: FiltroRelatorioDto) {
    const empresaId = req.user.empresaAtiva;
    if (!empresaId) {
      throw new BadRequestException('Empresa não selecionada');
    }
    return this.relatoriosService.relatorioNotasEmitidas({
      ...filtros,
      empresaId,
    });
  }

  @Get('guias')
  @ApiOperation({ summary: 'Relatório de guias da empresa' })
  async guias(@Req() req: any, @Query() filtros: FiltroRelatorioDto) {
    const empresaId = req.user.empresaAtiva;
    if (!empresaId) {
      throw new BadRequestException('Empresa não selecionada');
    }
    return this.relatoriosService.relatorioGuias({
      ...filtros,
      empresaId,
    });
  }
}
