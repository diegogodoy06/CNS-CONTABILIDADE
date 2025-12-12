# Plataforma de Gestão Contábil Digital

## Documento de Requisitos v2.0

---

## 1. Visão Geral do Produto

### 1.1 Propósito
A Plataforma de Gestão Contábil Digital é uma solução SaaS voltada para pequenas empresas que necessitam de serviços contábeis simplificados, oferecendo autoatendimento para tarefas rotineiras e acesso facilitado a documentos fiscais, emissão de notas fiscais e gestão tributária.

### 1.2 Modelo de Negócio
- **Público-alvo**: Empresas de pequeno porte (MEI, ME, EPP)
- **Modelo**: Plataforma white-label para escritórios de contabilidade
- **Monetização**: Assinatura mensal por empresa cliente
- **Diferencial**: Simplificação radical (2-3 cliques para ações principais)

### 1.3 Princípios do Design
- **Simplicidade**: Máximo 3 cliques para qualquer ação
- **Autonomia**: Cliente realiza 80% das operações sem intermediação
- **Transparência**: Informações fiscais e tributárias claras
- **Disponibilidade**: 99.5% de uptime garantido
- **Segurança**: Conformidade com LGPD e normas do CFC

---

## 2. Arquitetura do Sistema

### 2.1 Stack Tecnológica

#### Frontend
- **Framework**: React 18+ com TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Yup
- **Charts**: Recharts ou Chart.js
- **HTTP Client**: Axios com interceptors

#### Backend
- **API REST**: Node.js + Express.js
- **ORM**: Prisma ou Sequelize
- **Autenticação**: JWT + Refresh Tokens
- **Validação**: Joi ou Zod
- **Queue**: Bull (Redis)
- **Storage**: AWS S3 ou MinIO
- **Email**: SendGrid ou AWS SES

#### Banco de Dados
- **Principal**: PostgreSQL 14+
- **Cache**: Redis 7+
- **Full-text Search**: PostgreSQL + pg_trgm (ou ElasticSearch para escala)

#### Infraestrutura
- **Containerização**: Docker + Docker Compose
- **Orquestração**: Kubernetes (produção) ou Docker Swarm
- **CI/CD**: GitHub Actions ou GitLab CI
- **Monitoramento**: Prometheus + Grafana
- **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **CDN**: CloudFlare

### 2.2 Padrões de Arquitetura
- **Backend**: Clean Architecture + Repository Pattern
- **Frontend**: Feature-based folder structure
- **API**: RESTful com versionamento (/api/v1/)
- **Comunicação**: Event-driven para processos assíncronos

---

## 3. Módulos do Sistema

### 3.1 Autenticação e Gestão de Acesso

#### RF-AUTH-001: Login Multi-fator
- Login com CNPJ + senha
- 2FA opcional via SMS/Email/App (Google Authenticator)
- Captcha após 3 tentativas falhas
- Bloqueio temporário após 5 tentativas (15 minutos)
- IP whitelisting opcional para contas corporativas

#### RF-AUTH-002: Gestão de Sessões
- Sessão com duração configurável (padrão: 4 horas)
- Refresh token com validade de 30 dias
- Logout automático por inatividade (30 minutos)
- Device fingerprinting para detecção de acessos suspeitos
- Notificação de login em novo dispositivo

#### RF-AUTH-003: Recuperação de Senha
- Reset via email com token expirável (1 hora)
- Validação de CPF do responsável legal
- Histórico de senhas (não permitir últimas 5)
- Força de senha: mínimo 8 caracteres, maiúsculas, minúsculas, números e símbolos

#### RF-AUTH-004: Gestão de Usuários por Empresa
- Múltiplos usuários por empresa (limite por plano)
- Perfis: Administrador, Operador, Visualizador
- Convite via email com aceite obrigatório
- Auditoria de ações por usuário
- Desativação de usuário (não exclusão física)

#### Matriz de Permissões

| Funcionalidade | Administrador | Operador | Visualizador |
|----------------|---------------|----------|--------------|
| Emitir NF-e | ✅ | ✅ | ❌ |
| Simular NF-e | ✅ | ✅ | ✅ |
| Upload documentos | ✅ | ✅ | ❌ |
| Download documentos | ✅ | ✅ | ✅ |
| Gerenciar tomadores | ✅ | ✅ | ❌ |
| Visualizar guias | ✅ | ✅ | ✅ |
| Baixar guias | ✅ | ✅ | ✅ |
| Gerenciar usuários | ✅ | ❌ | ❌ |
| Configurações empresa | ✅ | ❌ | ❌ |

