/**
 * Seed - Dados de teste para CNS Contabilidade
 * Execute com: npm run prisma:seed
 */

import { PrismaClient, TipoUsuario, StatusUsuario, RegimeTributario, RoleEmpresa } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Interfaces para API do IBGE
interface RegiaoIBGE {
  id: number;
  sigla: string;
  nome: string;
}

interface EstadoIBGE {
  id: number;
  sigla: string;
  nome: string;
  regiao: RegiaoIBGE;
}

interface MunicipioIBGE {
  id: number;
  nome: string;
}

// Função para buscar dados do IBGE
async function fetchIBGE<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro ao buscar ${url}: ${response.statusText}`);
  }
  return response.json();
}

// Carregar todas as localidades do IBGE
async function seedLocalidades() {
  console.log('📍 Carregando regiões da API do IBGE...');
  const regioesIBGE = await fetchIBGE<RegiaoIBGE[]>('https://servicodados.ibge.gov.br/api/v1/localidades/regioes');
  
  for (const regiao of regioesIBGE) {
    await prisma.regiao.upsert({
      where: { id: regiao.id },
      update: { nome: regiao.nome, sigla: regiao.sigla },
      create: { id: regiao.id, nome: regiao.nome, sigla: regiao.sigla },
    });
  }
  console.log(`   ✓ ${regioesIBGE.length} regiões carregadas`);

  console.log('📍 Carregando estados da API do IBGE...');
  const estadosIBGE = await fetchIBGE<EstadoIBGE[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
  
  for (const estado of estadosIBGE) {
    await prisma.estado.upsert({
      where: { id: estado.id },
      update: { nome: estado.nome, sigla: estado.sigla, codigoIbge: estado.id, regiaoId: estado.regiao.id },
      create: { id: estado.id, nome: estado.nome, sigla: estado.sigla, codigoIbge: estado.id, regiaoId: estado.regiao.id },
    });
  }
  console.log(`   ✓ ${estadosIBGE.length} estados carregados`);

  console.log('🏙️ Carregando municípios da API do IBGE (pode demorar)...');
  let totalMunicipios = 0;
  
  for (const estado of estadosIBGE) {
    const municipiosIBGE = await fetchIBGE<MunicipioIBGE[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.id}/municipios`
    );
    
    // Inserir em lotes para melhor performance
    const municipiosData = municipiosIBGE.map(m => ({
      codigo: m.id,
      nome: m.nome,
      estadoId: estado.id,
    }));
    
    for (const mun of municipiosData) {
      await prisma.municipio.upsert({
        where: { codigo: mun.codigo },
        update: { nome: mun.nome, estadoId: mun.estadoId },
        create: mun,
      });
    }
    
    totalMunicipios += municipiosIBGE.length;
    process.stdout.write(`\r   ✓ ${estado.sigla}: ${municipiosIBGE.length} municípios (total: ${totalMunicipios})`);
  }
  console.log(`\n   ✓ Total: ${totalMunicipios} municípios carregados`);
  
  return { estadosIBGE };
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // 1. Carregar Localidades do IBGE
  const { estadosIBGE } = await seedLocalidades();
  
  // Encontrar estado de SP para usar no escritório
  const estadoSP = estadosIBGE.find(e => e.sigla === 'SP');
  const estadoRJ = estadosIBGE.find(e => e.sigla === 'RJ');
  const estadoPR = estadosIBGE.find(e => e.sigla === 'PR');
  if (!estadoSP || !estadoRJ || !estadoPR) throw new Error('Estados SP/RJ/PR não encontrados');
  
  // Códigos dos municípios (IBGE)
  const municipioSPCodigo = 3550308;      // São Paulo - SP
  const municipioCampinasCodigo = 3509502; // Campinas - SP
  const municipioRJCodigo = 3304557;       // Rio de Janeiro - RJ
  const municipioCuritibaCodigo = 4106902; // Curitiba - PR

  // 4. Criar Escritório
  console.log('🏢 Criando escritório...');
  const escritorio = await prisma.escritorio.upsert({
    where: { cnpj: '12345678000199' },
    update: {},
    create: {
      razaoSocial: 'CNS Contabilidade LTDA',
      nomeFantasia: 'CNS Contabilidade',
      cnpj: '12345678000199',
      email: 'contato@cnscontabil.com.br',
      telefone: '1140028922',
      crc: 'SP-123456/O',
      estadoId: estadoSP.id,
      municipioCodigo: municipioSPCodigo,
      logradouro: 'Av. Paulista',
      numero: '1000',
      complemento: '10º andar',
      bairro: 'Bela Vista',
      cep: '01310100',
      ativo: true,
    },
  });

  // 5. Criar usuário Admin do Sistema
  console.log('👤 Criando usuários do sistema...');
  const senhaHashAdmin = await bcrypt.hash('Admin@123', 10);
  
  const adminUser = await prisma.usuario.upsert({
    where: { email: 'admin@cnscontabil.com.br' },
    update: { senhaHash: senhaHashAdmin, status: StatusUsuario.ATIVO, emailVerificado: true, nome: 'Carlos Alberto Santos', cpf: '11111111111' },
    create: {
      email: 'admin@cnscontabil.com.br',
      senhaHash: senhaHashAdmin,
      nome: 'Carlos Alberto Santos',
      cpf: '11111111111',
      telefone: '1199998888',
      tipo: TipoUsuario.ADMIN_ESCRITORIO,
      status: StatusUsuario.ATIVO,
      emailVerificado: true,
    },
  });

  // Criar Colaborador do escritório
  const senhaHashColab = await bcrypt.hash('Colab@123', 10);
  const colaboradorUser = await prisma.usuario.upsert({
    where: { email: 'colaborador@cnscontabil.com.br' },
    update: { senhaHash: senhaHashColab, status: StatusUsuario.ATIVO, emailVerificado: true, nome: 'Maria Fernanda Silva', cpf: '22222222222' },
    create: {
      email: 'colaborador@cnscontabil.com.br',
      senhaHash: senhaHashColab,
      nome: 'Maria Fernanda Silva',
      cpf: '22222222222',
      telefone: '1199997777',
      tipo: TipoUsuario.COLABORADOR,
      status: StatusUsuario.ATIVO,
      emailVerificado: true,
    },
  });

  // 6. Vincular Admin e Colaborador ao Escritório
  console.log('🔗 Vinculando usuários ao escritório...');
  await prisma.colaboradorEscritorio.upsert({
    where: { usuarioId: adminUser.id },
    update: {},
    create: {
      usuarioId: adminUser.id,
      escritorioId: escritorio.id,
      cargo: 'Contador Responsável',
      departamento: 'Contabilidade',
      ativo: true,
    },
  });

  await prisma.colaboradorEscritorio.upsert({
    where: { usuarioId: colaboradorUser.id },
    update: {},
    create: {
      usuarioId: colaboradorUser.id,
      escritorioId: escritorio.id,
      cargo: 'Auxiliar Contábil',
      departamento: 'Contabilidade',
      ativo: true,
    },
  });

  // 7. Criar Empresas de teste
  console.log('🏭 Criando empresas de teste...');
  
  // Empresa 1 - Tecnologia
  const empresa1 = await prisma.empresa.upsert({
    where: { cnpj: '11222333000181' },
    update: {},
    create: {
      escritorioId: escritorio.id,
      razaoSocial: 'TechSoft Soluções em Tecnologia LTDA',
      nomeFantasia: 'TechSoft',
      cnpj: '11222333000181',
      inscricaoMunicipal: '12345678',
      email: 'contato@techsoft.com.br',
      telefone: '1133334444',
      regimeTributario: RegimeTributario.SIMPLES_NACIONAL,
      estadoId: estadoSP.id,
      municipioCodigo: municipioSPCodigo,
      logradouro: 'Rua Augusta',
      numero: '500',
      complemento: 'Sala 301',
      bairro: 'Consolação',
      cep: '01304001',
      aliquotaIss: 2.0,
      cnaePrincipal: '6201500',
    },
  });

  // Empresa 2 - Consultoria
  const empresa2 = await prisma.empresa.upsert({
    where: { cnpj: '22333444000192' },
    update: {},
    create: {
      escritorioId: escritorio.id,
      razaoSocial: 'Nexus Consultoria Empresarial LTDA',
      nomeFantasia: 'Nexus Consultoria',
      cnpj: '22333444000192',
      inscricaoMunicipal: '23456789',
      email: 'contato@nexusconsultoria.com.br',
      telefone: '1144445555',
      regimeTributario: RegimeTributario.LUCRO_PRESUMIDO,
      estadoId: estadoSP.id,
      municipioCodigo: municipioCampinasCodigo,
      logradouro: 'Av. Norte Sul',
      numero: '1200',
      bairro: 'Cambuí',
      cep: '13025320',
      aliquotaIss: 5.0,
      cnaePrincipal: '7020400',
    },
  });

  // Empresa 3 - Comércio
  const empresa3 = await prisma.empresa.upsert({
    where: { cnpj: '33444555000103' },
    update: {},
    create: {
      escritorioId: escritorio.id,
      razaoSocial: 'Mega Store Comércio de Produtos EIRELI',
      nomeFantasia: 'Mega Store',
      cnpj: '33444555000103',
      inscricaoEstadual: '123456789012',
      inscricaoMunicipal: '34567890',
      email: 'vendas@megastore.com.br',
      telefone: '2133336666',
      regimeTributario: RegimeTributario.SIMPLES_NACIONAL,
      estadoId: estadoRJ.id,
      municipioCodigo: municipioRJCodigo,
      logradouro: 'Av. Rio Branco',
      numero: '156',
      complemento: 'Loja A',
      bairro: 'Centro',
      cep: '20040901',
      aliquotaIss: 3.0,
      cnaePrincipal: '4751201',
    },
  });

  // Empresa 4 - Restaurante
  const empresa4 = await prisma.empresa.upsert({
    where: { cnpj: '44555666000114' },
    update: {},
    create: {
      escritorioId: escritorio.id,
      razaoSocial: 'Sabor & Arte Gastronomia LTDA',
      nomeFantasia: 'Restaurante Sabor & Arte',
      cnpj: '44555666000114',
      inscricaoMunicipal: '45678901',
      email: 'reservas@saborarte.com.br',
      telefone: '4133337777',
      regimeTributario: RegimeTributario.SIMPLES_NACIONAL,
      estadoId: estadoPR.id,
      municipioCodigo: municipioCuritibaCodigo,
      logradouro: 'Rua XV de Novembro',
      numero: '800',
      bairro: 'Centro',
      cep: '80020310',
      aliquotaIss: 5.0,
      cnaePrincipal: '5611201',
    },
  });

  // Empresa 5 - Marketing
  const empresa5 = await prisma.empresa.upsert({
    where: { cnpj: '55666777000125' },
    update: {},
    create: {
      escritorioId: escritorio.id,
      razaoSocial: 'Creative Digital Marketing ME',
      nomeFantasia: 'Creative Digital',
      cnpj: '55666777000125',
      inscricaoMunicipal: '56789012',
      email: 'ola@creativedigital.com.br',
      telefone: '1155558888',
      regimeTributario: RegimeTributario.SIMPLES_NACIONAL,
      estadoId: estadoSP.id,
      municipioCodigo: municipioSPCodigo,
      logradouro: 'Rua Oscar Freire',
      numero: '350',
      complemento: 'Coworking 5º andar',
      bairro: 'Jardins',
      cep: '01426001',
      aliquotaIss: 2.0,
      cnaePrincipal: '7311400',
    },
  });

  // 8. Criar usuários Clientes
  console.log('👤 Criando usuários clientes...');
  const senhaHashCliente = await bcrypt.hash('Cliente@123', 10);
  
  // Cliente 1 - João (TechSoft)
  const cliente1 = await prisma.usuario.upsert({
    where: { email: 'joao@techsoft.com.br' },
    update: { senhaHash: senhaHashCliente, status: StatusUsuario.ATIVO, emailVerificado: true, cpf: '33333333333' },
    create: {
      email: 'joao@techsoft.com.br',
      senhaHash: senhaHashCliente,
      nome: 'João Pedro Oliveira',
      cpf: '33333333333',
      telefone: '11999887766',
      tipo: TipoUsuario.CLIENTE,
      status: StatusUsuario.ATIVO,
      emailVerificado: true,
    },
  });

  // Cliente 2 - Ana (Nexus)
  const cliente2 = await prisma.usuario.upsert({
    where: { email: 'ana@nexusconsultoria.com.br' },
    update: { senhaHash: senhaHashCliente, status: StatusUsuario.ATIVO, emailVerificado: true, cpf: '44444444444' },
    create: {
      email: 'ana@nexusconsultoria.com.br',
      senhaHash: senhaHashCliente,
      nome: 'Ana Carolina Mendes',
      cpf: '44444444444',
      telefone: '19999776655',
      tipo: TipoUsuario.CLIENTE,
      status: StatusUsuario.ATIVO,
      emailVerificado: true,
    },
  });

  // Cliente 3 - Roberto (Mega Store)
  const cliente3 = await prisma.usuario.upsert({
    where: { email: 'roberto@megastore.com.br' },
    update: { senhaHash: senhaHashCliente, status: StatusUsuario.ATIVO, emailVerificado: true, cpf: '55555555555' },
    create: {
      email: 'roberto@megastore.com.br',
      senhaHash: senhaHashCliente,
      nome: 'Roberto Carlos Lima',
      cpf: '55555555555',
      telefone: '21999665544',
      tipo: TipoUsuario.CLIENTE,
      status: StatusUsuario.ATIVO,
      emailVerificado: true,
    },
  });

  // 9. Vincular Clientes às Empresas
  console.log('🔗 Vinculando clientes às empresas...');
  
  // João é proprietário da TechSoft
  await prisma.usuarioEmpresa.upsert({
    where: { usuarioId_empresaId: { usuarioId: cliente1.id, empresaId: empresa1.id } },
    update: {},
    create: { usuarioId: cliente1.id, empresaId: empresa1.id, role: RoleEmpresa.PROPRIETARIO, ativo: true },
  });

  // Ana é proprietária da Nexus
  await prisma.usuarioEmpresa.upsert({
    where: { usuarioId_empresaId: { usuarioId: cliente2.id, empresaId: empresa2.id } },
    update: {},
    create: { usuarioId: cliente2.id, empresaId: empresa2.id, role: RoleEmpresa.PROPRIETARIO, ativo: true },
  });

  // Roberto é proprietário da Mega Store
  await prisma.usuarioEmpresa.upsert({
    where: { usuarioId_empresaId: { usuarioId: cliente3.id, empresaId: empresa3.id } },
    update: {},
    create: { usuarioId: cliente3.id, empresaId: empresa3.id, role: RoleEmpresa.PROPRIETARIO, ativo: true },
  });

  // João também tem acesso à Creative Digital como funcionário
  await prisma.usuarioEmpresa.upsert({
    where: { usuarioId_empresaId: { usuarioId: cliente1.id, empresaId: empresa5.id } },
    update: {},
    create: { usuarioId: cliente1.id, empresaId: empresa5.id, role: RoleEmpresa.FUNCIONARIO, ativo: true },
  });

  // Admin tem acesso a todas as empresas
  for (const emp of [empresa1, empresa2, empresa3, empresa4, empresa5]) {
    await prisma.usuarioEmpresa.upsert({
      where: { usuarioId_empresaId: { usuarioId: adminUser.id, empresaId: emp.id } },
      update: {},
      create: { usuarioId: adminUser.id, empresaId: emp.id, role: RoleEmpresa.PROPRIETARIO, ativo: true },
    });
  }

  console.log('\n✅ Seed concluído com sucesso!\n');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('                    📋 DADOS CRIADOS                               ');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('\n🏢 ESCRITÓRIO:');
  console.log('   CNS Contabilidade LTDA');
  console.log('   CNPJ: 12.345.678/0001-99');
  console.log('\n🏭 EMPRESAS (5):');
  console.log('   1. TechSoft - Tecnologia (CNPJ: 11.222.333/0001-81)');
  console.log('   2. Nexus Consultoria (CNPJ: 22.333.444/0001-92)');
  console.log('   3. Mega Store - Comércio (CNPJ: 33.444.555/0001-03)');
  console.log('   4. Sabor & Arte - Restaurante (CNPJ: 44.555.666/0001-14)');
  console.log('   5. Creative Digital - Marketing (CNPJ: 55.666.777/0001-25)');
  console.log('\n👥 USUÁRIOS PARA TESTE:');
  console.log('┌─────────────────────────────────────┬───────────────┬─────────────────────┐');
  console.log('│ Email                               │ Senha         │ Tipo                │');
  console.log('├─────────────────────────────────────┼───────────────┼─────────────────────┤');
  console.log('│ admin@cnscontabil.com.br            │ Admin@123     │ ADMIN_ESCRITORIO    │');
  console.log('│ colaborador@cnscontabil.com.br      │ Colab@123     │ COLABORADOR         │');
  console.log('│ joao@techsoft.com.br                │ Cliente@123   │ CLIENTE             │');
  console.log('│ ana@nexusconsultoria.com.br         │ Cliente@123   │ CLIENTE             │');
  console.log('│ roberto@megastore.com.br            │ Cliente@123   │ CLIENTE             │');
  console.log('└─────────────────────────────────────┴───────────────┴─────────────────────┘');
  console.log('\n═══════════════════════════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
