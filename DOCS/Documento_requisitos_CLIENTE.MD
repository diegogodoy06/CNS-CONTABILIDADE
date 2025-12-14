# Portal do Cliente - Documento de Requisitos

## Versão 1.0 | Dezembro 2024

---

## 📋 Sumário

1. [Visão Geral](#1-visão-geral)
2. [Autenticação e Acesso](#2-autenticação-e-acesso)
3. [Dashboard](#3-dashboard)
4. [Gestão Documental](#4-gestão-documental)
5. [Emissão de Notas Fiscais](#5-emissão-de-notas-fiscais)
6. [Cadastro de Tomadores](#6-cadastro-de-tomadores)
7. [Guias e Obrigações](#7-guias-e-obrigações)
8. [Notificações](#8-notificações)
9. [Relatórios e Análises](#9-relatórios-e-análises)
10. [Configurações da Empresa](#10-configurações-da-empresa)
11. [Comunicação com o Escritório](#11-comunicação-com-o-escritório)
12. [Gestão de Usuários da Empresa](#12-gestão-de-usuários-da-empresa)

---

## 1. Visão Geral

### 1.1 Propósito do Portal

O **Portal do Cliente** é a interface principal para empresas que utilizam os serviços do escritório de contabilidade. Permite autoatendimento para tarefas rotineiras como:

- Emissão de notas fiscais de serviço
- Consulta e download de guias de impostos
- Gerenciamento de documentos fiscais
- Comunicação direta com o escritório
- Visualização de relatórios e métricas

### 1.2 Público-Alvo

| Perfil | Descrição |
|--------|-----------|
| **MEI** | Microempreendedor Individual |
| **ME** | Microempresa |
| **EPP** | Empresa de Pequeno Porte |

### 1.3 Princípios de Design

- 🎯 **Simplicidade**: Máximo 3 cliques para qualquer ação principal
- 🤖 **Autonomia**: Cliente realiza 80% das operações sem intermediação
- 📊 **Transparência**: Informações fiscais e tributárias sempre claras
- ⏱️ **Agilidade**: Respostas rápidas e feedback imediato
- 🔒 **Segurança**: Proteção total de dados sensíveis

### 1.4 Diferenciação: Portal Cliente vs Portal Administrativo

| Aspecto | Portal Cliente | Portal Administrativo |
|---------|----------------|----------------------|
| **Público** | Empresários, sócios, funcionários da empresa | Contadores, assistentes do escritório |
| **Escopo de dados** | Apenas da própria empresa | Todas as empresas clientes |
| **Funcionalidades** | Autoatendimento, emissão NF-e, consultas | Gestão completa, configurações, suporte |
| **Acesso** | app.dominio.com.br | admin.dominio.com.br |

---

## 2. Autenticação e Acesso

### RF-CLI-AUTH-001: Login

**Fluxo Principal:**
1. Usuário acessa a tela de login
2. Informa **email** e **senha**
3. Sistema valida credenciais
4. Se usuário tem acesso a múltiplas empresas → tela de seleção
5. Se apenas uma empresa → acesso direto ao dashboard

**Regras:**
- Login via **email + senha** (não CNPJ)
- Um usuário pode ter acesso a múltiplas empresas
- Troca de empresa sem novo login (seletor no header)
- Captcha após 3 tentativas falhas
- Bloqueio temporário após 5 tentativas (15 minutos)

### RF-CLI-AUTH-002: Autenticação em Dois Fatores (2FA)

**Opções de 2FA:**
- 📱 App autenticador (Google Authenticator, Authy)
- 📧 Código por email
- 📲 Código por SMS

**Regras:**
- 2FA é opcional, configurável pelo administrador da empresa
- Códigos válidos por 5 minutos
- Dispositivos confiáveis: lembrar por 30 dias

### RF-CLI-AUTH-003: Recuperação de Senha

**Fluxo:**
1. Usuário clica em "Esqueci minha senha"
2. Informa email cadastrado
3. Recebe link de reset (válido por 1 hora)
4. Define nova senha

**Regras:**
- Validação de CPF do responsável legal (opcional)
- Não permitir últimas 5 senhas
- Força mínima: 8 caracteres, maiúsculas, minúsculas, números, símbolos

### RF-CLI-AUTH-004: Gestão de Sessões

| Configuração | Valor Padrão |
|--------------|--------------|
| Duração da sessão | 4 horas |
| Refresh token | 30 dias |
| Inatividade | 30 minutos |

**Funcionalidades:**
- Logout automático por inatividade
- Notificação de login em novo dispositivo
- Visualização de dispositivos conectados
- Encerrar outras sessões

---

## 3. Dashboard

### RF-CLI-DASH-001: Painel Principal

O dashboard é a primeira tela após o login, oferecendo visão geral da empresa.

**Widgets Obrigatórios:**

#### 📊 Resumo Financeiro do Mês
- Faturamento total
- Impostos a recolher
- Margem líquida estimada
- Comparativo com mês anterior (↑↓%)

#### 📄 Notas Fiscais
- Total emitidas no mês
- Aguardando emissão (rascunhos)
- Canceladas
- Gráfico de evolução (últimos 6 meses)

#### 💳 Guias e Obrigações
- 🔴 Vencendo em 7 dias
- ⚠️ Vencidas (alerta crítico)
- ✅ Pagas no mês
- 📅 Próximas obrigações acessórias

#### 📁 Documentos Recentes
- Últimos 5 documentos adicionados
- Badge "Novo" para não visualizados
- Acesso rápido por categoria

#### 🔔 Central de Notificações
- Alertas pendentes
- Comunicados do escritório
- Avisos de atualizações regulatórias

### RF-CLI-DASH-002: Widgets Personalizáveis

- Drag-and-drop para reorganizar
- Ocultar/exibir widgets específicos
- Configurações salvas por usuário
- Reset para layout padrão

### RF-CLI-DASH-003: Atalhos Rápidos (FAB)

Botões flutuantes para ações frequentes:
- ➕ Emitir NF-e
- 📤 Upload de documento
- 💰 Consultar tributos
- 💬 Falar com contador

---

## 4. Gestão Documental

### RF-CLI-DOC-001: Upload de Documentos

**Formatos Aceitos:**

| Tipo | Extensões | Tamanho Máximo |
|------|-----------|----------------|
| Documentos | PDF | 25 MB |
| Imagens | JPG, PNG, WEBP | 10 MB |
| Planilhas | XLS, XLSX | 15 MB |
| Textos | DOC, DOCX | 15 MB |
| Compactados | ZIP, RAR | 50 MB |

**Funcionalidades:**
- Scan de vírus automático
- OCR automático para PDFs (extrair texto)
- Extração de metadados (data, tipo, emissor)
- Compressão automática de imagens
- Versionamento de documentos

### RF-CLI-DOC-002: Categorias de Documentos

**Categorias Padrão:**

| Categoria | Subcategorias |
|-----------|---------------|
| 📋 **Fiscal** | NF-e Entrada, NF-e Saída, Livros Fiscais, Guias |
| 📊 **Contábil** | Balancetes, DRE, Balanços, Extratos |
| 👥 **Trabalhista** | Folha de Pagamento, Rescisões, FGTS, E-Social |
| ⚖️ **Jurídico** | Contrato Social, Alterações, Atas, Procurações |
| 🏢 **Operacional** | Contratos Fornecedores/Clientes, Seguros, Certidões |
| 🔐 **Certificados** | e-CNPJ, e-CPF, Certificados de Sócios |
| 📚 **Modelos** | Contratos modelo, Checklists (somente leitura) |

### RF-CLI-DOC-003: Busca e Filtros

- 🔍 Busca full-text por conteúdo (OCR)
- 📁 Filtro por categoria
- 📅 Filtro por data/período
- 🏷️ Filtro por tags
- 📊 Ordenação: recente, alfabética, tamanho

### RF-CLI-DOC-004: Visualização e Download

- Visualizador inline para PDF e imagens
- Download individual ou em lote (ZIP)
- Compartilhamento via link temporário (24h)
- Marca d'água em PDFs (opcional)

### RF-CLI-DOC-005: Controle de Acesso

| Tipo | Visibilidade |
|------|--------------|
| Público | Todos os usuários da empresa |
| Privado | Apenas administrador |
| Compartilhado | Visível também para o escritório |

- Log de acesso (quem visualizou/baixou)

### RF-CLI-DOC-006: Retenção

- Política padrão: 5 anos
- Arquivamento automático de documentos antigos
- Exclusão lógica com recuperação em 30 dias

---

## 5. Emissão de Notas Fiscais

### RF-CLI-NF-001: Fluxo de Emissão (Wizard)

**Etapa 1: Seleção de Tomador**
- Busca por CNPJ/CPF ou nome
- Criação rápida inline (modal)
- Importação de dados da Receita Federal
- Quick access: últimos tomadores utilizados

**Etapa 2: Dados do Serviço**
- Descrição (autocomplete do histórico)
- Valor total
- CNAE (busca inteligente)
- Código de Tributação Municipal (CTM)
- Local da prestação
- Retenções (IR, PIS, COFINS, CSLL, INSS)

**Etapa 3: Revisão e Confirmação**
- Preview da NF-e formatada
- Resumo de tributos calculados
- Validação de campos obrigatórios
- Opções: Salvar rascunho | Emitir

**Etapa 4: Transmissão**
- Envio para prefeitura
- Retry automático (3 tentativas)
- Notificação de sucesso/erro
- Download de XML e PDF

### RF-CLI-NF-002: Simulação de Nota Fiscal

- Mesmo fluxo da emissão, sem transmissão
- PDF com marca d'água "SIMULAÇÃO"
- Cálculo de tributos em tempo real
- Converter para emissão real (1 clique)
- Histórico de simulações (7 dias)

### RF-CLI-NF-003: Gestão de Rascunhos

- Salvar emissão incompleta
- Lista de rascunhos pendentes
- Editar, duplicar ou excluir
- Alerta para rascunhos > 15 dias

### RF-CLI-NF-004: Cálculo de Tributos

**ISS:**
- Alíquota por município e CNAE
- Base de cálculo com deduções
- Retenção ou não retenção

**Impostos Federais:**
- IR: 1,5% a 4,8%
- PIS: 0,65%
- COFINS: 3%
- CSLL: 1% a 2,88%

**Simples Nacional:**
- Anexos III, IV e V
- Fator "r" para anexo V
- Segregação de receitas

### RF-CLI-NF-005: Histórico de Notas

**Listagem:**
- Filtros: período, tomador, status, município
- Busca por número ou protocolo
- Exportação Excel/CSV

**Estatísticas:**
- Total faturado por período
- ISS recolhido
- Top 10 tomadores
- Serviços mais prestados

**Ações em Lote:**
- Download de XMLs/PDFs (ZIP)
- Envio por email ao tomador
- Cancelamento múltiplo

### RF-CLI-NF-006: Cancelamento e Substituição

- Cancelamento dentro do prazo legal
- Justificativa obrigatória
- Nota de substituição (quando aplicável)
- Histórico de cancelamentos
- Restrição por perfil (apenas Admin)

### RF-CLI-NF-007: Envio Automático ao Tomador

- Email automático com XML e PDF
- Template personalizável
- Agendamento de envio
- Log de envios

---

## 6. Cadastro de Tomadores

### RF-CLI-TOM-001: Cadastro Completo

**Pessoa Jurídica:**
- CNPJ (validação Receita Federal)
- Razão Social (importação automática)
- Nome Fantasia
- Inscrição Municipal/Estadual
- Endereço completo (autocomplete CEP)
- Emails e telefones
- CNAE principal
- Regime tributário

**Pessoa Física:**
- CPF (validação)
- Nome completo
- RG e data de nascimento
- Endereço, email, telefone

### RF-CLI-TOM-002: Importação Automática

- Consulta Receita Federal (CNPJ)
- Consulta SINTEGRA (IE)
- Autocomplete de endereço (CEP)

### RF-CLI-TOM-003: Gestão

- Listagem com busca e filtros
- Edição inline
- Desativação (soft delete)
- Tags para agrupamento
- Restrição de exclusão se houver notas

### RF-CLI-TOM-004: Histórico de Relacionamento

- Total de notas emitidas
- Faturamento total
- Última nota emitida
- Serviços mais contratados

---

## 7. Guias e Obrigações

### RF-CLI-GUIA-001: Tipos de Guias

| Tipo | Descrição |
|------|-----------|
| DAS | Simples Nacional |
| ISS | Imposto Sobre Serviços |
| INSS | Previdência Social |
| FGTS | Fundo de Garantia |
| IR | Imposto de Renda |
| CSLL | Contribuição Social |
| PIS/COFINS | Contribuições Federais |
| Acessórias | DCTF, EFD, SPED |

**Informações por Guia:**
- Competência (mês/ano)
- Valor
- Data de vencimento
- Código de barras / linha digitável
- PDF da guia
- Status: Pendente | Paga | Vencida | Parcelada

### RF-CLI-GUIA-002: Calendário de Obrigações

- Visualização em calendário mensal
- Cores por status
- Filtro por tipo de obrigação
- Lembretes configuráveis (7, 3, 1 dia antes)

### RF-CLI-GUIA-003: Controle de Vencimentos

- Lista de guias vencendo em 7 dias
- Badge vermelho para urgentes
- Ordenação por vencimento
- Flag "Urgente" para 48h

### RF-CLI-GUIA-004: Pagamento

- Upload de comprovante
- Marcar como "Paga"
- Histórico de pagamentos
- Relatório por período

---

## 8. Notificações

### RF-CLI-NOT-001: Tipos de Notificações

| Criticidade | Cor | Exemplos |
|-------------|-----|----------|
| 🔴 Crítica | Vermelho | Guia vencida, Certificado vencendo, Erro NF-e |
| 🟡 Importante | Amarelo | Guia vencendo 3 dias, Rascunho antigo |
| 🔵 Informativa | Azul | Guia vencendo 7 dias, Novo documento |

### RF-CLI-NOT-002: Central de Notificações

- Badge com contador no menu
- Ordenação por criticidade
- Marcar como lida / todas como lidas
- Filtro por tipo
- Histórico de 30 dias

### RF-CLI-NOT-003: Canais de Notificação

| Canal | Disponibilidade |
|-------|-----------------|
| In-app | Sempre ativo |
| Email | Configurável por tipo |
| SMS | Apenas críticas (opcional) |
| WhatsApp | Futuro |
| Push Mobile | Futuro |

### RF-CLI-NOT-004: Configurações

- Ativar/desativar por tipo
- Frequência: instantâneo, diário, semanal
- Horários "não perturbe"
- Destinatários por perfil

---

## 9. Relatórios e Análises

### RF-CLI-REL-001: Relatórios Fiscais

**Livro de Serviços Prestados:**
- Notas emitidas no período
- Agrupamento por tomador, CNAE, município
- Totalização de impostos
- Exportação PDF/Excel

**Relatório de ISS:**
- ISS próprio vs retido
- Comparativo mensal
- Análise por alíquota

**Relatório de Tributos Federais:**
- IR, PIS, COFINS, CSLL
- Valores retidos vs a recolher
- Comparativo com período anterior

### RF-CLI-REL-002: Relatórios Gerenciais

**DRE Simplificada:**
- Receita bruta
- Deduções e impostos
- Receita líquida
- Margem de lucro

**Análise de Tomadores:**
- Top 10 clientes
- Faturamento por tomador
- Concentração de receita

### RF-CLI-REL-003: Dashboards Analíticos

- Gráficos interativos
- Filtros dinâmicos
- Drill-down por dimensão
- Exportação de gráficos (PNG)

---

## 10. Configurações da Empresa

### RF-CLI-CONF-001: Dados Cadastrais

- Razão Social e Nome Fantasia
- CNPJ e Inscrições
- Endereço completo
- Contato (telefone, email)
- Responsável legal
- Regime tributário
- CNAEs
- Data de abertura

### RF-CLI-CONF-002: Configurações Fiscais

- Alíquota de ISS padrão
- Município de prestação padrão
- Série de NF-e
- Próximo número de nota
- Código de Tributação padrão
- Retenções padrão

### RF-CLI-CONF-003: Certificado Digital

- Upload de certificado A1 (.pfx)
- Senha (criptografada)
- Exibição de validade
- Alerta de vencimento (30, 15, 7 dias)

### RF-CLI-CONF-004: Preferências

- Logo da empresa
- Idioma (PT-BR)
- Fuso horário
- Formato de data e moeda

---

## 11. Comunicação com o Escritório

### RF-CLI-COM-001: Central de Mensagens

- Chat integrado (estilo WhatsApp)
- Anexo de arquivos (até 10MB)
- Histórico de conversas
- Status: Enviado, Lido, Respondido

### RF-CLI-COM-002: Sistema de Tickets

**Categorias:**
- Dúvida fiscal
- Problema técnico
- Solicitação de documento
- Alteração cadastral
- Outros

**Funcionalidades:**
- Prioridade: Baixa, Média, Alta
- Status: Aberto, Em andamento, Resolvido
- SLA por tipo
- Avaliação do atendimento (1-5 ⭐)

### RF-CLI-COM-003: Base de Conhecimento

- FAQ categorizado
- Tutoriais em vídeo
- Artigos do escritório
- Busca inteligente

---

## 12. Gestão de Usuários da Empresa

### RF-CLI-USR-001: Listagem de Usuários

> ⚠️ **Escopo:** Esta tela mostra **apenas os usuários da empresa atualmente selecionada**, não de todas as empresas do sistema.

**Informações Exibidas:**
- Nome e email
- CPF
- Perfil (Administrador, Operador, Visualizador)
- Status (Ativo, Inativo, Convite Pendente)
- Último acesso
- Data de cadastro

### RF-CLI-USR-002: Convidar Novo Usuário

**Fluxo:**
1. Administrador clica em "Convidar Usuário"
2. Preenche: Nome, Email, CPF, Perfil
3. Sistema envia email com link de convite
4. Usuário aceita e define senha
5. Acesso liberado

**Regras:**
- Apenas perfil **Administrador** pode convidar
- Limite de usuários por plano
- Convite válido por 7 dias

### RF-CLI-USR-003: Perfis e Permissões

| Permissão | Admin | Operador | Visualizador |
|-----------|-------|----------|--------------|
| Emitir NF-e | ✅ | ✅ | ❌ |
| Simular NF-e | ✅ | ✅ | ✅ |
| Upload documentos | ✅ | ✅ | ❌ |
| Download documentos | ✅ | ✅ | ✅ |
| Gerenciar tomadores | ✅ | ✅ | ❌ |
| Visualizar guias | ✅ | ✅ | ✅ |
| Baixar guias | ✅ | ✅ | ✅ |
| Gerenciar usuários | ✅ | ❌ | ❌ |
| Configurações | ✅ | ❌ | ❌ |

### RF-CLI-USR-004: Ações do Administrador

- ✏️ Editar dados do usuário
- 🔄 Alterar perfil
- 🔒 Desativar/Reativar usuário
- 📧 Reenviar convite
- 🗑️ Remover usuário (soft delete)

### RF-CLI-USR-005: Auditoria

- Log de ações por usuário
- Histórico de acessos
- Relatório de atividades

---

## 📊 Resumo de Funcionalidades

### Telas do Portal Cliente

| Módulo | Telas |
|--------|-------|
| **Auth** | Login, Seleção de Empresa, Recuperar Senha, 2FA |
| **Dashboard** | Painel Principal |
| **Documentos** | Lista, Upload, Visualização, Categorias |
| **Notas Fiscais** | Lista, Emissão (Wizard), Simulação, Rascunhos |
| **Tomadores** | Lista, Cadastro, Detalhes |
| **Guias** | Lista, Calendário, Detalhes |
| **Notificações** | Central, Configurações |
| **Relatórios** | Fiscais, Gerenciais, Dashboards |
| **Configurações** | Empresa, Fiscal, Certificado, Preferências |
| **Comunicação** | Mensagens, Tickets, Base de Conhecimento |
| **Usuários** | Lista, Convidar, Permissões |

### Contagem de Requisitos

| Categoria | Quantidade |
|-----------|------------|
| Autenticação | 4 |
| Dashboard | 3 |
| Documentos | 6 |
| Notas Fiscais | 7 |
| Tomadores | 4 |
| Guias | 4 |
| Notificações | 4 |
| Relatórios | 3 |
| Configurações | 4 |
| Comunicação | 3 |
| Usuários | 5 |
| **TOTAL** | **47** |

---

*Documento gerado em Dezembro/2024 - v1.0*