---

### 3.2 Dashboard

#### RF-DASH-001: Painel Principal
**Widgets Obrigatórios:**
- 📊 **Resumo Financeiro do Mês**
  - Faturamento total
  - Impostos a recolher
  - Margem líquida estimada
  - Comparativo com mês anterior

- 📄 **Notas Fiscais**
  - Total emitidas no mês
  - Aguardando emissão (rascunhos)
  - Canceladas
  - Gráfico de evolução (últimos 6 meses)

- 💳 **Guias e Obrigações**
  - Vencendo em 7 dias (destaque vermelho)
  - Vencidas (alerta crítico)
  - Pagas no mês
  - Próximas obrigações acessórias

- 📁 **Documentos Recentes**
  - Últimos 5 documentos adicionados
  - Badge "Novo" para não visualizados
  - Acesso rápido por categoria

- 🔔 **Central de Notificações**
  - Alertas pendentes
  - Comunicados do escritório
  - Avisos de atualizações regulatórias

#### RF-DASH-002: Widgets Personalizáveis
- Drag-and-drop para reorganizar
- Ocultar/exibir widgets
- Configurações salvas por usuário

#### RF-DASH-003: Atalhos Rápidos
- Botões flutuantes (FAB) para:
  - Emitir NF-e
  - Upload de documento
  - Consultar tributos
  - Falar com contador (chat/ticket)

---

### 3.3 Gestão Documental

#### RF-DOC-001: Upload de Documentos
**Formatos aceitos:**
- PDF (até 25MB)
- Imagens: JPG, PNG, WEBP (até 10MB)
- Office: DOC, DOCX, XLS, XLSX (até 15MB)
- Compactados: ZIP, RAR (até 50MB)

**Regras:**
- Scan de vírus obrigatório (ClamAV)
- OCR automático para PDFs (opcional)
- Extração de metadados (data, tipo, emissor)
- Compressão automática de imagens (WebP)
- Versionamento de documentos

#### RF-DOC-002: Organização por Categorias

**Categorias Padrão:**
1. **Fiscal**
   - Notas Fiscais de Entrada
   - Notas Fiscais de Saída
   - Livros Fiscais
   - Guias de Impostos

2. **Contábil**
   - Balancetes
   - DRE (Demonstração do Resultado)
   - Balanços Patrimoniais
   - Extratos Bancários

3. **Trabalhista**
   - Folhas de Pagamento
   - Rescisões
   - FGTS
   - E-Social

4. **Jurídico**
   - Contratos Sociais
   - Alterações Contratuais
   - Atas de Reunião
   - Procurações

5. **Operacional**
   - Contratos com Fornecedores
   - Contratos com Clientes
   - Apólices de Seguro
   - Certidões Negativas

6. **Certificados Digitais**
   - e-CNPJ
   - e-CPF
   - Certificados de Sócios

7. **Documentos Modelo** (Read-only)
   - Contratos modelo
   - Procurações padrão
   - Checklists mensais
   - Guias e tutoriais

#### RF-DOC-003: Busca e Filtros
- Busca full-text por conteúdo (OCR)
- Filtros: categoria, data, tipo, tags
- Ordenação: mais recente, alfabética, tamanho
- Busca por período (competência)

#### RF-DOC-004: Visualização e Download
- Visualizador inline para PDF e imagens
- Conversão de Office para PDF (visualização)
- Download individual ou em lote (ZIP)
- Compartilhamento temporário via link (24h)
- Marca d'água em PDFs baixados (opcional)

#### RF-DOC-005: Controle de Acesso
- Documentos públicos (visíveis para todos os usuários)
- Documentos privados (apenas administrador)
- Documentos compartilhados com contador
- Log de acesso (quem visualizou/baixou e quando)

#### RF-DOC-006: Retenção e Arquivamento
- Política de retenção configurável (padrão: 5 anos)
- Arquivamento automático de documentos antigos
- Exclusão lógica (soft delete) com recuperação em 30 dias
- Backup automático diário (S3 Glacier)

