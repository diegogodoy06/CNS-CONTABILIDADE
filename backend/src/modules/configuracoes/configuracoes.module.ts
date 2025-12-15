import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfiguracoesService } from './configuracoes.service';
import { ConfiguracoesAdminController } from './controllers/configuracoes-admin.controller';
import { ConfiguracoesClienteController } from './controllers/configuracoes-cliente.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ConfiguracoesAdminController, ConfiguracoesClienteController],
  providers: [ConfiguracoesService],
  exports: [ConfiguracoesService],
})
export class ConfiguracoesModule {}
