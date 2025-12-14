import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Usuario, StatusUsuario, TipoUsuario } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  tipo: TipoUsuario;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: Omit<Usuario, 'senhaHash' | 'tokenVerificacao' | 'tokenRecuperacao'>;
  tokens: AuthTokens;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 12;
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCK_TIME_MINUTES = 30;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Realiza login do usuário
   */
  async login(dto: LoginDto, ip?: string, userAgent?: string): Promise<AuthResponse> {
    const user = await this.prisma.usuario.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verifica se está bloqueado
    if (user.bloqueadoAte && user.bloqueadoAte > new Date()) {
      const minutosRestantes = Math.ceil(
        (user.bloqueadoAte.getTime() - Date.now()) / 60000,
      );
      throw new UnauthorizedException(
        `Conta bloqueada. Tente novamente em ${minutosRestantes} minutos.`,
      );
    }

    // Verifica status do usuário
    if (user.status === StatusUsuario.BLOQUEADO) {
      throw new UnauthorizedException('Conta bloqueada. Entre em contato com o suporte.');
    }

    if (user.status === StatusUsuario.INATIVO) {
      throw new UnauthorizedException('Conta inativa.');
    }

    // Verifica senha
    const isPasswordValid = await bcrypt.compare(dto.senha, user.senhaHash);

    if (!isPasswordValid) {
      // Incrementa tentativas de login
      const tentativas = user.tentativasLogin + 1;
      const updateData: any = { tentativasLogin: tentativas };

      if (tentativas >= this.MAX_LOGIN_ATTEMPTS) {
        updateData.bloqueadoAte = new Date(
          Date.now() + this.LOCK_TIME_MINUTES * 60000,
        );
        updateData.status = StatusUsuario.BLOQUEADO;
      }

      await this.prisma.usuario.update({
        where: { id: user.id },
        data: updateData,
      });

      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Login bem-sucedido - reseta tentativas
    const tokens = await this.generateTokens(user);

    // Cria sessão
    await this.prisma.sessao.create({
      data: {
        usuarioId: user.id,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        ip,
        userAgent,
        expiraEm: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      },
    });

    // Atualiza último login
    await this.prisma.usuario.update({
      where: { id: user.id },
      data: {
        ultimoLogin: new Date(),
        tentativasLogin: 0,
        bloqueadoAte: null,
      },
    });

    this.logger.log(`Login bem-sucedido: ${user.email}`);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  /**
   * Registra novo usuário
   */
  async register(dto: RegisterDto): Promise<AuthResponse> {
    // Verifica se email já existe
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException('Email já cadastrado');
    }

    // Verifica se CPF já existe
    if (dto.cpf) {
      const existingCpf = await this.prisma.usuario.findUnique({
        where: { cpf: dto.cpf },
      });

      if (existingCpf) {
        throw new BadRequestException('CPF já cadastrado');
      }
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(dto.senha, this.SALT_ROUNDS);

    // Cria usuário
    const user = await this.prisma.usuario.create({
      data: {
        email: dto.email.toLowerCase(),
        senhaHash,
        nome: dto.nome,
        cpf: dto.cpf,
        telefone: dto.telefone,
        celular: dto.celular,
        tipo: TipoUsuario.CLIENTE,
        status: StatusUsuario.PENDENTE,
        emailVerificado: false,
      },
    });

    const tokens = await this.generateTokens(user);

    this.logger.log(`Novo usuário registrado: ${user.email}`);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  /**
   * Refresh do token de acesso
   */
  async refreshToken(dto: RefreshTokenDto): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(dto.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Busca sessão ativa
      const session = await this.prisma.sessao.findFirst({
        where: {
          refreshToken: dto.refreshToken,
          usuarioId: payload.sub,
          encerradoEm: null,
        },
        include: { usuario: true },
      });

      if (!session) {
        throw new UnauthorizedException('Sessão inválida');
      }

      // Gera novos tokens
      const tokens = await this.generateTokens(session.usuario);

      // Atualiza sessão
      await this.prisma.sessao.update({
        where: { id: session.id },
        data: {
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiraEm: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Token de refresh inválido');
    }
  }

  /**
   * Logout do usuário
   */
  async logout(userId: string, token: string): Promise<void> {
    await this.prisma.sessao.updateMany({
      where: {
        usuarioId: userId,
        token,
        encerradoEm: null,
      },
      data: {
        encerradoEm: new Date(),
      },
    });

    this.logger.log(`Logout: usuário ${userId}`);
  }

  /**
   * Logout de todas as sessões
   */
  async logoutAll(userId: string): Promise<void> {
    await this.prisma.sessao.updateMany({
      where: {
        usuarioId: userId,
        encerradoEm: null,
      },
      data: {
        encerradoEm: new Date(),
      },
    });

    this.logger.log(`Logout de todas sessões: usuário ${userId}`);
  }

  /**
   * Valida usuário pelo payload do JWT
   */
  async validateUserByPayload(payload: JwtPayload): Promise<Usuario | null> {
    return this.prisma.usuario.findFirst({
      where: {
        id: payload.sub,
        status: { in: [StatusUsuario.ATIVO, StatusUsuario.PENDENTE] },
      },
    });
  }

  /**
   * Gera tokens JWT
   */
  private async generateTokens(user: Usuario): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tipo: user.tipo,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 86400, // 24h em segundos
    };
  }

  /**
   * Remove dados sensíveis do usuário
   */
  private sanitizeUser(
    user: Usuario,
  ): Omit<Usuario, 'senhaHash' | 'tokenVerificacao' | 'tokenRecuperacao'> {
    const { senhaHash, tokenVerificacao, tokenRecuperacao, ...sanitized } = user;
    return sanitized;
  }
}
