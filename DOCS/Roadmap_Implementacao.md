# 🚀 Roadmap de Implementação - CNS Contabilidade

## Status Geral do Projeto

**Última atualização:** 13/12/2025  
**Versão:** 1.0.0-alpha

---

## 📱 FRONTEND - Portal do Cliente

### ✅ Concluído

- [x] Estrutura inicial do projeto (React + TypeScript + Vite)
- [x] Configuração Material-UI v6
- [x] Redux Toolkit com slices básicos
- [x] React Router com rotas protegidas
- [x] Layout principal (Sidebar + Header)
- [x] Sidebar retrátil com navegação
- [x] Tema claro/escuro
- [x] Página de Login básica
- [x] Página de Recuperação de Senha
- [x] Dashboard com cards de resumo
- [x] Calendário de obrigações
- [x] Listagem de Notas Fiscais (mock)
- [x] Listagem de Tomadores (mock)
- [x] Listagem de Guias/Impostos (mock)
- [x] Listagem de Documentos (mock)

---

### 🔄 Em Desenvolvimento

#### 1. Autenticação e Gestão de Acesso (RF-AUTH) - Parcialmente Implementado

- [x] **RF-AUTH-001: Login Multi-fator**
  - [x] Login com CNPJ + senha
  - [x] Validação de campos
  - [x] Captcha após 3 tentativas falhas
  - [x] Bloqueio temporário após 5 tentativas
  - [x] 2FA via Google Authenticator (UI pronta)
  - [ ] 2FA via Email/SMS (opcional)

- [ ] **RF-AUTH-002: Gestão de Sessões** 🔄 Parcialmente Implementado
  - [x] Exibir dispositivos conectados (DispositivosPage)
  - [x] Encerrar sessão de dispositivos remotamente
  - [x] Encerrar todas as sessões de uma vez
  - [x] Identificar sessão atual
  - [x] Alertas de dispositivos inativos (+7 dias)
  - [ ] Implementar refresh token automático
  - [ ] Logout automático por inatividade

- [ ] **RF-AUTH-003: Recuperação de Senha**
  - [x] Página de recuperação básica
  - [ ] Validação de CPF do responsável
  - [ ] Token expirável (1 hora)
  - [ ] Força de senha (validações)

- [ ] **RF-AUTH-004: Gestão de Usuários** ✅ IMPLEMENTADO
  - [x] Página de listagem de usuários
  - [x] Modal de convite de usuário
  - [x] Perfis: Administrador, Operador, Visualizador
  - [x] Ativar/Desativar usuário

---

#### 2. Dashboard (RF-DASH) ✅ IMPLEMENTADO

- [x] **RF-DASH-001: Painel Principal**
  - [x] Resumo financeiro do mês
  - [x] Widget de Notas Fiscais
  - [x] Widget de Guias pendentes
  - [x] Widget de Documentos recentes
  - [x] Central de Notificações integrada
  - [x] Gráficos interativos (Recharts)

- [x] **RF-DASH-002: Widgets Personalizáveis**
  - [x] Drag-and-drop para reorganizar
  - [x] Ocultar/exibir widgets
  - [x] Salvar preferências no localStorage

- [x] **RF-DASH-003: Atalhos Rápidos (FAB)**
  - [x] Botão flutuante com menu
  - [x] Emitir NF-e rápido
  - [x] Upload de documento
  - [x] Falar com contador

---

#### 3. Emissão de Notas Fiscais (RF-NF)

- [x] **RF-NF-001: Fluxo de Emissão (Wizard)** ✅ IMPLEMENTADO
  - [x] Etapa 1: Seleção de Tomador
    - [x] Busca por CNPJ/CPF/Nome
    - [x] Criação rápida inline (modal placeholder)
    - [x] Últimos tomadores utilizados
  - [x] Etapa 2: Dados do Serviço
    - [x] Descrição com autocomplete
    - [x] Seleção de CNAE
    - [x] Código de Tributação Municipal
    - [x] Cálculo automático de tributos
    - [x] Retenções (IR, PIS, COFINS, CSLL, INSS)
  - [x] Etapa 3: Revisão e Confirmação
    - [x] Preview da NF-e
    - [x] Resumo de tributos
    - [ ] Botões: Salvar Rascunho / Emitir

