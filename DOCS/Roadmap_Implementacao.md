# 🚀 Roadmap de Implementação - CNS Contabilidade

## Status Geral do Projeto

**Última atualização:** 12/12/2025  
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

#### 1. Autenticação e Gestão de Acesso (RF-AUTH)

- [ ] **RF-AUTH-001: Login Multi-fator**
  - [ ] Login com CNPJ + senha
  - [ ] Validação de campos
  - [ ] Captcha após 3 tentativas falhas
  - [ ] Bloqueio temporário após 5 tentativas
  - [ ] 2FA via Email/SMS (opcional)
  - [ ] 2FA via Google Authenticator

- [ ] **RF-AUTH-002: Gestão de Sessões**
  - [ ] Implementar refresh token
  - [ ] Logout automático por inatividade
  - [ ] Exibir dispositivos conectados

- [ ] **RF-AUTH-003: Recuperação de Senha**
  - [ ] Validação de CPF do responsável
  - [ ] Token expirável (1 hora)
  - [ ] Força de senha (validações)

- [ ] **RF-AUTH-004: Gestão de Usuários**
  - [ ] Página de listagem de usuários
  - [ ] Modal de convite de usuário
  - [ ] Perfis: Administrador, Operador, Visualizador
  - [ ] Ativar/Desativar usuário

---

#### 2. Dashboard (RF-DASH)

- [ ] **RF-DASH-001: Painel Principal**
  - [x] Resumo financeiro do mês
  - [x] Widget de Notas Fiscais
  - [x] Widget de Guias pendentes
  - [ ] Widget de Documentos recentes
  - [ ] Central de Notificações integrada
  - [ ] Gráficos interativos (Recharts)

- [ ] **RF-DASH-002: Widgets Personalizáveis**
  - [ ] Drag-and-drop para reorganizar
  - [ ] Ocultar/exibir widgets
  - [ ] Salvar preferências no localStorage

- [ ] **RF-DASH-003: Atalhos Rápidos (FAB)**
  - [ ] Botão flutuante com menu
  - [ ] Emitir NF-e rápido
  - [ ] Upload de documento
  - [ ] Falar com contador

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

- [ ] **RF-NF-002: Simulação de NF-e**
  - [ ] Mesmo fluxo sem transmissão
  - [ ] PDF com marca d'água "SIMULAÇÃO"
  - [ ] Converter simulação em emissão

- [ ] **RF-NF-003: Gestão de Rascunhos**
  - [ ] Listagem de rascunhos
  - [ ] Editar/Duplicar/Excluir
  - [ ] Alerta de rascunhos antigos

- [ ] **RF-NF-007: Histórico e Relatórios**
  - [ ] Filtros avançados
  - [ ] Exportação Excel/CSV
  - [ ] Download em lote (ZIP)

- [ ] **RF-NF-008: Cancelamento**
  - [ ] Modal de cancelamento
  - [ ] Justificativa obrigatória
  - [ ] Confirmação em 2 etapas

---

#### 4. Cadastro de Tomadores (RF-TOM)

- [x] **RF-TOM-001: Cadastro Completo**
  - [x] Formulário PJ (CNPJ, Razão Social, etc.)
  - [x] Formulário PF (CPF, Nome, etc.)
  - [x] Endereço com autocomplete CEP

- [ ] **RF-TOM-002: Importação de Dados**
  - [ ] Consulta Receita Federal (CNPJ)
  - [ ] Autocomplete de endereço (CEP)

- [x] **RF-TOM-003: Gestão de Tomadores**
  - [x] Listagem com busca e filtros
  - [x] Modal de edição
  - [ ] Agrupamento por tags

- [ ] **RF-TOM-004: Histórico**
  - [ ] Total de notas emitidas
  - [ ] Faturamento total
  - [ ] Gráfico de relacionamento

---

#### 5. Gestão Documental (RF-DOC)

- [ ] **RF-DOC-001: Upload de Documentos**
  - [x] Upload básico
  - [ ] Drag-and-drop
  - [ ] Preview de arquivos
  - [ ] Progress bar
  - [ ] Validação de tipos/tamanhos

- [ ] **RF-DOC-002: Organização por Categorias**
  - [x] Categorias básicas
  - [ ] Subcategorias
  - [ ] Árvore de navegação
  - [ ] Breadcrumbs

- [ ] **RF-DOC-003: Busca e Filtros**
  - [ ] Busca por nome
  - [ ] Filtro por categoria
  - [ ] Filtro por período
  - [ ] Filtro por tipo de arquivo

- [ ] **RF-DOC-004: Visualização**
  - [ ] Viewer inline para PDF
  - [ ] Viewer inline para imagens
  - [ ] Download individual
  - [ ] Download em lote (ZIP)

---

#### 6. Guias e Obrigações (RF-GUIA)

- [x] **RF-GUIA-001: Listagem de Guias**
  - [x] Cards de resumo
  - [x] Tabela com status
  - [x] Filtros por status

- [ ] **RF-GUIA-003: Calendário de Obrigações**
  - [x] Visualização de calendário
  - [ ] Filtro por tipo de guia
  - [ ] Lembretes configuráveis

- [ ] **RF-GUIA-004: Controle de Vencimentos**
  - [x] Alertas visuais
  - [ ] Badge no menu lateral
  - [ ] Notificação push

