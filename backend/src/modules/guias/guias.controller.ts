import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { GuiasService } from './guias.service';
import { CreateGuiaDto } from './dto/create-guia.dto';
import { UpdateGuiaDto } from './dto/update-guia.dto';
import { FilterGuiaDto } from './dto/filter-guia.dto';
import { PagarGuiaDto } from './dto/pagar-guia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '@prisma/client';

@ApiTags('Guias')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'guias',
  version: '1',
})
export class GuiasController {
  constructor(private readonly guiasService: GuiasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova guia de imposto' })
  @ApiResponse({ status: 201, description: 'Guia criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(
    @Body() dto: CreateGuiaDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.guiasService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar guias' })
  @ApiResponse({ status: 200, description: 'Lista de guias paginada' })
  findAll(
    @Query() dto: FilterGuiaDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.guiasService.findAll(dto, user);
  }

  @Get('proximas-vencer')
  @ApiOperation({ summary: 'Listar guias próximas do vencimento' })
  @ApiQuery({ name: 'dias', description: 'Dias de antecedência', required: false })
  @ApiResponse({ status: 200, description: 'Lista de guias próximas do vencimento' })
  getProximasVencer(
    @Query('dias', new ParseIntPipe({ optional: true })) dias: number = 7,
    @CurrentUser() user: Usuario,
  ) {
    return this.guiasService.getProximasVencer(dias, user);
  }

  @Get('vencidas')
  @ApiOperation({ summary: 'Listar guias vencidas' })
  @ApiResponse({ status: 200, description: 'Lista de guias vencidas' })
  getVencidas(@CurrentUser() user: Usuario) {
    return this.guiasService.getVencidas(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar guia por ID' })
  @ApiResponse({ status: 200, description: 'Dados da guia' })
  @ApiResponse({ status: 404, description: 'Guia não encontrada' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    return this.guiasService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar guia' })
  @ApiResponse({ status: 200, description: 'Guia atualizada' })
  @ApiResponse({ status: 404, description: 'Guia não encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGuiaDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.guiasService.update(id, dto, user);
  }

  @Post(':id/pagar')
  @ApiOperation({ summary: 'Registrar pagamento da guia' })
  @ApiResponse({ status: 200, description: 'Pagamento registrado' })
  @ApiResponse({ status: 400, description: 'Guia não pode ser paga' })
  @ApiResponse({ status: 404, description: 'Guia não encontrada' })
  pagar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: PagarGuiaDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.guiasService.pagar(id, dto, user);
  }

  @Post(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar guia' })
  @ApiResponse({ status: 200, description: 'Guia cancelada' })
  @ApiResponse({ status: 400, description: 'Guia não pode ser cancelada' })
  @ApiResponse({ status: 404, description: 'Guia não encontrada' })
  cancelar(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    return this.guiasService.cancelar(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover guia' })
  @ApiResponse({ status: 200, description: 'Guia removida' })
  @ApiResponse({ status: 400, description: 'Guia não pode ser removida' })
  @ApiResponse({ status: 404, description: 'Guia não encontrada' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    return this.guiasService.remove(id, user);
  }
}
