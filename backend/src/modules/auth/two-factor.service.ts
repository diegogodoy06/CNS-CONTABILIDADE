import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class TwoFactorService {
  constructor(private prisma: PrismaService) {}

  /**
   * Gera um novo secret 2FA e QR Code para o usuário
   */
  async setup(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, email: true, nome: true, mfaSecret: true, mfaHabilitado: true },
    });

    if (!usuario) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (usuario.mfaHabilitado) {
      throw new BadRequestException('2FA já está habilitado. Desative primeiro para reconfigurar.');
    }

    // Gerar novo secret
    const secret = speakeasy.generateSecret({
      name: `CNS Contabilidade (${usuario.email})`,
      issuer: 'CNS Contabilidade',
      length: 32,
    });

    // Salvar secret temporariamente (não habilitado ainda)
    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { mfaSecret: secret.base32 },
    });

    // Gerar QR Code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url,
      qrCode,
    };
  }

  /**
   * Verifica o código TOTP e ativa o 2FA
   */
  async verify(usuarioId: string, codigo: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, mfaSecret: true, mfaHabilitado: true },
    });

    if (!usuario) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (!usuario.mfaSecret) {
      throw new BadRequestException('Configure o 2FA primeiro usando /auth/2fa/setup');
    }

    if (usuario.mfaHabilitado) {
      throw new BadRequestException('2FA já está habilitado');
    }

    // Verificar código TOTP
    const isValid = speakeasy.totp.verify({
      secret: usuario.mfaSecret,
      encoding: 'base32',
      token: codigo,
      window: 1, // Permite 1 intervalo de tolerância (30 segundos antes/depois)
    });

    if (!isValid) {
      throw new BadRequestException('Código inválido. Verifique se o horário do dispositivo está sincronizado.');
    }

    // Ativar 2FA
    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { 
        mfaHabilitado: true,
        mfaAtivadoEm: new Date(),
      },
    });

    return { 
      message: '2FA ativado com sucesso',
      habilitado: true,
    };
  }

  /**
   * Valida código TOTP durante o login
   */
  async validateLogin(usuarioId: string, codigo: string): Promise<boolean> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { mfaSecret: true, mfaHabilitado: true },
    });

    if (!usuario || !usuario.mfaHabilitado || !usuario.mfaSecret) {
      throw new UnauthorizedException('2FA não está configurado para este usuário');
    }

    const isValid = speakeasy.totp.verify({
      secret: usuario.mfaSecret,
      encoding: 'base32',
      token: codigo,
      window: 1,
    });

    if (!isValid) {
      throw new UnauthorizedException('Código 2FA inválido');
    }

    return true;
  }

  /**
   * Desativa o 2FA
   */
  async disable(usuarioId: string, codigo: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, mfaSecret: true, mfaHabilitado: true },
    });

    if (!usuario) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (!usuario.mfaHabilitado) {
      throw new BadRequestException('2FA não está habilitado');
    }

    // Verificar código antes de desativar (segurança)
    const isValid = speakeasy.totp.verify({
      secret: usuario.mfaSecret!,
      encoding: 'base32',
      token: codigo,
      window: 1,
    });

    if (!isValid) {
      throw new BadRequestException('Código inválido. Não foi possível desativar o 2FA.');
    }

    // Desativar 2FA
    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { 
        mfaHabilitado: false,
        mfaSecret: null,
        mfaAtivadoEm: null,
      },
    });

    return { 
      message: '2FA desativado com sucesso',
      habilitado: false,
    };
  }

  /**
   * Verifica se o usuário tem 2FA habilitado
   */
  async getStatus(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { mfaHabilitado: true, mfaAtivadoEm: true },
    });

    if (!usuario) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return {
      habilitado: usuario.mfaHabilitado || false,
      ativadoEm: usuario.mfaAtivadoEm,
    };
  }

  /**
   * Verifica se usuário requer 2FA no login
   */
  async requiresTwoFactor(usuarioId: string): Promise<boolean> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { mfaHabilitado: true },
    });

    return usuario?.mfaHabilitado || false;
  }
}
