import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TipoUsuario } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AuditoriaService } from '../auditoria.service';
import { FiltroAuditoriaDto } from '../dto';

@ApiTags('Admin - Auditoria')
@ApiBearerAuth()
@Controller('admin/auditoria')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TipoUsuario.ADMIN_SISTEMA, TipoUsuario.ADMIN_ESCRITORIO)
export class AuditoriaController {
  constructor(private auditoriaService: AuditoriaService) {}

  @Get('logs')
  @ApiOperation({ summary: 'Listar logs de auditoria com filtros' })
  async listarLogs(@Query() filtros: FiltroAuditoriaDto) {
    return this.auditoriaService.listarLogs(filtros);
  }

  @Get('logs/login')
  @ApiOperation({ summary: 'Listar logs de login/logout' })
  async logsLogin(
    @Query('pagina') pagina?: number,
    @Query('limite') limite?: number,
  ) {
    return this.auditoriaService.logsLogin(pagina, limite);
  }

  @Get('logs/:id')
  @ApiOperation({ summary: 'Buscar log por ID' })
  async buscarLog(@Param('id') id: string) {
    return this.auditoriaService.buscarLog(id);
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Estatísticas de auditoria' })
  async estatisticas(
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.auditoriaService.estatisticas(
      dataInicio ? new Date(dataInicio) : undefined,
      dataFim ? new Date(dataFim) : undefined,
    );
  }
}
