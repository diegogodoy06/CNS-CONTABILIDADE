import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, Length } from 'class-validator';

export class CancelarNotaFiscalDto {
  @ApiProperty({
    description: 'Motivo do cancelamento',
    example: 'Erro na descrição do serviço',
  })
  @IsString()
  @Length(10, 500)
  motivoCancelamento: string;
}

export class SubstituirNotaFiscalDto {
  @ApiProperty({
    description: 'ID da nota que será substituída',
  })
  @IsUUID()
  notaSubstituidaId: string;

  @ApiPropertyOptional({
    description: 'Motivo da substituição',
  })
  @IsOptional()
  @IsString()
  @Length(10, 500)
  motivoSubstituicao?: string;
}