---

### 3.4 Emissão de Notas Fiscais

#### RF-NF-001: Fluxo de Emissão Simplificado

**Etapa 1: Seleção de Tomador**
- Busca rápida por CNPJ/CPF ou nome
- Criação rápida inline (modal)
- Importação de dados da Receita Federal
- Últimos tomadores utilizados (quick access)

**Etapa 2: Dados do Serviço**
- Descrição do serviço (com autocomplete de histórico)
- Valor total
- CNAE (busca inteligente com descrição)
- Código de Tributação Municipal (CTM)
- Local da prestação (município)
- Retenções na fonte (IR, PIS, COFINS, CSLL, INSS)

**Etapa 3: Revisão e Confirmação**
- Preview da NF-e formatada
- Resumo de tributos calculados
- Validação de campos obrigatórios
- Salvar como rascunho ou emitir

**Etapa 4: Transmissão**
- Envio para prefeitura (síncrono ou assíncrono)
- Retry automático em caso de erro (3 tentativas)
- Notificação de sucesso/erro
- Download automático de XML e PDF

#### RF-NF-002: Simulação de Nota Fiscal
- Mesmo fluxo da emissão, mas sem transmissão
- Geração de PDF "simulado" (marca d'água)
- Cálculo de tributos em tempo real
- Converter simulação em emissão real (1 clique)
- Histórico de simulações (7 dias)

#### RF-NF-003: Gestão de Rascunhos
- Salvar emissão incompleta
- Listagem de rascunhos pendentes
- Editar, duplicar ou excluir rascunho
- Alerta de rascunhos com mais de 15 dias

#### RF-NF-004: Integração com Prefeituras

**Padrão Nacional NFS-e**
- Layout ABRASF 2.04
- Layout Nacional RFB (Decreto 10.854/2021)
- Suporte a municípios integrados (80%+ das cidades)

**Fallback para Municípios Não Integrados**
- Exportação de XML conforme layout da prefeitura
- PDF com dados preenchidos para digitação manual
- Instruções específicas por município

**Processamento Assíncrono**
- Queue de transmissão (Redis + Bull)
- Webhook de retorno da prefeitura
- Notificação em tempo real via WebSocket

#### RF-NF-005: Validações Pré-emissão
- Certificado digital válido (e-CNPJ)
- Dados cadastrais atualizados
- Situação ativa na Receita Federal
- Inscrição municipal ativa
- Regime tributário compatível
- Alíquota de ISS configurada

#### RF-NF-006: Cálculo de Tributos

**ISS (Imposto Sobre Serviços)**
- Alíquota por município e CNAE
- Base de cálculo com deduções (quando aplicável)
- Retenção ou não retenção
- Exigibilidade (Normal, Suspensa, Isenta)

**Impostos Federais**
- IR (1,5% a 4,8% conforme faixa)
- PIS (0,65%)
- COFINS (3%)
- CSLL (1% a 2,88%)
- Cálculo bruto ou com compensações

**Simples Nacional**
- Anexos III, IV e V
- Cálculo pela tabela do Simples
- Fator "r" para anexo V
- Segregação de receitas

#### RF-NF-007: Histórico e Relatórios

**Listagem de Notas**
- Filtros: período, tomador, status, município
- Ordenação personalizável
- Exportação para Excel/CSV
- Busca por número da nota ou protocolo

**Estatísticas**
- Total faturado por período
- ISS recolhido
- Tributos retidos
- Top 10 tomadores
- Serviços mais prestados

**Ações em Lote**
- Download de XMLs/PDFs (ZIP)
- Envio por email para tomador
- Cancelamento múltiplo (quando permitido)

#### RF-NF-008: Cancelamento e Substituição
- Cancelamento dentro do prazo legal (configurable)
- Justificativa obrigatória
- Nota de substituição (quando aplicável)
- Histórico de cancelamentos
- Restrição por perfil de usuário

#### RF-NF-009: Envio Automático ao Tomador
- Email automático com XML e PDF anexos
- Template personalizável
- Agendamento de envio
- Log de envios

---

### 3.5 Cadastro de Tomadores

#### RF-TOM-001: Cadastro Completo

**Pessoa Jurídica**
- CNPJ (validação com Receita Federal)
- Razão Social (importação automática)
- Nome Fantasia
- Inscrição Municipal
- Inscrição Estadual
- Endereço completo com CEP (autocomplete)
- Email (múltiplos)
- Telefone
- CNAE principal
- Regime tributário (Simples, Presumido, Real)

**Pessoa Física**
- CPF (validação)
- Nome completo
- RG
- Data de nascimento
- Endereço completo
- Email
- Telefone

#### RF-TOM-002: Importação de Dados
- Consulta à Receita Federal (CNPJ)
- Consulta ao SINTEGRA (Inscrição Estadual)
- Consulta CEP (endereço)
- Validação de email (syntax check)

#### RF-TOM-003: Gestão de Tomadores
- Listagem com busca e filtros
- Edição inline
- Desativação (soft delete)
- Restrição de exclusão se houver notas emitidas
- Agrupamento por tag (ex: "Recorrentes", "Inativos")

#### RF-TOM-004: Histórico de Relacionamento
- Total de notas emitidas
- Faturamento total
- Última nota emitida
- Média de valor por nota
- Serviços mais contratados

---

### 3.6 Guias e Obrigações

#### RF-GUIA-001: Cadastro de Guias

**Tipos de Guias**
- DAS (Simples Nacional)
- ISS (Imposto Sobre Serviços)
- INSS (Previdência Social)
- FGTS
- IR (Imposto de Renda)
- CSLL
- PIS/COFINS
- Obrigações Acessórias (DCTF, EFD, SPED)

**Informações**
- Tipo de guia
- Competência (mês/ano)
- Valor
- Data de vencimento
- Código de barras / linha digitável
- PDF da guia
- Status (Pendente, Paga, Vencida, Parcelada)

#### RF-GUIA-002: Upload Automático pelo Escritório
- API para escritório enviar guias em lote
- Notificação automática ao cliente
- Validação de duplicidade (competência + tipo)

#### RF-GUIA-003: Calendário de Obrigações
- View de calendário mensal
- Marcação de guias por status
- Filtro por tipo de obrigação
- Lembretes configuráveis (7, 3, 1 dia antes)

#### RF-GUIA-004: Controle de Vencimentos
- Listagem de guias vencendo em 7 dias
- Alerta visual (badge vermelho)
- Ordenação por data de vencimento
- Flag de "Urgente" para vencimentos em 48h

#### RF-GUIA-005: Pagamento e Comprovação
- Upload de comprovante de pagamento
- Marcação manual como "Paga"
- Histórico de pagamentos
- Relatório de guias pagas por período

#### RF-GUIA-006: Integração com Open Finance (Futuro)
- Pagamento direto via Pix
- Débito automático
- Conciliação automática

---

### 3.7 Sistema de Notificações

#### RF-NOT-001: Tipos de Notificações

**Críticas (Alerta Vermelho)**
- Guia vencida
- Certificado digital vencendo em 7 dias
- Erro na emissão de NF-e
- Bloqueio de emissão (problemas cadastrais)

**Importantes (Alerta Amarelo)**
- Guia vencendo em 3 dias
- Documento pendente de upload
- Rascunho de nota com mais de 15 dias
- Atualização cadastral necessária

**Informativas (Alerta Azul)**
- Guia vencendo em 7 dias
- Novo documento disponível
- Comunicado do escritório
- Nota fiscal emitida com sucesso

#### RF-NOT-002: Central de Notificações
- Badge com contador no menu
- Listagem ordenada por criticidade
- Marcar como lida
- Marcar todas como lidas
- Filtro por tipo
- Histórico de notificações (30 dias)

#### RF-NOT-003: Canais de Notificação
- **In-app**: Sempre ativo
- **Email**: Configurável por tipo
- **SMS**: Apenas para críticas (opcional)
- **WhatsApp**: Via API Business (futuro)
- **Push**: Para app mobile (futuro)

#### RF-NOT-004: Configurações de Notificação
- Ativar/desativar por tipo
- Frequência (instantâneo, diário, semanal)
- Horários permitidos (não perturbar)
- Usuários destinatários (por perfil)

---

### 3.8 Relatórios e Análises

#### RF-REL-001: Relatórios Fiscais

**Livro de Serviços Prestados**
- Notas emitidas no período
- Agrupamento por tomador, CNAE ou município
- Totalização de impostos
- Exportação PDF/Excel

**Relatório de ISS**
- ISS próprio x ISS retido
- Comparativo mensal
- Gráfico de evolução
- Análise por alíquota

**Relatório de Tributos Federais**
- IR, PIS, COFINS, CSLL
- Valores retidos
- Valores a recolher
- Comparativo com período anterior

#### RF-REL-002: Relatórios Gerenciais

**DRE Simplificada**
- Receita bruta
- Deduções e impostos
- Receita líquida
- Margem de lucro estimada

**Fluxo de Caixa Fiscal**
- Entradas (notas emitidas)
- Saídas (guias pagas)
- Saldo projetado

**Análise de Tomadores**
- Top 10 clientes
- Faturamento por tomador
- Concentração de receita
- Churn (clientes inativos)

#### RF-REL-003: Dashboards Analíticos
- Gráficos interativos (Recharts)
- Filtros dinâmicos
- Drill-down por dimensão
- Exportação de gráficos (PNG)

---

### 3.9 Configurações da Empresa

#### RF-CONF-001: Dados Cadastrais
- Razão Social e Nome Fantasia
- CNPJ e Inscrições (Municipal/Estadual)
- Endereço completo
- Contato (telefone, email)
- Responsável legal
- Regime tributário
- CNAE principal e secundários
- Data de abertura

#### RF-CONF-002: Configurações Fiscais
- Alíquota de ISS padrão
- Município de prestação padrão
- Série de NF-e
- Próximo número de nota
- Código de Tributação Municipal padrão
- Retenções padrão (IR, PIS, COFINS, CSLL)

#### RF-CONF-003: Certificado Digital
- Upload de certificado (A1 - .pfx)
- Senha do certificado (criptografada)
- Validade do certificado
- Alerta de vencimento (30, 15, 7 dias)
- Renovação assistida (link para AR)

#### RF-CONF-004: Integração com Prefeitura
- Usuário e senha do portal da prefeitura
- Chave de API (quando disponível)
- Teste de conexão
- Logs de integração

#### RF-CONF-005: Preferências
- Logo da empresa (upload)
- Cores do sistema (white-label parcial)
- Idioma (PT-BR padrão)
- Fuso horário
- Formato de data e moeda

---

### 3.10 Comunicação com o Escritório

#### RF-COM-001: Central de Mensagens
- Chat integrado (estilo WhatsApp)
- Anexo de arquivos (até 10MB)
- Histórico de conversas
- Status: Enviado, Lido, Respondido
- Notificação para contador

#### RF-COM-002: Sistema de Tickets
- Abertura de chamado por categoria:
  - Dúvida fiscal
  - Problema técnico
  - Solicitação de documento
  - Alteração cadastral
  - Outros
- Prioridade (Baixa, Média, Alta)
- SLA configurável por tipo
- Status do ticket (Aberto, Em andamento, Resolvido)
- Avaliação do atendimento (1-5 estrelas)

#### RF-COM-003: Base de Conhecimento
- FAQ categorizado
- Tutoriais em vídeo
- Artigos do escritório
- Busca inteligente
- Conteúdo atualizado pelo contador

---

## 4. Módulo Administrativo (Escritório)

### 4.1 Painel do Contador

#### RF-ADM-001: Visão Geral de Clientes
- Listagem de todas as empresas
- Status de cada cliente (Ativo, Inadimplente, Bloqueado)
- Alertas por cliente (pendências)
- Filtros e busca
- Ações em lote

#### RF-ADM-002: Gestão de Clientes
- Cadastro de nova empresa
- Edição de dados fiscais
- Upload de documentos em nome do cliente
- Upload de guias
- Configuração de permissões especiais
- Bloqueio/desbloqueio de acesso

#### RF-ADM-003: Monitoramento de Atividades
- Dashboard com métricas agregadas:
  - Notas emitidas (todas as empresas)
  - Guias vencendo
  - Tickets abertos
  - Alertas críticos
- Log de atividades suspeitas
- Relatório de uso da plataforma

#### RF-ADM-004: Comunicação em Massa
- Envio de comunicados para todos os clientes
- Segmentação por regime tributário ou porte
- Agendamento de envios
- Templates de mensagem

#### RF-ADM-005: Configuração de Serviços
- Ativar/desativar módulos por cliente
- Configurar limites (notas/mês, usuários, storage)
- Definir SLA de atendimento
- Personalizar base de conhecimento

---

## 5. Requisitos Não Funcionais

### 5.1 Segurança

#### RNF-SEC-001: Autenticação e Autorização
- JWT com RS256 (chaves assimétricas)
- Refresh token com rotação
- Rate limiting por IP e por usuário:
  - Login: 5 tentativas / 15 min
  - API geral: 100 req/min por usuário
  - Emissão NF-e: 20 req/hora por empresa
- CORS restrito
- CSRF protection

#### RNF-SEC-002: Criptografia
- Senhas: bcrypt (cost factor 12)
- Dados sensíveis (certificado digital): AES-256-GCM
- Comunicação: TLS 1.3
- Backup: Criptografia em repouso (S3 SSE-KMS)

#### RNF-SEC-003: LGPD Compliance
- Consentimento explícito para tratamento de dados
- Direito ao esquecimento (anonimização após 5 anos)
- Portabilidade de dados (exportação JSON/XML)
- Relatório de tratamento de dados
- DPO designado
- Termo de uso e política de privacidade

#### RNF-SEC-004: Auditoria
- Log de todas as ações críticas:
  - Login/logout
  - Emissão/cancelamento de NF-e
  - Alteração de dados cadastrais
  - Upload/download de documentos
  - Gestão de usuários
- Retenção de logs: 5 anos
- Logs imutáveis (write-once)
- SIEM para detecção de anomalias

#### RNF-SEC-005: Backup e Recuperação
- Backup incremental diário (hot)
- Backup completo semanal (cold)
- Retenção: 90 dias (diário), 1 ano (semanal)
- RPO (Recovery Point Objective): 24h
- RTO (Recovery Time Objective): 4h
- Testes de recuperação trimestrais

#### RNF-SEC-006: Proteção de Dados em Trânsito
- HTTPS obrigatório (HSTS)
- Certificate pinning (app mobile)
- Validação de certificado digital antes de upload

---

### 5.2 Performance

#### RNF-PERF-001: Tempo de Resposta
- Páginas estáticas: < 1s (LCP)
- Listagens: < 2s
- Emissão de NF-e: < 5s (síncrono) ou notificação async
- Busca: < 1.5s
- Upload: progressivo com chunking (10MB chunks)

#### RNF-PERF-002: Escalabilidade
- Horizontal scaling para API (stateless)
- Load balancing com health checks
- Cache em múltiplas camadas:
  - Browser cache (static assets)
  - CDN (CloudFlare)
  - Redis (dados de sessão, queries frequentes)
  - PostgreSQL query cache
- Database connection pooling (pgBouncer)

#### RNF-PERF-003: Otimizações
- Lazy loading de componentes React
- Code splitting por rota
- Image optimization (WebP, lazy load)
- Pagination (20-50 itens por página)
- Infinite scroll para mobile
- Compression (gzip/brotli)

#### RNF-PERF-004: Processamento Assíncrono
- Queue (Bull + Redis) para:
  - Envio de emails
  - Geração de relatórios
  - OCR de documentos
  - Transmissão de NF-e
  - Importação em lote
- Workers escaláveis horizontalmente
- Dead letter queue para falhas

---

### 5.3 Disponibilidade

#### RNF-DISP-001: Uptime
- SLA: 99.5% (tempo de inatividade mensal: ~3.6h)
- Manutenções programadas: janelas de 2h, horários não comerciais
- Notificação prévia de manutenções (48h)

#### RNF-DISP-002: Monitoramento
- Health check: /api/health (HTTP 200)
- Prometheus metrics:
  - Request rate
  - Error rate
  - Latency (p50, p95, p99)
  - Database connections
  - Queue size
- Alertas via PagerDuty/Opsgenie
- Status page público (status.seudominio.com.br)

#### RNF-DISP-003: Disaster Recovery
- Multi-region deployment (primary + failover)
- Automatic failover (< 5 min)
- Database replication (streaming)
- Testes de DR semestrais

---

### 5.4 Usabilidade

#### RNF-USA-001: Interface
- Design responsivo (mobile-first)
- Breakpoints: 320px, 768px, 1024px, 1440px
- Material Design 3
- Dark mode (toggle)
- Acessibilidade WCAG 2.1 AA: