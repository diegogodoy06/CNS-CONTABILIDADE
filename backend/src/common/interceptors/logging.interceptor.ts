import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

/**
 * Interceptor que registra logs de todas as requisições e respostas
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const userId = (request as any).user?.id || 'anonymous';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const { statusCode } = response;

          this.logger.log(
            `${method} ${url} ${statusCode} - ${duration}ms - ${ip} - ${userId}`,
          );

          // Log detalhado em desenvolvimento
          if (process.env.NODE_ENV === 'development' && duration > 1000) {
            this.logger.warn(
              `Requisição lenta detectada: ${method} ${url} levou ${duration}ms`,
            );
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;

          this.logger.error(
            `${method} ${url} - ERROR - ${duration}ms - ${ip} - ${userId}`,
            {
              error: error.message,
              stack: error.stack,
              body: this.sanitizeBody(request.body),
            },
          );
        },
      }),
    );
  }

  /**
   * Remove dados sensíveis do body para logging
   */
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = ['senha', 'password', 'token', 'secret', 'creditCard'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