- [x] **RF-NF-002: Simulação de NF-e** ✅ IMPLEMENTADO
  - [x] Mesmo fluxo sem transmissão
  - [x] PDF com marca d'água "SIMULAÇÃO"
  - [x] Converter simulação em emissão
  - [x] Dialog de resultado com preview
  - [x] Compartilhar link da simulação

- [x] **RF-NF-003: Gestão de Rascunhos** ✅ IMPLEMENTADO
  - [x] Listagem de rascunhos com busca
  - [x] Editar/Duplicar/Excluir
  - [x] Alerta de rascunhos antigos (+7 dias)
  - [x] Estatísticas (prontos, incompletos, antigos)
  - [x] Badge no menu lateral

- [x] **RF-NF-007: Histórico e Relatórios** ✅ IMPLEMENTADO
  - [x] Filtros avançados
  - [x] Exportação Excel/CSV
  - [x] Download em lote (ZIP)

- [x] **RF-NF-008: Cancelamento** ✅ IMPLEMENTADO
  - [x] Modal de cancelamento
  - [x] Justificativa obrigatória
  - [x] Confirmação em 2 etapas

---

#### 4. Cadastro de Tomadores (RF-TOM)

- [x] **RF-TOM-001: Cadastro Completo**
  - [x] Formulário PJ (CNPJ, Razão Social, etc.)
  - [x] Formulário PF (CPF, Nome, etc.)
  - [x] Endereço com autocomplete CEP

- [x] **RF-TOM-002: Importação de Dados** ✅ IMPLEMENTADO
  - [x] Consulta Receita Federal (CNPJ)
  - [x] Dialog com visualização completa dos dados
  - [x] Importação automática para formulário
  - [x] Autocomplete de endereço (CEP via ViaCEP)

- [x] **RF-TOM-003: Gestão de Tomadores** ✅ IMPLEMENTADO
  - [x] Listagem com busca e filtros
  - [x] Modal de edição
  - [x] Sistema de tags coloridas
  - [x] Filtro por múltiplas tags

- [x] **RF-TOM-004: Histórico** ✅ IMPLEMENTADO
  - [x] Total de notas emitidas
  - [x] Faturamento total
  - [x] Gráfico de relacionamento (AreaChart)
  - [x] Ticket médio
  - [x] Variação mensal
  - [x] Listagem de notas do tomador
  - [x] Dados cadastrais completos

---

#### 5. Gestão Documental (RF-DOC) ✅ IMPLEMENTADO

- [x] **RF-DOC-001: Upload de Documentos**
  - [x] Upload básico
  - [x] Drag-and-drop
  - [x] Preview de arquivos
  - [x] Progress bar
  - [x] Validação de tipos/tamanhos

- [x] **RF-DOC-002: Organização por Categorias**
  - [x] Categorias básicas
  - [x] Subcategorias
  - [x] Árvore de navegação
  - [x] Breadcrumbs

- [x] **RF-DOC-003: Busca e Filtros**
  - [x] Busca por nome
  - [x] Filtro por categoria
  - [x] Filtro por período
  - [x] Filtro por tipo de arquivo
  - [x] Filtro por competência
  - [x] Filtro por tags

- [x] **RF-DOC-004: Visualização**
  - [x] Viewer inline para PDF
  - [x] Viewer inline para imagens
  - [x] Download individual
  - [x] Download em lote (ZIP) com progresso
  - [x] Compartilhamento (link/email)

---

#### 6. Guias e Obrigações (RF-GUIA) ✅ IMPLEMENTADO

