import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Interface padrão para resposta de erro da API
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  details?: Record<string, any>;
  path: string;
  timestamp: string;
  requestId?: string;
}

/**
 * Filtro global de exceções HTTP
 * Padroniza todas as respostas de erro da API
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';
    let error = 'Internal Server Error';
    let details: Record<string, any> | undefined;

    // HttpException (erros controlados do NestJS)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, any>;
        message = responseObj.message || message;
        error = responseObj.error || error;
        details = responseObj.details;

        // Trata array de mensagens de validação
        if (Array.isArray(message)) {
          details = { validationErrors: message };
          message = 'Erro de validação nos dados enviados';
        }
      }
    }
    // Erros do Prisma
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = this.handlePrismaError(exception);
      status = prismaError.status;
      message = prismaError.message;
      error = prismaError.error;
      details = prismaError.details;
    }
    // Erro de validação do Prisma
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Dados inválidos para a operação';
      error = 'Validation Error';
      details = { prismaValidation: (exception as any).message };
    }
    // Erro genérico
    else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Erro não tratado: ${exception.message}`,
        exception.stack,
      );
    }

    // Monta resposta padronizada
    const errorResponse: ApiErrorResponse = {
      statusCode: status,
      message,
      error,
      details,
      path: request.url,
      timestamp: new Date().toISOString(),
      requestId: request.headers['x-request-id'] as string,
    };

    // Log do erro
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      {
        body: request.body,
        query: request.query,
        params: request.params,
        userId: (request as any).user?.id,
      },
    );

    response.status(status).json(errorResponse);
  }

  /**
   * Trata erros específicos do Prisma
   */
  private handlePrismaError(error: Prisma.PrismaClientKnownRequestError): {
    status: number;
    message: string;
    error: string;
    details?: Record<string, any>;
  } {
    switch (error.code) {
      // Violação de constraint única
      case 'P2002': {
        const fields = (error.meta?.target as string[]) || [];
        return {
          status: HttpStatus.CONFLICT,
          message: `Registro duplicado. O campo ${fields.join(', ')} já existe.`,
          error: 'Conflict',
          details: { fields },
        };
      }

      // Registro não encontrado
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Registro não encontrado',
          error: 'Not Found',
        };

      // Violação de chave estrangeira
      case 'P2003': {
        const field = error.meta?.field_name as string;
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `Referência inválida no campo ${field}`,
          error: 'Bad Request',
          details: { field },
        };
      }

      // Valor inválido
      case 'P2006':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Valor inválido fornecido',
          error: 'Bad Request',
        };

      // Argumento inválido
      case 'P2009':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Argumento de consulta inválido',
          error: 'Bad Request',
        };

      // Timeout de conexão
      case 'P2024':
        return {
          status: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Tempo de conexão com o banco de dados esgotado',
          error: 'Service Unavailable',
        };

      default:
        this.logger.error(`Erro Prisma não mapeado: ${error.code}`, error);
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Erro ao processar operação no banco de dados',
          error: 'Internal Server Error',
          details: { code: error.code },
        };
    }
  }
}
