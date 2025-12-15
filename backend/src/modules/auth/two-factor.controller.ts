import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TwoFactorService } from './two-factor.service';
import { 
  VerifyTwoFactorDto, 
  TwoFactorSetupResponse, 
  TwoFactorStatusResponse 
} from './dto/two-factor.dto';

@ApiTags('Autenticação - 2FA')
@ApiBearerAuth()
@Controller('auth/2fa')
@UseGuards(JwtAuthGuard)
export class TwoFactorController {
  constructor(private twoFactorService: TwoFactorService) {}

  @Get('status')
  @ApiOperation({ summary: 'Verificar se 2FA está habilitado' })
  @ApiResponse({ status: 200, type: TwoFactorStatusResponse })
  async getStatus(@Req() req: any) {
    return this.twoFactorService.getStatus(req.user.sub);
  }

  @Post('setup')
  @ApiOperation({ summary: 'Gerar QR Code para configurar 2FA' })
  @ApiResponse({ 
    status: 200, 
    description: 'Retorna QR Code e secret para configurar no app autenticador',
    type: TwoFactorSetupResponse,
  })
  async setup(@Req() req: any) {
    return this.twoFactorService.setup(req.user.sub);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verificar código e ativar 2FA' })
  @ApiResponse({ status: 200, description: '2FA ativado com sucesso' })
  @ApiResponse({ status: 400, description: 'Código inválido' })
  async verify(@Req() req: any, @Body() dto: VerifyTwoFactorDto) {
    return this.twoFactorService.verify(req.user.sub, dto.codigo);
  }

  @Post('disable')
  @ApiOperation({ summary: 'Desativar 2FA (requer código atual)' })
  @ApiResponse({ status: 200, description: '2FA desativado com sucesso' })
  @ApiResponse({ status: 400, description: 'Código inválido' })
  async disable(@Req() req: any, @Body() dto: VerifyTwoFactorDto) {
    return this.twoFactorService.disable(req.user.sub, dto.codigo);
  }
}