- [x] **RF-GUIA-001: Listagem de Guias**
  - [x] Cards de resumo
  - [x] Tabela com status
  - [x] Filtros por status

- [x] **RF-GUIA-003: Calendário de Obrigações** ✅ IMPLEMENTADO
  - [x] Visualização de calendário
  - [x] Filtro por tipo de guia (imposto, declaração, folha, outros)
  - [x] Filtro por status (pagos, pendentes)
  - [ ] Lembretes configuráveis (push notifications)

- [x] **RF-GUIA-004: Controle de Vencimentos** ✅ IMPLEMENTADO
  - [x] Alertas visuais
  - [x] Badge no menu lateral (guias pendentes)
  - [ ] Notificação push

- [x] **RF-GUIA-005: Comprovação de Pagamento** ✅ IMPLEMENTADO
  - [x] Upload de comprovante
  - [x] Dialog "Marcar como Paga" completo
  - [x] Histórico de pagamentos com gráficos
  - [x] Análise por tipo de guia (pizza chart)
  - [x] Análise por mês (bar chart)

---

#### 7. Sistema de Notificações (RF-NOT) ✅ IMPLEMENTADO

- [x] **RF-NOT-001: Tipos de Notificações**
  - [x] Críticas (vermelho)
  - [x] Importantes (amarelo)
  - [x] Informativas (azul)

- [x] **RF-NOT-002: Central de Notificações**
  - [x] Dropdown no header
  - [x] Badge com contador
  - [x] Listagem ordenada
  - [x] Marcar como lida
  - [x] Histórico (30 dias)

- [x] **RF-NOT-004: Configurações**
  - [x] Ativar/desativar por tipo
  - [x] Frequência de envio
  - [x] Horários permitidos

---

#### 8. Relatórios e Análises (RF-REL) ✅ IMPLEMENTADO

- [x] **RF-REL-001: Relatórios Fiscais**
  - [x] Livro de Serviços Prestados
  - [x] Relatório de ISS
  - [x] Relatório de Tributos Federais
  - [x] Exportação PDF/Excel (botões implementados)

- [x] **RF-REL-002: Relatórios Gerenciais**
  - [x] DRE Simplificada
  - [x] Fluxo de Caixa Fiscal
  - [x] Análise de Tomadores
  - [x] Top 10 clientes

- [x] **RF-REL-003: Dashboards Analíticos**
  - [x] Gráficos interativos (Recharts)
  - [x] Filtros dinâmicos
  - [x] Exportação de gráficos (botões implementados)

---

#### 9. Configurações da Empresa (RF-CONF) ✅ IMPLEMENTADO

- [x] **RF-CONF-001: Dados Cadastrais**
  - [x] Razão Social / Nome Fantasia
  - [x] CNPJ / Inscrições
  - [x] Endereço completo
  - [x] Responsável legal

- [x] **RF-CONF-002: Configurações Fiscais**
  - [x] Alíquota de ISS padrão
  - [x] Município de prestação
  - [x] Série de NF-e
  - [x] Retenções padrão

- [x] **RF-CONF-003: Certificado Digital**
  - [x] Upload de certificado A1
  - [x] Validação de senha
  - [x] Exibir validade
  - [x] Alerta de vencimento

- [x] **RF-CONF-005: Preferências**
  - [x] Upload de logo
  - [x] Tema claro/escuro
  - [x] Configurações de idioma

---

#### 10. Comunicação com Escritório (RF-COM) ✅ IMPLEMENTADO

- [x] **RF-COM-001: Central de Mensagens**
  - [x] Interface de chat
  - [x] Anexo de arquivos
  - [x] Status de leitura
  - [x] Histórico

- [x] **RF-COM-002: Sistema de Tickets**
  - [x] Abertura de chamado
  - [x] Categorias (Dúvida, Problema, Solicitação)
  - [x] Prioridade
  - [x] Status (Aberto, Em andamento, Resolvido)
  - [x] Avaliação do atendimento