- [ ] **RF-GUIA-005: Comprovação de Pagamento**
  - [x] Upload de comprovante
  - [ ] Marcação como paga
  - [ ] Histórico de pagamentos

---

#### 7. Sistema de Notificações (RF-NOT)

- [ ] **RF-NOT-001: Tipos de Notificações**
  - [ ] Críticas (vermelho)
  - [ ] Importantes (amarelo)
  - [ ] Informativas (azul)

- [ ] **RF-NOT-002: Central de Notificações**
  - [ ] Dropdown no header
  - [ ] Badge com contador
  - [ ] Listagem ordenada
  - [ ] Marcar como lida
  - [ ] Histórico (30 dias)

- [ ] **RF-NOT-004: Configurações**
  - [ ] Ativar/desativar por tipo
  - [ ] Frequência de envio
  - [ ] Horários permitidos

---

#### 8. Relatórios e Análises (RF-REL)

- [ ] **RF-REL-001: Relatórios Fiscais**
  - [ ] Livro de Serviços Prestados
  - [ ] Relatório de ISS
  - [ ] Relatório de Tributos Federais
  - [ ] Exportação PDF/Excel

- [ ] **RF-REL-002: Relatórios Gerenciais**
  - [ ] DRE Simplificada
  - [ ] Fluxo de Caixa Fiscal
  - [ ] Análise de Tomadores
  - [ ] Top 10 clientes

- [ ] **RF-REL-003: Dashboards Analíticos**
  - [ ] Gráficos interativos
  - [ ] Filtros dinâmicos
  - [ ] Exportação de gráficos

---

#### 9. Configurações da Empresa (RF-CONF)

- [ ] **RF-CONF-001: Dados Cadastrais**
  - [ ] Razão Social / Nome Fantasia
  - [ ] CNPJ / Inscrições
  - [ ] Endereço completo
  - [ ] Responsável legal

- [ ] **RF-CONF-002: Configurações Fiscais**
  - [ ] Alíquota de ISS padrão
  - [ ] Município de prestação
  - [ ] Série de NF-e
  - [ ] Retenções padrão

- [ ] **RF-CONF-003: Certificado Digital**
  - [ ] Upload de certificado A1
  - [ ] Validação de senha
  - [ ] Exibir validade
  - [ ] Alerta de vencimento

- [ ] **RF-CONF-005: Preferências**
  - [ ] Upload de logo
  - [x] Tema claro/escuro
  - [ ] Configurações de idioma

---

#### 10. Comunicação com Escritório (RF-COM)

- [ ] **RF-COM-001: Central de Mensagens**
  - [ ] Interface de chat
  - [ ] Anexo de arquivos
  - [ ] Status de leitura
  - [ ] Histórico

- [ ] **RF-COM-002: Sistema de Tickets**
  - [ ] Abertura de chamado
  - [ ] Categorias (Dúvida, Problema, Solicitação)
  - [ ] Prioridade
  - [ ] Status (Aberto, Em andamento, Resolvido)
  - [ ] Avaliação do atendimento

- [ ] **RF-COM-003: Base de Conhecimento**
  - [ ] FAQ categorizado
  - [ ] Artigos/Tutoriais
  - [ ] Busca inteligente

---

## 🖥️ FRONTEND - Portal Administrativo (Escritório)

### 🔴 Não Iniciado

#### 11. Painel do Contador (RF-ADM)

- [ ] **RF-ADM-001: Visão Geral de Clientes**
  - [ ] Dashboard com métricas agregadas
  - [ ] Listagem de empresas clientes
  - [ ] Status por cliente (Ativo, Inadimplente, Bloqueado)
  - [ ] Alertas por cliente
  - [ ] Filtros e busca avançada

- [ ] **RF-ADM-002: Gestão de Clientes**
  - [ ] Cadastro de nova empresa
  - [ ] Edição de dados fiscais
  - [ ] Upload em nome do cliente
  - [ ] Envio de guias em lote
  - [ ] Bloqueio/desbloqueio de acesso
  - [ ] Configurações por cliente

- [ ] **RF-ADM-003: Monitoramento**
  - [ ] Notas emitidas (todas empresas)
  - [ ] Guias vencendo
  - [ ] Tickets abertos
  - [ ] Alertas críticos
  - [ ] Log de atividades

- [ ] **RF-ADM-004: Comunicação em Massa**
  - [ ] Envio de comunicados
  - [ ] Segmentação de clientes
  - [ ] Agendamento de envios
  - [ ] Templates de mensagem

- [ ] **RF-ADM-005: Configuração de Serviços**
  - [ ] Ativar/desativar módulos
  - [ ] Limites por cliente
  - [ ] SLA de atendimento
  - [ ] Personalização white-label

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

### Sprint 5 (Semana 9-10) - Admin
- [ ] Portal Administrativo
- [ ] Painel do Contador
- [ ] Gestão de Clientes

### Sprint 6 (Semana 11-12) - Backend
- [ ] API REST inicial
- [ ] Autenticação
- [ ] Integrações

---

## 🎨 Próxima Implementação

**Prioridade Alta:**
1. ✨ Wizard de Emissão de NF-e (3 etapas)
2. 🔔 Central de Notificações
3. ⚙️ Página de Configurações

**Vamos começar pelo Wizard de Emissão de NF-e!**
