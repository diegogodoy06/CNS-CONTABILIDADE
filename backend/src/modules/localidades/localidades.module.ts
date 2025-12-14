import { Module } from '@nestjs/common';
import { LocalidadesService } from './localidades.service';
import { LocalidadesController } from './localidades.controller';

@Module({
  controllers: [LocalidadesController],
  providers: [LocalidadesService],
  exports: [LocalidadesService],
})
export class LocalidadesModule {}