- [x] **RF-COM-003: Base de Conhecimento**
  - [x] FAQ categorizado
  - [x] Artigos/Tutoriais
  - [x] Busca inteligente

---

## 🖥️ FRONTEND - Portal Administrativo (Escritório)

### ✅ Em Desenvolvimento (Sprint 5)

#### 11. Painel do Contador (RF-ADM)

- [x] **RF-ADM-001: Visão Geral de Clientes** ✅ IMPLEMENTADO
  - [x] Dashboard com métricas agregadas
  - [x] Cards: Clientes ativos, Faturamento, Guias pendentes, Tickets
  - [x] Gráfico de faturamento semanal (AreaChart)
  - [x] Gráfico de clientes por regime tributário (PieChart)
  - [x] Lista de alertas críticos
  - [x] Lista de atividades recentes
  - [x] Tabela de clientes com pendências

- [x] **RF-ADM-002: Gestão de Clientes** ✅ IMPLEMENTADO
  - [x] Listagem de empresas clientes com busca
  - [x] Filtros por status (Ativo, Inadimplente, Bloqueado)
  - [x] Abas por regime tributário
  - [x] Dialog de detalhes do cliente
  - [x] Ações: Visualizar, Editar, Bloquear/Desbloquear
  - [x] Métricas por cliente (notas, guias, tickets)
  - [ ] Cadastro de nova empresa (formulário completo)
  - [ ] Upload em nome do cliente

- [x] **RF-ADM-003: Monitoramento** ✅ IMPLEMENTADO
  - [x] Central de Alertas com abas (Crítico, Importante, Informativo)
  - [x] Filtro de alertas por categoria
  - [x] Seleção em lote de alertas
  - [x] Marcar como lido / Marcar como resolvido
  - [x] Badge de contador no menu
  - [ ] Log detalhado de atividades

- [x] **RF-ADM-004: Comunicação em Massa** ✅ IMPLEMENTADO
  - [x] Listagem de comunicados enviados
  - [x] Wizard de 3 etapas (Conteúdo, Destinatários, Revisão)
  - [x] Segmentação por tipo (todos, regime, inadimplentes, etc.)
  - [x] Templates de mensagem (urgente, informativo, lembrete)
  - [x] Agendamento de envios
  - [x] Estatísticas de leitura
  - [ ] Histórico detalhado de envios

- [ ] **RF-ADM-005: Configuração de Serviços**
  - [ ] Ativar/desativar módulos
  - [ ] Limites por cliente
  - [ ] SLA de atendimento
  - [ ] Personalização white-label

---

## 📋 ROADMAP DETALHADO - PORTAL ADMINISTRATIVO

### 🎯 Visão Geral

O Portal Administrativo é a interface do escritório de contabilidade para gerenciar todos os clientes, monitorar obrigações fiscais, comunicar-se em massa e configurar o sistema. 

**URL de Produção:** `admin.cnscontabil.com.br`  
**Porta de Desenvolvimento:** `5174`

---

### 📊 FASE 1: Estrutura Base (✅ CONCLUÍDA)

**Duração:** 1 semana  
**Status:** ✅ Implementado

