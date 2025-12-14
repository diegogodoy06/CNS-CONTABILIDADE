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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotasFiscaisService } from './notas-fiscais.service';
import { CreateNotaFiscalDto } from './dto/create-nota-fiscal.dto';
import { UpdateNotaFiscalDto } from './dto/update-nota-fiscal.dto';
import { FilterNotaFiscalDto } from './dto/filter-nota-fiscal.dto';
import { CancelarNotaFiscalDto } from './dto/cancelar-nota-fiscal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '@prisma/client';

@ApiTags('Notas Fiscais')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'notas-fiscais',
  version: '1',
})
export class NotasFiscaisController {
  constructor(private readonly notasFiscaisService: NotasFiscaisService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova nota fiscal (rascunho)' })
  @ApiResponse({ status: 201, description: 'Nota fiscal criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(
    @Body() dto: CreateNotaFiscalDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.notasFiscaisService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar notas fiscais' })
  @ApiResponse({ status: 200, description: 'Lista de notas fiscais paginada' })
  findAll(
    @Query() dto: FilterNotaFiscalDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.notasFiscaisService.findAll(dto, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar nota fiscal por ID' })
  @ApiResponse({ status: 200, description: 'Dados da nota fiscal' })
  @ApiResponse({ status: 404, description: 'Nota fiscal não encontrada' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    return this.notasFiscaisService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar nota fiscal (apenas rascunhos)' })
  @ApiResponse({ status: 200, description: 'Nota fiscal atualizada' })
  @ApiResponse({ status: 400, description: 'Nota não está em rascunho' })
  @ApiResponse({ status: 404, description: 'Nota fiscal não encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNotaFiscalDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.notasFiscaisService.update(id, dto, user);
  }

  @Post(':id/emitir')
  @ApiOperation({ summary: 'Emitir nota fiscal' })
  @ApiResponse({ status: 200, description: 'Nota fiscal emitida' })
  @ApiResponse({ status: 400, description: 'Nota não está em rascunho' })
  @ApiResponse({ status: 404, description: 'Nota fiscal não encontrada' })
  emitir(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    return this.notasFiscaisService.emitir(id, user);
  }

  @Post(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar nota fiscal' })
  @ApiResponse({ status: 200, description: 'Nota fiscal cancelada' })
  @ApiResponse({ status: 400, description: 'Nota não pode ser cancelada' })
  @ApiResponse({ status: 404, description: 'Nota fiscal não encontrada' })
  cancelar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CancelarNotaFiscalDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.notasFiscaisService.cancelar(id, dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover nota fiscal (apenas rascunhos)' })
  @ApiResponse({ status: 200, description: 'Nota fiscal removida' })
  @ApiResponse({ status: 400, description: 'Nota não está em rascunho' })
  @ApiResponse({ status: 404, description: 'Nota fiscal não encontrada' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    return this.notasFiscaisService.remove(id, user);
  }
}
