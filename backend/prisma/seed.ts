/**
 * Seed - Dados de teste para CNS Contabilidade
 * Execute com: npx ts-node prisma/seed.ts
 */

import { PrismaClient, TipoUsuario, StatusUsuario, RegimeTributario, RoleEmpresa } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // 1. Criar Região e Estado
  console.log('📍 Criando região e estado...');
  const regiao = await prisma.regiao.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nome: 'Sudeste',
      sigla: 'SE',
    },
  });

  const estado = await prisma.estado.upsert({
    where: { id: 35 },
    update: {},
    create: {
      id: 35,
      nome: 'São Paulo',
      sigla: 'SP',
      codigoIbge: 35,
      regiaoId: regiao.id,
    },
  });

  // 2. Criar Município
  console.log('🏙️ Criando município...');
  const municipio = await prisma.municipio.upsert({
    where: { codigo: 3550308 },
    update: {},
    create: {
      codigo: 3550308,
      nome: 'São Paulo',
      estadoId: estado.id,
    },
  });

  // 3. Criar Escritório
  console.log('🏢 Criando escritório...');
  const escritorio = await prisma.escritorio.upsert({
    where: { cnpj: '12345678000199' },
    update: {},
    create: {
      razaoSocial: 'CNS Contabilidade LTDA',
      nomeFantasia: 'CNS Contabilidade',
      cnpj: '12345678000199',
      email: 'contato@cns.com.br',
      telefone: '1199999999',
      crc: 'SP-123456/O',
      estadoId: estado.id,
      municipioCodigo: municipio.codigo,
      logradouro: 'Av. Paulista',
      numero: '1000',
      bairro: 'Bela Vista',
      cep: '01310100',
      ativo: true,
    },
  });

  // 4. Criar usuário Admin
  console.log('👤 Criando usuário admin...');
  const senhaHashAdmin = await bcrypt.hash('Admin@123', 10);
  
  const adminUser = await prisma.usuario.upsert({
    where: { email: 'admin@cns.com.br' },
    update: {
      senhaHash: senhaHashAdmin,
      status: StatusUsuario.ATIVO,
      emailVerificado: true,
    },
    create: {
      email: 'admin@cns.com.br',
      senhaHash: senhaHashAdmin,
      nome: 'Administrador CNS',
      cpf: '12345678901',
      tipo: TipoUsuario.ADMIN_ESCRITORIO,
      status: StatusUsuario.ATIVO,
      emailVerificado: true,
    },
  });

  // 5. Vincular Admin ao Escritório
  console.log('🔗 Vinculando admin ao escritório...');
  await prisma.colaboradorEscritorio.upsert({
    where: { usuarioId: adminUser.id },
    update: {},
    create: {
      usuarioId: adminUser.id,
      escritorioId: escritorio.id,
      cargo: 'Contador',
      departamento: 'Contabilidade',
      ativo: true,
    },
  });

  // 6. Criar Empresa de teste
  console.log('🏭 Criando empresa de teste...');
  const empresa = await prisma.empresa.upsert({
    where: { cnpj: '98765432000111' },
    update: {},
    create: {
      escritorioId: escritorio.id,
      razaoSocial: 'Empresa Teste LTDA',
      nomeFantasia: 'Empresa Teste',
      cnpj: '98765432000111',
      email: 'contato@empresateste.com.br',
      regimeTributario: RegimeTributario.SIMPLES_NACIONAL,
      estadoId: estado.id,
      municipioCodigo: municipio.codigo,
      aliquotaIss: 5.0,
    },
  });

  // 7. Vincular Admin à Empresa
  console.log('🔗 Vinculando admin à empresa...');
  await prisma.usuarioEmpresa.upsert({
    where: {
      usuarioId_empresaId: {
        usuarioId: adminUser.id,
        empresaId: empresa.id,
      },
    },
    update: {},
    create: {
      usuarioId: adminUser.id,
      empresaId: empresa.id,
      role: RoleEmpresa.PROPRIETARIO,
      ativo: true,
    },
  });

  // 8. Criar usuário Cliente
  console.log('👤 Criando usuário cliente...');
  const senhaHashCliente = await bcrypt.hash('Cliente@123', 10);
  
  const clienteUser = await prisma.usuario.upsert({
    where: { email: 'cliente@teste.com.br' },
    update: {
      senhaHash: senhaHashCliente,
      status: StatusUsuario.ATIVO,
      emailVerificado: true,
    },
    create: {
      email: 'cliente@teste.com.br',
      senhaHash: senhaHashCliente,
      nome: 'Cliente Teste',
      cpf: '98765432100',
      tipo: TipoUsuario.CLIENTE,
      status: StatusUsuario.ATIVO,
      emailVerificado: true,
    },
  });

  // 9. Vincular Cliente à Empresa
  await prisma.usuarioEmpresa.upsert({
    where: {
      usuarioId_empresaId: {
        usuarioId: clienteUser.id,
        empresaId: empresa.id,
      },
    },
    update: {},
    create: {
      usuarioId: clienteUser.id,
      empresaId: empresa.id,
      role: RoleEmpresa.VISUALIZADOR,
      ativo: true,
    },
  });

  console.log('\n✅ Seed concluído com sucesso!\n');
  console.log('📋 Dados criados:');
  console.log('   - Região: Sudeste');
  console.log('   - Estado: São Paulo (SP)');
  console.log('   - Município: São Paulo');
  console.log('   - Escritório: CNS Contabilidade');
  console.log('   - Empresa: Empresa Teste LTDA');
  console.log('\n👥 Usuários para teste:');
  console.log('   ┌────────────────────────┬───────────────┬─────────────────────┐');
  console.log('   │ Email                  │ Senha         │ Tipo                │');
  console.log('   ├────────────────────────┼───────────────┼─────────────────────┤');
  console.log('   │ admin@cns.com.br       │ Admin@123     │ ADMIN_ESCRITORIO    │');
  console.log('   │ cliente@teste.com.br   │ Cliente@123   │ CLIENTE             │');
  console.log('   └────────────────────────┴───────────────┴─────────────────────┘');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
