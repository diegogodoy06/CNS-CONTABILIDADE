# Plataforma de Gestão Contábil Digital

## Documento de Requisitos - Visão Geral

### Versão 2.0 | Dezembro 2024

---

## 📋 Sumário

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Estrutura de Portais](#3-estrutura-de-portais)
4. [Requisitos Não Funcionais](#4-requisitos-não-funcionais)
5. [Documentos Relacionados](#5-documentos-relacionados)

---

## 1. Visão Geral do Produto

### 1.1 Propósito

A **Plataforma de Gestão Contábil Digital** é uma solução SaaS completa para escritórios de contabilidade e seus clientes, composta por dois portais distintos:

| Portal | Descrição | Público |
|--------|-----------|---------|
| **Portal do Cliente** | Autoatendimento para empresas | Empresários, sócios, funcionários |
| **Portal Administrativo** | Gestão do escritório | Contadores, assistentes |

### 1.2 Modelo de Negócio

- **Público-alvo**: Escritórios de contabilidade com foco em pequenas empresas
- **Modelo**: Plataforma white-label (cada escritório com sua marca)
- **Monetização**: Assinatura mensal por empresa cliente
- **Diferencial**: Simplificação radical + autonomia do cliente

### 1.3 Princípios do Design

| Princípio | Descrição |
|-----------|-----------|
| 🎯 **Simplicidade** | Máximo 3 cliques para ações principais |
| 🤖 **Autonomia** | Cliente realiza 80% das operações sozinho |
| 📊 **Transparência** | Informações fiscais sempre claras |
| ⏱️ **Disponibilidade** | 99.5% de uptime garantido |
| 🔒 **Segurança** | Conformidade LGPD e CFC |

---

## 2. Arquitetura do Sistema

### 2.1 Stack Tecnológica

#### Frontend (Ambos os Portais)
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 18+ | Framework UI |
| TypeScript | 5+ | Tipagem |
| Material-UI | 6+ | Componentes |
| Redux Toolkit | - | Estado global |
| React Router | 6+ | Rotas |
| React Hook Form | - | Formulários |
| Recharts | - | Gráficos |
| Axios | - | HTTP Client |
| Vite | 6+ | Build tool |

#### Backend
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| Node.js | 20+ | Runtime |
| Express.js | - | Framework API |
| Prisma | - | ORM |
| JWT | - | Autenticação |
| Bull | - | Filas (Redis) |
| AWS S3 / MinIO | - | Storage |
| SendGrid / SES | - | Email |

#### Banco de Dados
| Tecnologia | Propósito |
|------------|-----------|
| PostgreSQL 14+ | BD principal |
| Redis 7+ | Cache e filas |

#### Infraestrutura
| Tecnologia | Propósito |
|------------|-----------|
| Docker | Containerização |
| GitHub Actions | CI/CD |
| CloudFlare | CDN |

### 2.2 Padrões de Arquitetura

- **Backend**: Clean Architecture + Repository Pattern
- **Frontend**: Feature-based folder structure
- **API**: RESTful com versionamento (/api/v1/)
- **Comunicação**: Event-driven para processos assíncronos

### 2.3 Estrutura de Pastas (Frontend)

```
src/
├── features/           # Funcionalidades por domínio
│   ├── auth/          # Autenticação
│   ├── dashboard/     # Dashboard
│   ├── documents/     # Documentos
│   ├── notas/         # Notas Fiscais
│   ├── tomadores/     # Tomadores
│   ├── guias/         # Guias
│   ├── usuarios/      # Usuários
│   └── ...
├── components/        # Componentes compartilhados
│   ├── layout/        # Header, Sidebar, MainLayout
│   └── shared/        # Componentes reutilizáveis
├── services/          # APIs e serviços
├── store/             # Redux (slices, hooks)
├── theme/             # Tema MUI
└── types/             # TypeScript types
```

---

## 3. Estrutura de Portais

### 3.1 Comparativo de Portais

| Aspecto | Portal Cliente | Portal Administrativo |
|---------|----------------|----------------------|
| **URL** | app.dominio.com.br | admin.dominio.com.br |
| **Público** | Empresas clientes | Escritório contábil |
| **Escopo de dados** | Apenas própria empresa | Todas as empresas |
| **Login** | Email + Senha | Email corporativo + Senha |
| **2FA** | Opcional | Obrigatório (admin/contador) |
| **Sessão** | 4 horas | 8 horas |

### 3.2 Portal do Cliente - Resumo

**Módulos Principais:**

| Módulo | Funcionalidades |
|--------|-----------------|
| 🔐 **Autenticação** | Login, 2FA, Recuperar senha, Seleção de empresa |
| 📊 **Dashboard** | Widgets, Métricas, Atalhos rápidos |
| 📁 **Documentos** | Upload, Categorias, Busca, Visualização |
| 📄 **Notas Fiscais** | Emissão, Simulação, Rascunhos, Histórico |
| 👥 **Tomadores** | Cadastro, Importação, Histórico |
| 💳 **Guias** | Visualização, Calendário, Pagamento |
| 🔔 **Notificações** | Alertas, Configurações |
| 📈 **Relatórios** | Fiscais, Gerenciais, Analytics |
| ⚙️ **Configurações** | Empresa, Fiscal, Certificado |
| 💬 **Comunicação** | Mensagens, Tickets, FAQ |
| 👤 **Usuários** | Gestão de usuários da empresa |

**Total de Requisitos:** 47

📄 **Documento completo:** [Documento_requisitos_CLIENTE.MD](./Documento_requisitos_CLIENTE.MD)

### 3.3 Portal Administrativo - Resumo

**Módulos Principais:**

| Módulo | Funcionalidades |
|--------|-----------------|
| 🔐 **Autenticação** | Login, 2FA obrigatório, Gestão de colaboradores |
| 📊 **Dashboard** | Visão consolidada, Alertas, KPIs |
| 🏢 **Clientes** | Cadastro, Gestão, Detalhes, Ações |
| 👥 **Usuários Global** | Todos os usuários de todas as empresas |
| ⚠️ **Monitoramento** | Alertas, Logs, Auditoria |
| 📁 **Documentos** | Upload em nome do cliente, Guias em lote |
| 💬 **Comunicação** | Mensagens, Comunicados em massa, Tickets |
| 📈 **Relatórios** | Consolidados, Por cliente, Analytics |
| ⚙️ **Configurações** | Escritório, Colaboradores, Planos, Templates |
| 🔌 **Integrações** | API, Webhooks, Import/Export |

**Total de Requisitos:** 42

📄 **Documento completo:** [Documento_requisitos_ADMIN.MD](./Documento_requisitos_ADMIN.MD)

### 3.4 Diferenças Chave

#### Gestão de Usuários

| Portal | Escopo | Quem gerencia |
|--------|--------|---------------|
| Cliente | Apenas usuários da própria empresa | Administrador da empresa |
| Admin | Todos os usuários de todas as empresas | Colaboradores do escritório |

#### Documentos e Guias

| Portal | Ação | Quem faz |
|--------|------|----------|
| Cliente | Upload de documentos próprios | Usuários da empresa |
| Cliente | Visualização de guias | Todos os perfis |
| Admin | Upload de guias para qualquer cliente | Colaboradores |
| Admin | Upload em lote (múltiplos clientes) | Colaboradores |

#### Comunicação

| Portal | Tipo | Direção |
|--------|------|---------|
| Cliente | Mensagens/Tickets | Cliente → Escritório |
| Admin | Resposta a tickets | Escritório → Cliente |
| Admin | Comunicados em massa | Escritório → Múltiplos clientes |

---

## 4. Requisitos Não Funcionais

### 4.1 Segurança

#### RNF-SEC-001: Autenticação e Autorização
- JWT com RS256 (chaves assimétricas)
- Refresh token com rotação
- Rate limiting:
  - Login: 5 tentativas / 15 min
  - API geral: 100 req/min por usuário
  - Emissão NF-e: 20 req/hora por empresa
- CORS restrito
- CSRF protection

#### RNF-SEC-002: Criptografia
- Senhas: bcrypt (cost factor 12)
- Dados sensíveis: AES-256-GCM
- Comunicação: TLS 1.3
- Backup: S3 SSE-KMS

#### RNF-SEC-003: LGPD Compliance
- Consentimento explícito
- Direito ao esquecimento (anonimização 5 anos)
- Portabilidade de dados
- DPO designado
- Termos de uso e privacidade

#### RNF-SEC-004: Auditoria
- Log de todas as ações críticas
- Retenção: 5 anos
- Logs imutáveis
- SIEM para anomalias

#### RNF-SEC-005: Backup
- Backup incremental diário
- Backup completo semanal
- RPO: 24h / RTO: 4h
- Testes trimestrais

### 4.2 Performance

#### RNF-PERF-001: Tempo de Resposta
| Operação | Meta |
|----------|------|
| Páginas estáticas | < 1s (LCP) |
| Listagens | < 2s |
| Emissão NF-e | < 5s |
| Busca | < 1.5s |

#### RNF-PERF-002: Escalabilidade
- Horizontal scaling (stateless)
- Load balancing
- Cache multicamadas (Browser, CDN, Redis, PostgreSQL)
- Connection pooling (pgBouncer)

#### RNF-PERF-003: Otimizações
- Lazy loading de componentes
- Code splitting por rota
- Image optimization (WebP)
- Paginação (20-50 itens)
- Compression (gzip/brotli)

#### RNF-PERF-004: Processamento Assíncrono
- Queue para emails, relatórios, OCR, NF-e
- Workers escaláveis
- Dead letter queue

### 4.3 Disponibilidade

#### RNF-DISP-001: Uptime
- SLA: 99.5% (~3.6h/mês de inatividade)
- Manutenções programadas: janelas de 2h, horário não comercial
- Notificação prévia: 48h

#### RNF-DISP-002: Monitoramento
- Health check: /api/health
- Prometheus metrics
- Alertas PagerDuty/Opsgenie
- Status page público

#### RNF-DISP-003: Disaster Recovery
- Multi-region (primary + failover)
- Failover automático < 5 min
- Database replication
- Testes semestrais

### 4.4 Usabilidade

#### RNF-USA-001: Interface
- Design responsivo (mobile-first)
- Breakpoints: 320px, 768px, 1024px, 1440px
- Material Design 3
- Acessibilidade WCAG 2.1 AA

---

## 5. Documentos Relacionados

### Documentos de Requisitos

| Documento | Descrição |
|-----------|-----------|
| [Documento_requisitos_CLIENTE.MD](./Documento_requisitos_CLIENTE.MD) | Requisitos detalhados do Portal do Cliente |
| [Documento_requisitos_ADMIN.MD](./Documento_requisitos_ADMIN.MD) | Requisitos detalhados do Portal Administrativo |
| [Roadmap_Implementacao.md](./Roadmap_Implementacao.md) | Roadmap de desenvolvimento |

### Resumo de Requisitos

| Categoria | Cliente | Admin | Total |
|-----------|---------|-------|-------|
| Funcionais | 47 | 42 | **89** |
| Não Funcionais | - | - | **~20** |
| **TOTAL** | - | - | **~109** |

---

## 📊 Matriz de Funcionalidades vs Portal

| Funcionalidade | Cliente | Admin |
|----------------|:-------:|:-----:|
| Login email + senha | ✅ | ✅ |
| Seleção de múltiplas empresas | ✅ | ❌ |
| 2FA obrigatório | ❌ | ✅ (admin) |
| Dashboard próprio | ✅ | ❌ |
| Dashboard consolidado | ❌ | ✅ |
| Emitir NF-e | ✅ | ✅ |
| Simular NF-e | ✅ | ✅ |
| Upload documentos | ✅ | ✅ |
| Upload guias | ❌ | ✅ |
| Ver guias | ✅ | ✅ |
| Cadastrar tomadores | ✅ | ✅ |
| Ver usuários da empresa | ✅ | ✅ |
| Ver usuários de todas empresas | ❌ | ✅ |
| Convidar usuários | ✅ | ✅ |
| Bloquear usuários | ❌ | ✅ |
| Transferir usuários | ❌ | ✅ |
| Comunicados em massa | ❌ | ✅ |
| Abrir tickets | ✅ | ❌ |
| Responder tickets | ❌ | ✅ |
| Cadastrar clientes | ❌ | ✅ |
| Bloquear clientes | ❌ | ✅ |
| Configurações do escritório | ❌ | ✅ |
| API/Integrações | ❌ | ✅ |
| Auditoria global | ❌ | ✅ |

---

*Documento atualizado em Dezembro/2024 - v2.0*
