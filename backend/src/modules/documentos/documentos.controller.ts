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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { DocumentosService } from './documentos.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { FilterDocumentoDto } from './dto/filter-documento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '@prisma/client';

@ApiTags('Documentos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'documentos',
  version: '1',
})
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('arquivo'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Fazer upload de documento' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        arquivo: {
          type: 'string',
          format: 'binary',
        },
        empresaId: { type: 'string' },
        tipo: { type: 'string' },
        titulo: { type: 'string' },
        descricao: { type: 'string' },
        documentoOriginalId: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Documento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateDocumentoDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.documentosService.create(dto, file, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar documentos' })
  @ApiResponse({ status: 200, description: 'Lista de documentos paginada' })
  findAll(
    @Query() dto: FilterDocumentoDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.documentosService.findAll(dto, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar documento por ID' })
  @ApiResponse({ status: 200, description: 'Dados do documento' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    return this.documentosService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar metadados do documento' })
  @ApiResponse({ status: 200, description: 'Documento atualizado' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDocumentoDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.documentosService.update(id, dto, user);
  }

  @Post(':id/arquivar')
  @ApiOperation({ summary: 'Arquivar documento' })
  @ApiResponse({ status: 200, description: 'Documento arquivado' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  arquivar(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    return this.documentosService.arquivar(id, user);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download do documento' })
  @ApiResponse({ status: 200, description: 'URL para download' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  download(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    return this.documentosService.download(id, user);
  }

  @Get(':id/historico')
  @ApiOperation({ summary: 'Histórico de acessos do documento' })
  @ApiResponse({ status: 200, description: 'Lista de acessos do documento' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  getHistorico(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    return this.documentosService.getHistorico(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover documento (soft delete)' })
  @ApiResponse({ status: 200, description: 'Documento removido' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    return this.documentosService.remove(id, user);
  }
}
