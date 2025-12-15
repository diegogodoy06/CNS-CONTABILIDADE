import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTwoFactorDto {
  @ApiProperty({ description: 'Código TOTP de 6 dígitos', example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'O código deve ter exatamente 6 dígitos' })
  codigo: string;
}

export class ValidateTwoFactorLoginDto {
  @ApiProperty({ description: 'Email do usuário' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Código TOTP de 6 dígitos', example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'O código deve ter exatamente 6 dígitos' })
  codigo: string;

  @ApiProperty({ description: 'Token temporário recebido no primeiro passo do login' })
  @IsString()
  @IsNotEmpty()
  tempToken: string;
}

export class TwoFactorSetupResponse {
  @ApiProperty({ description: 'Secret em formato base32 para entrada manual' })
  secret: string;

  @ApiProperty({ description: 'URL otpauth para gerar QR Code' })
  otpauthUrl: string;

  @ApiProperty({ description: 'QR Code em formato data URI (base64)' })
  qrCode: string;
}

export class TwoFactorStatusResponse {
  @ApiProperty({ description: 'Se 2FA está habilitado para o usuário' })
  habilitado: boolean;

  @ApiProperty({ description: 'Data de ativação do 2FA', required: false })
  ativadoEm?: Date;
}
