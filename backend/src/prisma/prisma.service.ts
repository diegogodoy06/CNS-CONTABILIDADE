import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    const isDev = configService.get('NODE_ENV') === 'development';

    super({
      log: isDev
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'stdout', level: 'info' },
            { emit: 'stdout', level: 'warn' },
            { emit: 'stdout', level: 'error' },
          ]
        : [
            { emit: 'stdout', level: 'warn' },
            { emit: 'stdout', level: 'error' },
          ],
      errorFormat: 'pretty',
    });

    // Log de queries em desenvolvimento
    if (isDev) {
      this.$on('query', (e: Prisma.QueryEvent) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Params: ${e.params}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }

    this.$on('error', (e: Prisma.LogEvent) => {
      this.logger.error(`Prisma Error: ${e.message}`);
    });
  }

  async onModuleInit() {
    this.logger.log('Conectando ao banco de dados...');
    await this.$connect();
    this.logger.log('Conexão com banco de dados estabelecida');
  }

  async onModuleDestroy() {
    this.logger.log('Desconectando do banco de dados...');
    await this.$disconnect();
    this.logger.log('Conexão com banco de dados encerrada');
  }

  /**
   * Limpa todas as tabelas (apenas para testes)
   */
  async cleanDatabase() {
    if (this.configService.get('NODE_ENV') !== 'test') {
      throw new Error('cleanDatabase só pode ser usado em ambiente de teste');
    }

    const models = Reflect.ownKeys(this).filter(
      (key) => typeof key === 'string' && !key.startsWith('_') && !key.startsWith('$'),
    );

    return Promise.all(
      models.map((modelKey) => {
        const model = this[modelKey as keyof this] as any;
        if (model?.deleteMany) {
          return model.deleteMany();
        }
        return Promise.resolve();
      }),
    );
  }

  /**
   * Executa uma transação com retry automático em caso de deadlock
   */
  async executeWithRetry<T>(
    fn: (prisma: Prisma.TransactionClient) => Promise<T>,
    maxRetries = 3,
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.$transaction(fn, {
          maxWait: 5000,
          timeout: 10000,
        });
      } catch (error) {
        lastError = error as Error;
        
        // Verifica se é um erro de deadlock/serialização
        const isRetryable =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          ['P2034', 'P2024'].includes(error.code);

        if (isRetryable && attempt < maxRetries) {
          this.logger.warn(
            `Transação falhou (tentativa ${attempt}/${maxRetries}), tentando novamente...`,
          );
          await new Promise((resolve) => setTimeout(resolve, 100 * attempt));
          continue;
        }

        throw error;
      }
    }

    throw lastError;
  }
}
