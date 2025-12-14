import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// Módulos internos
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { EmpresasModule } from './modules/empresas/empresas.module';
import { TomadoresModule } from './modules/tomadores/tomadores.module';
import { NotasFiscaisModule } from './modules/notas-fiscais/notas-fiscais.module';
import { GuiasModule } from './modules/guias/guias.module';
import { DocumentosModule } from './modules/documentos/documentos.module';
import { LocalidadesModule } from './modules/localidades/localidades.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { NotificacoesModule } from './modules/notificacoes/notificacoes.module';

// Configuração de validação
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    // Configuração global
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 segundo
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000, // 10 segundos
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000, // 1 minuto
        limit: 100,
      },
    ]),

    // Prisma ORM
    PrismaModule,

    // Módulos da aplicação
    AuthModule,
    UsuariosModule,
    EmpresasModule,
    TomadoresModule,
    NotasFiscaisModule,
    GuiasModule,
    DocumentosModule,
    LocalidadesModule,
    DashboardModule,
    NotificacoesModule,
  ],
  providers: [
    // Guard global de rate limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
