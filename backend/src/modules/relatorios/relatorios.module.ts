import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { RelatoriosService } from './relatorios.service';
import { RelatoriosAdminController } from './controllers/relatorios-admin.controller';
import { RelatoriosClienteController } from './controllers/relatorios-cliente.controller';

@Module({
  imports: [PrismaModule],
  controllers: [RelatoriosAdminController, RelatoriosClienteController],
  providers: [RelatoriosService],
  exports: [RelatoriosService],
})
export class RelatoriosModule {}