| Funcionalidade | Status | Descrição |
|----------------|--------|-----------|
| Estrutura Vite + React + TS | ✅ | Projeto configurado com TypeScript strict |
| Material-UI v6 | ✅ | Tema profissional azul escuro (#1e3a5f) |
| Redux Toolkit | ✅ | Slices: auth, ui, clientes, monitoramento |
| React Router | ✅ | Rotas com lazy loading |
| Layout Responsivo | ✅ | Sidebar retrátil + Header com busca |

---

### 📈 FASE 2: Dashboard do Contador (✅ CONCLUÍDA)

**Duração:** 1 semana  
**Status:** ✅ Implementado

#### RF-ADM-DASH: Painel Principal

| Componente | Status | Descrição |
|------------|--------|-----------|
| Cards de Métricas | ✅ | Clientes ativos, Faturamento, Guias, Tickets |
| Gráfico Faturamento | ✅ | AreaChart semanal com valores |
| Gráfico Regime Tributário | ✅ | PieChart (Simples, Presumido, Real) |
| Lista de Alertas | ✅ | Top 5 alertas críticos |
| Atividades Recentes | ✅ | Timeline de ações dos clientes |
| Clientes com Pendências | ✅ | Tabela resumida |

**Próximas Melhorias:**
- [ ] Filtro por período (7d, 30d, 90d, 12m)
- [ ] Exportar métricas para PDF
- [ ] Comparativo mês anterior
- [ ] Meta de faturamento

---

### 👥 FASE 3: Gestão de Clientes (✅ CONCLUÍDA)

**Duração:** 2 semanas  
**Status:** ✅ Parcialmente implementado

#### RF-ADM-CLI-001: Listagem de Clientes

| Funcionalidade | Status | Descrição |
|----------------|--------|-----------|
| Tabela com busca | ✅ | Busca por nome, CNPJ, responsável |
| Filtros por status | ✅ | Ativo, Inadimplente, Bloqueado |
| Abas por regime | ✅ | Simples Nacional, Lucro Presumido, Lucro Real |
| Paginação | ✅ | 10, 25, 50 itens por página |
| Menu de contexto | ✅ | Visualizar, Editar, Bloquear |

#### RF-ADM-CLI-002: Detalhes do Cliente

| Funcionalidade | Status | Descrição |
|----------------|--------|-----------|
| Dialog informativo | ✅ | Dados cadastrais, contatos |
| Métricas do cliente | ✅ | Notas emitidas, guias, tickets |
| Histórico resumido | ✅ | Últimas atividades |
| Ações rápidas | ✅ | Bloquear, enviar mensagem |

#### RF-ADM-CLI-003: Cadastro de Cliente (🔄 PENDENTE)

| Funcionalidade | Status | Prioridade |
|----------------|--------|------------|
| Wizard de cadastro | ❌ | Alta |
| Dados da empresa | ❌ | Alta |
| Dados do responsável | ❌ | Alta |
| Configuração fiscal | ❌ | Alta |
| Documentos iniciais | ❌ | Média |
| Certificado digital | ❌ | Alta |

**Campos do Cadastro:**
```
Etapa 1 - Dados Básicos:
- CNPJ (com consulta Receita Federal)
- Razão Social / Nome Fantasia
- Inscrição Estadual / Municipal
- Data de abertura
- CNAE Principal / Secundários

Etapa 2 - Endereço:
- CEP (autocomplete ViaCEP)
- Logradouro, Número, Complemento
- Bairro, Cidade, UF

Etapa 3 - Responsável:
- Nome completo
- CPF
- Email / Telefone
- Cargo

Etapa 4 - Configuração Fiscal:
- Regime Tributário
- Alíquota ISS padrão
- Município de prestação
- Retenções padrão

Etapa 5 - Acesso:
- Criar usuário administrador
- Definir senha inicial
- Enviar email de boas-vindas
```

---

### 🚨 FASE 4: Monitoramento e Alertas (✅ CONCLUÍDA)

**Duração:** 1 semana  
**Status:** ✅ Implementado

#### RF-ADM-MON-001: Central de Alertas

| Funcionalidade | Status | Descrição |
|----------------|--------|-----------|
| Abas por prioridade | ✅ | Crítico, Importante, Informativo |
| Filtro por categoria | ✅ | Guia, Sistema, Documento, Ticket |
| Seleção em lote | ✅ | Marcar múltiplos como lido/resolvido |
| Badge no menu | ✅ | Contador de não lidos |

#### RF-ADM-MON-002: Tipos de Alertas

| Tipo | Cor | Exemplos |
|------|-----|----------|
| Crítico | 🔴 Vermelho | Guia vencida, Certificado expirado |
| Importante | 🟡 Amarelo | Guia vencendo em 3 dias, Ticket sem resposta |
| Informativo | 🔵 Azul | Documento enviado, Nota emitida |

#### RF-ADM-MON-003: Log de Atividades (🔄 PENDENTE)

| Funcionalidade | Status | Prioridade |
|----------------|--------|------------|
| Timeline global | ❌ | Média |
| Filtro por cliente | ❌ | Média |
| Filtro por tipo | ❌ | Média |
| Exportar log | ❌ | Baixa |

---

### 📢 FASE 5: Comunicação (✅ CONCLUÍDA)

**Duração:** 1 semana  
**Status:** ✅ Implementado

#### RF-ADM-COM-001: Comunicados em Massa

| Funcionalidade | Status | Descrição |
|----------------|--------|-----------|
| Wizard 3 etapas | ✅ | Conteúdo → Destinatários → Revisão |
| Tipos de mensagem | ✅ | Urgente, Informativo, Lembrete |
| Segmentação | ✅ | Todos, Regime, Inadimplentes, Tags |
| Agendamento | ✅ | Data/hora futura |
| Templates | ✅ | Salvar e reutilizar |
| Estatísticas | ✅ | Taxa de leitura |

#### RF-ADM-COM-002: Mensagens Individuais (🔄 PENDENTE)

| Funcionalidade | Status | Prioridade |
|----------------|--------|------------|
| Chat com cliente | ❌ | Alta |
| Histórico de conversas | ❌ | Alta |
| Anexo de arquivos | ❌ | Média |
| Notificação push | ❌ | Média |

---

### ⚙️ FASE 6: Configurações (🔴 NÃO INICIADA)

**Duração:** 2 semanas  
**Status:** 🔴 Pendente

#### RF-ADM-CFG-001: Configurações do Escritório

| Funcionalidade | Status | Prioridade |
|----------------|--------|------------|
| Dados do escritório | ❌ | Alta |
| Logo e identidade visual | ❌ | Média |
| Horário de funcionamento | ❌ | Baixa |
| Certificado digital do escritório | ❌ | Alta |

#### RF-ADM-CFG-002: Gestão de Usuários Internos

| Funcionalidade | Status | Prioridade |
|----------------|--------|------------|
| Listagem de colaboradores | ❌ | Alta |
| Perfis de acesso | ❌ | Alta |
| Convite por email | ❌ | Alta |
| Permissões granulares | ❌ | Média |

**Perfis Sugeridos:**
```
👑 Administrador: Acesso total
📊 Contador: Clientes, Notas, Guias, Relatórios
📝 Assistente: Visualização, Documentos, Tickets
👀 Visualizador: Apenas leitura
```

#### RF-ADM-CFG-003: Configuração de Serviços

| Funcionalidade | Status | Prioridade |
|----------------|--------|------------|
| Módulos ativos | ❌ | Média |
| Limites por plano | ❌ | Média |
| SLA de atendimento | ❌ | Baixa |
| White-label | ❌ | Baixa |

#### RF-ADM-CFG-004: Integrações

| Funcionalidade | Status | Prioridade |
|----------------|--------|------------|
| Webhooks | ❌ | Baixa |
| API de terceiros | ❌ | Baixa |
| Importação CSV | ❌ | Média |
| Exportação em lote | ❌ | Média |

---

### 📊 FASE 7: Relatórios Gerenciais (🔴 NÃO INICIADA)

**Duração:** 2 semanas  
**Status:** 🔴 Pendente

#### RF-ADM-REL-001: Relatórios do Escritório

| Relatório | Status | Descrição |
|-----------|--------|-----------|
| Faturamento por cliente | ❌ | Mensal/Anual por empresa |
| Notas emitidas | ❌ | Volume por período |
| Guias processadas | ❌ | Por tipo de imposto |
| Tickets atendidos | ❌ | Tempo médio de resposta |
| Performance da equipe | ❌ | Ações por colaborador |

#### RF-ADM-REL-002: Dashboards Analíticos

| Dashboard | Status | Descrição |
|-----------|--------|-----------|
| Visão executiva | ❌ | KPIs principais |
| Comparativo | ❌ | Mês a mês / Ano a ano |
| Previsões | ❌ | Projeção de faturamento |
| Inadimplência | ❌ | Análise de risco |

---

### 🔌 FASE 8: Operações em Lote (🔴 NÃO INICIADA)

**Duração:** 1 semana  
**Status:** 🔴 Pendente

#### RF-ADM-LOTE-001: Ações em Massa

| Funcionalidade | Status | Prioridade |
|----------------|--------|------------|
| Envio de guias em lote | ❌ | Alta |
| Geração de relatórios múltiplos | ❌ | Média |
| Atualização cadastral em massa | ❌ | Baixa |
| Bloqueio/Desbloqueio múltiplo | ❌ | Média |

#### RF-ADM-LOTE-002: Importação/Exportação

| Funcionalidade | Status | Prioridade |
|----------------|--------|------------|
| Importar clientes CSV | ❌ | Média |
| Exportar base completa | ❌ | Média |
| Backup de documentos | ❌ | Alta |
| Migração de dados | ❌ | Baixa |

---

### 📅 CRONOGRAMA DE IMPLEMENTAÇÃO

```
┌─────────────────────────────────────────────────────────────────┐
│ SPRINT 6 (Semana 1-2)                                           │
├─────────────────────────────────────────────────────────────────┤
│ ▸ Cadastro completo de clientes (Wizard 5 etapas)               │
│ ▸ Chat individual com cliente                                    │
│ ▸ Log de atividades global                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ SPRINT 7 (Semana 3-4)                                           │
├─────────────────────────────────────────────────────────────────┤
│ ▸ Configurações do escritório                                    │
│ ▸ Gestão de usuários internos                                    │
│ ▸ Perfis e permissões                                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ SPRINT 8 (Semana 5-6)                                           │
├─────────────────────────────────────────────────────────────────┤
│ ▸ Relatórios gerenciais                                          │
│ ▸ Dashboards analíticos                                          │
│ ▸ Exportação de dados                                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ SPRINT 9 (Semana 7-8)                                           │
├─────────────────────────────────────────────────────────────────┤
│ ▸ Operações em lote                                              │
│ ▸ Integrações                                                    │
│ ▸ White-label                                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

### 🎯 PRIORIDADES IMEDIATAS

**Alta Prioridade (Próximas 2 semanas):**
1. 🏢 Wizard de cadastro de cliente completo
2. 💬 Sistema de chat individual
3. 📋 Log de atividades
4. 👥 Gestão de usuários internos

**Média Prioridade (Próximo mês):**
1. 📊 Relatórios gerenciais
2. ⚙️ Configurações do escritório
3. 📤 Envio de guias em lote
4. 📥 Importação/Exportação CSV

**Baixa Prioridade (Futuro):**
1. 🎨 White-label
2. 🔌 Webhooks e API
3. 📈 Previsões e análises avançadas

---

### 📁 ESTRUTURA DE ARQUIVOS DO ADMIN

```
frontend-admin/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx       ✅
│   │   │   ├── Header.tsx        ✅
│   │   │   └── MainLayout.tsx    ✅
│   │   └── shared/
│   │       ├── DataTable.tsx     ❌ (criar)
│   │       ├── WizardStepper.tsx ❌ (criar)
│   │       └── Charts.tsx        ❌ (criar)
│   ├── features/
│   │   ├── dashboard/
│   │   │   └── pages/DashboardPage.tsx    ✅
│   │   ├── clientes/
│   │   │   ├── pages/ClientesPage.tsx     ✅
│   │   │   ├── pages/NovoClientePage.tsx  ❌ (criar)
│   │   │   └── pages/ClienteDetalhesPage.tsx ❌ (criar)
│   │   ├── monitoramento/
│   │   │   ├── pages/AlertasPage.tsx      ✅
│   │   │   └── pages/AtividadesPage.tsx   ❌ (criar)
│   │   ├── comunicacao/
│   │   │   ├── pages/ComunicadosPage.tsx  ✅
│   │   │   └── pages/MensagensPage.tsx    ❌ (criar)
│   │   ├── relatorios/
│   │   │   ├── pages/RelatoriosPage.tsx   ❌ (criar)
│   │   │   └── pages/DashboardAnalitico.tsx ❌ (criar)
│   │   └── configuracoes/
│   │       ├── pages/ConfiguracoesPage.tsx ❌ (criar)
│   │       ├── pages/UsuariosPage.tsx      ❌ (criar)
│   │       └── pages/InttegracoesPage.tsx  ❌ (criar)
│   ├── store/
│   │   └── slices/
│   │       ├── authSlice.ts           ✅
│   │       ├── uiSlice.ts             ✅
│   │       ├── clientesSlice.ts       ✅
│   │       ├── monitoramentoSlice.ts  ✅
│   │       ├── comunicacaoSlice.ts    ❌ (criar)
│   │       └── relatoriosSlice.ts     ❌ (criar)
│   └── services/
│       ├── api.ts                     ❌ (criar)
│       ├── clientesService.ts         ❌ (criar)
│       └── relatoriosService.ts       ❌ (criar)
```

---

## 🔧 BACKEND (A ser desenvolvido)

### API REST - Node.js + Express

- [ ] Estrutura inicial do projeto
- [ ] Autenticação JWT
- [ ] CRUD de Empresas
- [ ] CRUD de Usuários
- [ ] CRUD de Tomadores
- [ ] CRUD de Notas Fiscais
- [ ] CRUD de Documentos
- [ ] CRUD de Guias
- [ ] Sistema de Notificações
- [ ] Integração com prefeituras (NFS-e)
- [ ] Relatórios
- [ ] Webhooks

### Banco de Dados - PostgreSQL

- [ ] Modelagem de dados
- [ ] Migrations
- [ ] Seeds de desenvolvimento

---

## 📅 Cronograma Sugerido

### Sprint 1 (Semana 1-2) - Core
- [ ] Wizard de Emissão de NF-e
- [ ] Central de Notificações
- [ ] Melhorias no Dashboard

### Sprint 2 (Semana 3-4) - Configurações
- [ ] Página de Configurações da Empresa
- [ ] Gestão de Usuários
- [ ] Upload melhorado de documentos

### Sprint 3 (Semana 5-6) - Relatórios
- [ ] Relatórios Fiscais
- [ ] Relatórios Gerenciais
- [ ] Exportações

### Sprint 4 (Semana 7-8) - Comunicação
- [ ] Chat com escritório
- [ ] Sistema de Tickets
- [ ] Base de Conhecimento

### Sprint 5 (Semana 9-10) - Admin ✅ EM ANDAMENTO
- [x] Portal Administrativo (estrutura)
- [x] Painel do Contador (Dashboard)
- [x] Gestão de Clientes
- [x] Central de Alertas
- [x] Comunicação em Massa
- [ ] Configurações de Serviços

### Sprint 6 (Semana 11-12) - Backend
- [ ] API REST inicial
- [ ] Autenticação
- [ ] Integrações

---

## 🎨 Próxima Implementação

**Portal Admin - Próximos Passos:**
1. 🏢 Formulário completo de cadastro de empresa
2. 📤 Upload em nome do cliente
3. 📋 Log detalhado de atividades
4. ⚙️ Configuração de Serviços (RF-ADM-005)

**Backend - Prioridade:**
1. 🔧 Estrutura inicial da API (Node.js + Express)
2. 🔐 Autenticação JWT
3. 🗄️ Modelagem PostgreSQL
