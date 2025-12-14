import { PartialType, OmitType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { StatusEmpresa } from '@prisma/client';
import { CreateEmpresaDto } from './create-empresa.dto';

export class UpdateEmpresaDto extends PartialType(
  OmitType(CreateEmpresaDto, ['cnpj', 'escritorioId'] as const),
) {
  @IsOptional()
  @IsEnum(StatusEmpresa)
  status?: StatusEmpresa;
}
