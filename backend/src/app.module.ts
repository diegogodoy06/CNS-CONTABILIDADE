import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';

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

// Novos módulos
import { TicketsModule } from './modules/tickets/tickets.module';
import { ComunicacaoModule } from './modules/comunicacao/comunicacao.module';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { RelatoriosModule } from './modules/relatorios/relatorios.module';
import { ConfiguracoesModule } from './modules/configuracoes/configuracoes.module';

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

    // Servir arquivos estáticos (uploads)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..'),
      serveRoot: '/',
      serveStaticOptions: {
        index: false,
      },
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 segundo
        limit: 20, // Aumentado para desenvolvimento
      },
      {
        name: 'medium',
        ttl: 10000, // 10 segundos
        limit: 100,
      },
      {
        name: 'long',
        ttl: 60000, // 1 minuto
        limit: 300,
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

    // Novos módulos
    TicketsModule,
    ComunicacaoModule,
    AuditoriaModule,
    RelatoriosModule,
    ConfiguracoesModule,
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
