# Portal Administrativo (Escritório) - Documento de Requisitos

## Versão 1.0 | Dezembro 2024

---

## 📋 Sumário

1. [Visão Geral](#1-visão-geral)
2. [Autenticação e Acesso](#2-autenticação-e-acesso)
3. [Dashboard do Escritório](#3-dashboard-do-escritório)
4. [Gestão de Clientes](#4-gestão-de-clientes)
5. [Gestão de Usuários Global](#5-gestão-de-usuários-global)
6. [Monitoramento e Alertas](#6-monitoramento-e-alertas)
7. [Documentos e Guias](#7-documentos-e-guias)
8. [Comunicação](#8-comunicação)
9. [Relatórios Gerenciais](#9-relatórios-gerenciais)
10. [Configurações do Escritório](#10-configurações-do-escritório)
11. [Integrações](#11-integrações)

---

## 1. Visão Geral

### 1.1 Propósito do Portal

O **Portal Administrativo** é a interface exclusiva para o escritório de contabilidade, permitindo:

- Gestão completa de todas as empresas clientes
- Visão consolidada de métricas e alertas
- Upload de guias e documentos em nome dos clientes
- Comunicação em massa com clientes
- Configurações avançadas do sistema
- Monitoramento de atividades e segurança

### 1.2 Público-Alvo

| Perfil | Descrição | Acesso |
|--------|-----------|--------|
| 👑 **Administrador** | Sócio/Proprietário do escritório | Total |
| 📊 **Contador** | Contador responsável | Clientes, Notas, Guias, Relatórios |
| 📝 **Assistente** | Auxiliar administrativo | Visualização, Documentos, Tickets |
| 👀 **Visualizador** | Acesso somente leitura | Consultas |

### 1.3 Diferenciação: Portal Admin vs Portal Cliente

| Aspecto | Portal Administrativo | Portal Cliente |
|---------|----------------------|----------------|
| **URL** | admin.dominio.com.br | app.dominio.com.br |
| **Público** | Colaboradores do escritório | Empresários/Clientes |
| **Escopo** | Todas as empresas clientes | Apenas a própria empresa |
| **Ações** | Gestão, configuração, suporte | Autoatendimento |
| **Usuários visíveis** | Todos de todas as empresas | Apenas da própria empresa |
| **Upload de guias** | Sim (para qualquer cliente) | Não (apenas visualiza) |

### 1.4 Princípios de Design

- 📊 **Visão 360°**: Dashboard com métricas de todos os clientes
- ⚡ **Eficiência**: Ações em lote para operações repetitivas
- 🔍 **Filtros avançados**: Busca e segmentação poderosas
- 🔒 **Controle**: Auditoria completa de todas as ações
- 📱 **Responsivo**: Acesso em qualquer dispositivo

---

## 2. Autenticação e Acesso

### RF-ADM-AUTH-001: Login do Colaborador

**Fluxo:**
1. Colaborador acessa admin.dominio.com.br
2. Informa **email corporativo** e **senha**
3. Validação de 2FA (obrigatório para administradores)
4. Acesso ao dashboard

**Regras:**
- Email deve ser do domínio do escritório
- 2FA obrigatório para perfis Administrador e Contador
- Sessão de 8 horas (maior que cliente)
- IP whitelisting opcional

### RF-ADM-AUTH-002: Gestão de Colaboradores

**Cadastro de Novo Colaborador:**
- Nome completo
- Email corporativo
- CPF
- Perfil de acesso
- Permissões granulares (opcional)

**Ações:**
- Convidar colaborador
- Editar permissões
- Desativar/Reativar
- Resetar senha
- Encerrar sessões

### RF-ADM-AUTH-003: Perfis e Permissões

| Permissão | Admin | Contador | Assistente | Visualizador |
|-----------|-------|----------|------------|--------------|
| Dashboard completo | ✅ | ✅ | ⚠️ Parcial | ✅ |
| Cadastrar clientes | ✅ | ✅ | ❌ | ❌ |
| Editar clientes | ✅ | ✅ | ❌ | ❌ |
| Bloquear clientes | ✅ | ❌ | ❌ | ❌ |
| Upload de guias | ✅ | ✅ | ✅ | ❌ |
| Upload de documentos | ✅ | ✅ | ✅ | ❌ |
| Emitir NF-e (cliente) | ✅ | ✅ | ❌ | ❌ |
| Gestão de usuários | ✅ | ⚠️ Parcial | ❌ | ❌ |
| Comunicação em massa | ✅ | ✅ | ❌ | ❌ |
| Configurações | ✅ | ❌ | ❌ | ❌ |
| Relatórios | ✅ | ✅ | ⚠️ Parcial | ✅ |
| Auditoria | ✅ | ❌ | ❌ | ❌ |

### RF-ADM-AUTH-004: Auditoria de Acesso

- Log de todos os logins (sucesso e falha)
- Registro de IP e dispositivo
- Alerta de login em novo dispositivo
- Relatório de acessos por colaborador
- Detecção de atividade suspeita

---

## 3. Dashboard do Escritório

### RF-ADM-DASH-001: Visão Geral

**Métricas Principais:**

#### 📊 Resumo de Clientes
| Métrica | Descrição |
|---------|-----------|
| Total de clientes | Empresas cadastradas |
| Ativos | Em dia com obrigações |
| Inadimplentes | Com guias vencidas |
| Bloqueados | Acesso suspenso |
| Novos (30 dias) | Cadastros recentes |

#### 💰 Faturamento Consolidado
- Total de NF-e emitidas (mês)
- Valor total faturado (todos os clientes)
- Comparativo mês anterior
- Gráfico de evolução (12 meses)

#### ⚠️ Alertas Críticos
- Guias vencidas (quantidade e valor)
- Certificados vencendo em 30 dias
- Tickets não respondidos > 24h
- Clientes sem atividade > 60 dias

#### 📋 Pendências do Dia
- Guias a vencer hoje
- Obrigações acessórias próximas
- Tickets aguardando resposta
- Documentos pendentes de entrega

### RF-ADM-DASH-002: Widgets Configuráveis

- Reorganização por drag-and-drop
- Mostrar/ocultar widgets
- Filtro por período
- Exportação de dados

### RF-ADM-DASH-003: Atalhos Rápidos

- ➕ Cadastrar novo cliente
- 📤 Upload de guias em lote
- 📧 Enviar comunicado
- 🎫 Ver tickets abertos
- 📊 Gerar relatório

---

## 4. Gestão de Clientes

### RF-ADM-CLI-001: Listagem de Clientes

**Informações na Lista:**
- Razão Social / Nome Fantasia
- CNPJ
- Regime tributário
- Status (Ativo, Inadimplente, Bloqueado)
- Badges de alertas
- Último acesso
- Responsável no escritório

**Filtros:**
- Por status
- Por regime tributário
- Por responsável
- Por data de cadastro
- Por atividade (com/sem notas no mês)
- Por pendências

**Ações em Lote:**
- Enviar comunicado
- Exportar lista
- Atribuir responsável
- Gerar relatório consolidado

### RF-ADM-CLI-002: Cadastro de Cliente

**Dados Obrigatórios:**
- CNPJ (validação Receita Federal)
- Razão Social
- Regime tributário
- Email principal
- Responsável no escritório

**Dados Opcionais:**
- Nome Fantasia
- Inscrições (Municipal/Estadual)
- Endereço completo
- Telefones
- CNAEs
- Plano contratado
- Observações internas

**Fluxo:**
1. Informar CNPJ
2. Importar dados da Receita Federal
3. Complementar informações
4. Definir configurações iniciais
5. Enviar convite ao cliente (opcional)

### RF-ADM-CLI-003: Detalhes do Cliente

**Abas/Seções:**

| Aba | Conteúdo |
|-----|----------|
| 📋 **Resumo** | Dados cadastrais, métricas, alertas |
| 📄 **Notas Fiscais** | Histórico de NF-e do cliente |
| 💳 **Guias** | Guias pendentes e pagas |
| 📁 **Documentos** | Documentos do cliente |
| 👥 **Usuários** | Usuários da empresa |
| 💬 **Comunicação** | Histórico de mensagens/tickets |
| 📊 **Relatórios** | Relatórios do cliente |
| ⚙️ **Configurações** | Configurações específicas |
| 📝 **Auditoria** | Log de ações |

### RF-ADM-CLI-004: Ações no Cliente

**Gestão:**
- ✏️ Editar dados cadastrais
- 🔧 Alterar configurações fiscais
- 📤 Upload de documentos
- 📤 Upload de guias
- 📄 Emitir NF-e em nome do cliente

**Controle:**
- 🔒 Bloquear acesso (com justificativa)
- 🔓 Desbloquear acesso
- ⏸️ Suspender serviços
- 🗑️ Inativar cliente (soft delete)

**Comunicação:**
- 💬 Enviar mensagem
- 📧 Enviar email
- 📞 Registrar contato telefônico

### RF-ADM-CLI-005: Indicadores por Cliente

**Métricas Individuais:**
- Total de NF-e emitidas (mês/ano)
- Faturamento total
- Guias em atraso
- Tickets abertos
- Último acesso do cliente
- Score de engajamento

**Gráficos:**
- Evolução de faturamento
- Comparativo com período anterior
- Distribuição por tipo de serviço

---

## 5. Gestão de Usuários Global

### RF-ADM-USR-001: Visão Consolidada

> ⚠️ **Diferença para o Portal Cliente:** Aqui são exibidos **todos os usuários de todas as empresas clientes**, não apenas de uma empresa.

**Informações na Lista:**
- Nome e email
- CPF
- Empresa(s) vinculada(s)
- Perfil em cada empresa
- Status (Ativo, Inativo, Bloqueado)
- Último acesso
- Data de cadastro

### RF-ADM-USR-002: Filtros Avançados

| Filtro | Opções |
|--------|--------|
| Por empresa | Seleção múltipla |
| Por perfil | Admin, Operador, Visualizador |
| Por status | Ativo, Inativo, Bloqueado, Convite Pendente |
| Por acesso | Com/sem acesso recente (30 dias) |
| Por multi-empresa | Usuários com acesso a múltiplas empresas |

### RF-ADM-USR-003: Detalhes do Usuário

**Informações:**
- Dados pessoais (nome, email, CPF)
- Empresas vinculadas com respectivos perfis
- Histórico de acessos
- Ações realizadas (auditoria)
- Dispositivos utilizados

### RF-ADM-USR-004: Ações Administrativas

| Ação | Descrição |
|------|-----------|
| 🔓 Desbloquear | Liberar acesso após bloqueio |
| 🔑 Resetar senha | Enviar email de reset |
| 🚪 Revogar sessões | Encerrar todas as sessões ativas |
| 🔄 Transferir | Mover para outra empresa |
| ➕ Vincular | Adicionar acesso a outra empresa |
| ➖ Desvincular | Remover de uma empresa |
| 🔒 Bloquear | Suspender acesso (todas as empresas) |

### RF-ADM-USR-005: Relatórios de Usuários

- Total de usuários por empresa
- Usuários ativos vs inativos
- Usuários com múltiplas empresas
- Últimos cadastros
- Usuários nunca acessaram
- Exportação para Excel

---

## 6. Monitoramento e Alertas

### RF-ADM-MON-001: Central de Alertas

**Níveis de Criticidade:**

| Nível | Cor | Exemplos |
|-------|-----|----------|
| 🔴 Crítico | Vermelho | Certificado vencido, Bloqueio de emissão |
| 🟠 Alto | Laranja | Guia vencida, Ticket não respondido > 48h |
| 🟡 Médio | Amarelo | Guia vencendo 3 dias, Certificado vencendo 30 dias |
| 🔵 Baixo | Azul | Cliente inativo, Documento pendente |

### RF-ADM-MON-002: Tipos de Alertas

**Fiscais:**
- Certificado digital vencendo/vencido
- Falha na emissão de NF-e
- Bloqueio municipal/federal
- Pendência cadastral

**Financeiros:**
- Guias vencidas
- Guias vencendo (7, 3, 1 dia)
- Acúmulo de débitos

**Operacionais:**
- Tickets não respondidos
- Clientes sem atividade
- Documentos pendentes de entrega
- Erros de integração

### RF-ADM-MON-003: Painel de Alertas

- Lista consolidada por criticidade
- Filtro por tipo e cliente
- Atribuição para colaborador
- Marcar como resolvido
- Histórico de alertas

### RF-ADM-MON-004: Log de Atividades

**Registros:**
- Todas as ações no sistema
- Quem fez, quando, o quê
- Detalhes da ação
- IP e dispositivo

**Filtros:**
- Por colaborador
- Por cliente
- Por tipo de ação
- Por período

**Exportação:**
- CSV para auditoria externa
- Relatório PDF

---

## 7. Documentos e Guias

### RF-ADM-DOC-001: Upload em Nome do Cliente

**Fluxo:**
1. Selecionar cliente (ou múltiplos)
2. Selecionar categoria
3. Upload do(s) arquivo(s)
4. Definir visibilidade (público/privado)
5. Notificar cliente (opcional)

**Regras:**
- Mesmo limite de tamanho do portal cliente
- Categorização obrigatória
- Log de quem fez upload

### RF-ADM-DOC-002: Upload de Guias em Lote

**Fluxo:**
1. Selecionar período (competência)
2. Upload de múltiplos PDFs
3. Sistema identifica cliente pelo CNPJ no PDF (OCR)
4. Ou associação manual
5. Definir data de vencimento
6. Notificar clientes automaticamente

**Funcionalidades:**
- Identificação automática por CNPJ
- Extração de código de barras
- Validação de duplicidade
- Relatório de processamento

### RF-ADM-DOC-003: Gestão de Documentos Modelo

- Criar/editar documentos modelo
- Disponibilizar para clientes
- Controle de versão
- Categorização

### RF-ADM-DOC-004: Relatório de Documentos

- Documentos por cliente
- Documentos por categoria
- Documentos pendentes de entrega
- Documentos mais acessados

---

## 8. Comunicação

### RF-ADM-COM-001: Mensagens Individuais

**Chat com Cliente:**
- Histórico completo de conversas
- Anexo de arquivos
- Status de leitura
- Templates de resposta
- Atribuição para colaborador

### RF-ADM-COM-002: Comunicados em Massa

**Criar Comunicado:**
- Título
- Corpo (editor rich-text)
- Anexos (opcional)
- Segmentação de destinatários

**Segmentação:**
| Critério | Opções |
|----------|--------|
| Todos os clientes | Enviar para todos |
| Por regime | Simples, Presumido, Real |
| Por status | Ativos, Inadimplentes |
| Por tag | Tags personalizadas |
| Por responsável | Clientes de um contador |
| Seleção manual | Escolher empresas |

**Agendamento:**
- Envio imediato
- Agendar data/hora
- Repetição (mensal, trimestral)

### RF-ADM-COM-003: Sistema de Tickets

**Painel de Tickets:**
- Lista de todos os tickets
- Filtros: status, prioridade, cliente, responsável
- Atribuição para colaborador
- SLA por tipo

**Fluxo:**
1. Cliente abre ticket
2. Notificação para escritório
3. Atribuição automática ou manual
4. Resposta do colaborador
5. Cliente avalia ou reabre
6. Fechamento automático após 7 dias sem interação

**Métricas:**
- Tempo médio de resposta
- Tempo médio de resolução
- Tickets por categoria
- Avaliação média
- SLA cumprido/violado

### RF-ADM-COM-004: Base de Conhecimento

**Gestão de Conteúdo:**
- Criar/editar artigos
- Categorização
- Tags
- Ordem de exibição
- Ativar/desativar

**Tipos de Conteúdo:**
- FAQs
- Tutoriais (texto + vídeo)
- Comunicados permanentes
- Documentos modelo

---

## 9. Relatórios Gerenciais

### RF-ADM-REL-001: Relatórios do Escritório

**Faturamento Consolidado:**
- Total faturado por todos os clientes
- Faturamento por cliente
- Evolução mensal/anual
- Top 10 clientes por faturamento

**Tributos:**
- ISS total recolhido
- Tributos federais
- Por cliente e consolidado

**Operacional:**
- Notas emitidas por período
- Guias enviadas vs pagas
- Tickets abertos/fechados
- Tempo médio de atendimento

### RF-ADM-REL-002: Relatórios por Cliente

- Geração de qualquer relatório do cliente
- Exportação em lote
- Agendamento de geração

### RF-ADM-REL-003: Dashboards Analíticos

**Gráficos Disponíveis:**
- Evolução de clientes
- Faturamento por regime
- Distribuição de tributos
- Performance de atendimento
- Engajamento de clientes

**Funcionalidades:**
- Filtros dinâmicos
- Drill-down
- Exportação PNG/PDF
- Compartilhamento

### RF-ADM-REL-004: Relatório de Auditoria

- Ações por colaborador
- Ações por cliente
- Alterações críticas
- Exportação para compliance

---

## 10. Configurações do Escritório

### RF-ADM-CONF-001: Dados do Escritório

- Razão Social
- CNPJ
- CRC (Conselho Regional de Contabilidade)
- Endereço
- Contato
- Logo

### RF-ADM-CONF-002: Colaboradores

- Gestão de usuários internos
- Perfis e permissões
- Convites e desativações
- Auditoria de acessos

### RF-ADM-CONF-003: Planos e Limites

**Configuração por Plano:**
| Recurso | Básico | Profissional | Enterprise |
|---------|--------|--------------|------------|
| Usuários por empresa | 3 | 10 | Ilimitado |
| Storage | 1 GB | 5 GB | 50 GB |
| Notas/mês | 50 | 200 | Ilimitado |
| Relatórios avançados | ❌ | ✅ | ✅ |
| API | ❌ | ❌ | ✅ |

### RF-ADM-CONF-004: Templates

**Gerenciar Templates:**
- Email de boas-vindas
- Email de guia disponível
- Email de NF-e emitida
- Comunicados padrão
- Respostas de ticket

### RF-ADM-CONF-005: White-label

- Logo personalizado
- Cores do tema
- Domínio personalizado
- Email de saída (from)

---

## 11. Integrações

### RF-ADM-INT-001: API para Terceiros

**Endpoints Disponíveis:**
- Cadastro de clientes
- Upload de guias
- Consulta de notas fiscais
- Envio de comunicados

**Autenticação:**
- API Key por integração
- Rate limiting
- Logs de uso

### RF-ADM-INT-002: Webhooks

**Eventos Disponíveis:**
- Novo cliente cadastrado
- NF-e emitida
- Guia vencida
- Ticket aberto

**Configuração:**
- URL de destino
- Eventos a escutar
- Retry automático
- Log de envios

### RF-ADM-INT-003: Importação em Lote

**Formatos Suportados:**
- CSV
- Excel (XLSX)
- JSON

**Importações:**
- Clientes
- Tomadores
- Guias

### RF-ADM-INT-004: Exportação

**Formatos:**
- CSV
- Excel
- PDF
- JSON

**Dados Exportáveis:**
- Lista de clientes
- Relatórios
- Logs de auditoria
- Backup completo

---

## 📊 Resumo de Funcionalidades

### Telas do Portal Administrativo

| Módulo | Telas |
|--------|-------|
| **Auth** | Login, Gestão de Colaboradores |
| **Dashboard** | Painel Principal, Alertas |
| **Clientes** | Lista, Cadastro, Detalhes, Configurações |
| **Usuários** | Lista Global, Detalhes, Ações |
| **Monitoramento** | Alertas, Logs, Auditoria |
| **Documentos** | Upload, Guias em Lote, Modelos |
| **Comunicação** | Mensagens, Comunicados, Tickets, FAQ |
| **Relatórios** | Consolidados, Por Cliente, Analytics |
| **Configurações** | Escritório, Colaboradores, Planos, Templates |
| **Integrações** | API, Webhooks, Import/Export |

### Contagem de Requisitos

| Categoria | Quantidade |
|-----------|------------|
| Autenticação | 4 |
| Dashboard | 3 |
| Clientes | 5 |
| Usuários | 5 |
| Monitoramento | 4 |
| Documentos | 4 |
| Comunicação | 4 |
| Relatórios | 4 |
| Configurações | 5 |
| Integrações | 4 |
| **TOTAL** | **42** |

---

## 🔄 Fluxos Principais

### Fluxo: Onboarding de Novo Cliente

```
1. Contador acessa "Cadastrar Cliente"
2. Informa CNPJ → Importa dados da Receita
3. Complementa informações (email, responsável)
4. Define plano e configurações
5. Sistema cria empresa no banco
6. Envia email de boas-vindas com link de acesso
7. Cliente define senha e acessa o portal
```

### Fluxo: Upload de Guias em Lote

```
1. Contador acessa "Guias > Upload em Lote"
2. Seleciona competência (ex: 12/2024)
3. Faz upload de múltiplos PDFs
4. Sistema processa (OCR, extração de dados)
5. Associa automaticamente ao cliente (por CNPJ)
6. Contador revisa e confirma
7. Sistema notifica clientes por email
```

### Fluxo: Atendimento de Ticket

```
1. Cliente abre ticket no portal
2. Sistema notifica escritório
3. Atribui automaticamente ao responsável
4. Contador responde
5. Cliente recebe notificação
6. Se resolvido, cliente avalia
7. Ticket fechado automaticamente após 7 dias
```

---

*Documento gerado em Dezembro/2024 - v1.0*
