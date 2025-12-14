import { Module } from '@nestjs/common';
import { TomadoresService } from './tomadores.service';
import { TomadoresController } from './tomadores.controller';

@Module({
  controllers: [TomadoresController],
  providers: [TomadoresService],
  exports: [TomadoresService],
})
export class TomadoresModule {}
