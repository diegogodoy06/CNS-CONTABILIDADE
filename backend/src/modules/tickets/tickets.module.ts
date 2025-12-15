import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TicketsService } from './tickets.service';
import { TicketsAdminController } from './controllers/tickets-admin.controller';
import { TicketsClienteController } from './controllers/tickets-cliente.controller';

@Module({
  imports: [PrismaModule],
  controllers: [TicketsAdminController, TicketsClienteController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
