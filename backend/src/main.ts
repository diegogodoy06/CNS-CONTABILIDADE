import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Segurança
  app.use(helmet());

  // CORS - suporta múltiplas origens separadas por vírgula
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:5173');
  const origins = corsOrigin.split(',').map(origin => origin.trim());
  
  app.enableCors({
    origin: origins.length === 1 ? origins[0] : origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Prefixo global da API
  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  app.setGlobalPrefix(apiPrefix);

  // Versionamento da API
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Validação global com class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não decoradas
      forbidNonWhitelisted: true, // Lança erro se houver propriedades extras
      transform: true, // Transforma automaticamente tipos
      transformOptions: {
        enableImplicitConversion: true,
      },
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  // Filtros e Interceptors globais
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger/OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CNS Contabilidade API')
    .setDescription(`
      API REST para o sistema CNS Contabilidade.
      
      ## Autenticação
      A API utiliza JWT Bearer Token para autenticação.
      Use o endpoint /api/v1/auth/login para obter o token.
      
      ## Versionamento
      A API é versionada via URI: /api/v1/*, /api/v2/*
      
      ## Rate Limiting
      Limite de ${configService.get('THROTTLE_LIMIT', 100)} requisições por ${configService.get('THROTTLE_TTL', 60)} segundos.
    `)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Autenticação e gerenciamento de sessão')
    .addTag('Usuarios', 'Gerenciamento de usuários')
    .addTag('Empresas', 'Gerenciamento de empresas')
    .addTag('Tomadores', 'Gerenciamento de tomadores de serviço')
    .addTag('Notas Fiscais', 'Emissão e gerenciamento de NFS-e')
    .addTag('Guias', 'Gerenciamento de guias de impostos')
    .addTag('Documentos', 'Upload e gerenciamento de documentos')
    .addTag('Localidades', 'Estados e municípios')
    .addTag('Dashboard', 'Métricas e resumos')
    .addTag('Notificações', 'Sistema de notificações')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Iniciar servidor
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`
╔═══════════════════════════════════════════════════════════╗
║           CNS Contabilidade - Backend API                 ║
╠═══════════════════════════════════════════════════════════╣
║  🚀 Server running on: http://localhost:${port}              ║
║  📚 Swagger docs:      http://localhost:${port}/docs          ║
║  🔧 Environment:       ${configService.get('NODE_ENV', 'development').padEnd(26)}  ║
║  📦 API Version:       v1                                   ║
╚═══════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
