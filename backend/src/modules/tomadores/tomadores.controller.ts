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
import { TomadoresService } from './tomadores.service';
import { CreateTomadorDto } from './dto/create-tomador.dto';
import { UpdateTomadorDto } from './dto/update-tomador.dto';
import { FilterTomadorDto } from './dto/filter-tomador.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '@prisma/client';

@ApiTags('Tomadores')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'tomadores',
  version: '1',
})
export class TomadoresController {
  constructor(private readonly tomadoresService: TomadoresService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo tomador de serviço' })
  @ApiResponse({ status: 201, description: 'Tomador criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'CPF/CNPJ já cadastrado para esta empresa' })
  create(
    @Body() dto: CreateTomadorDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.tomadoresService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tomadores' })
  @ApiResponse({ status: 200, description: 'Lista de tomadores paginada' })
  findAll(
    @Query() dto: FilterTomadorDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.tomadoresService.findAll(dto, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tomador por ID' })
  @ApiResponse({ status: 200, description: 'Dados do tomador' })
  @ApiResponse({ status: 404, description: 'Tomador não encontrado' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    return this.tomadoresService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tomador' })
  @ApiResponse({ status: 200, description: 'Tomador atualizado' })
  @ApiResponse({ status: 404, description: 'Tomador não encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTomadorDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.tomadoresService.update(id, dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover tomador' })
  @ApiResponse({ status: 200, description: 'Tomador removido' })
  @ApiResponse({ status: 404, description: 'Tomador não encontrado' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    return this.tomadoresService.remove(id, user);
  }
}
