import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ComunicacaoService } from './comunicacao.service';
import { ComunicacaoAdminController } from './controllers/comunicacao-admin.controller';
import { ComunicacaoClienteController } from './controllers/comunicacao-cliente.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ComunicacaoAdminController, ComunicacaoClienteController],
  providers: [ComunicacaoService],
  exports: [ComunicacaoService],
})
export class ComunicacaoModule {}
