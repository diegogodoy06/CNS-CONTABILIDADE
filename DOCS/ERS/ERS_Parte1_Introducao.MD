# ESPECIFICAÇÃO DE REQUISITOS DE SOFTWARE

## Sistema de Gestão Contábil Digital — CNS Contabilidade

---

**Documento:** ERS-CNS-2024-001  
**Versão:** 1.0  
**Data:** 14 de Dezembro de 2024  
**Status:** Em Elaboração  

---

### Controle de Versões

| Versão | Data | Autor | Descrição da Alteração |
|--------|------|-------|------------------------|
| 0.1 | 01/12/2024 | Equipe de Desenvolvimento | Criação do documento inicial |
| 0.2 | 07/12/2024 | Equipe de Desenvolvimento | Inclusão de requisitos funcionais |
| 1.0 | 14/12/2024 | Equipe de Desenvolvimento | Versão consolidada para revisão |

---

### Aprovações

| Função | Nome | Assinatura | Data |
|--------|------|------------|------|
| Gerente de Projeto | | | |
| Analista de Sistemas | | | |
| Arquiteto de Software | | | |
| Cliente/Stakeholder | | | |

---

## PARTE 1 — INTRODUÇÃO E VISÃO GERAL

---

### SUMÁRIO

1. [Introdução](#1-introdução)
   - 1.1 [Propósito](#11-propósito)
   - 1.2 [Escopo do Produto](#12-escopo-do-produto)
   - 1.3 [Definições, Acrônimos e Abreviações](#13-definições-acrônimos-e-abreviações)
   - 1.4 [Referências](#14-referências)
   - 1.5 [Visão Geral do Documento](#15-visão-geral-do-documento)
2. [Descrição Geral do Projeto](#2-descrição-geral-do-projeto)
   - 2.1 [Contexto do Negócio](#21-contexto-do-negócio)
   - 2.2 [Objetivos do Sistema](#22-objetivos-do-sistema)
   - 2.3 [Benefícios Esperados](#23-benefícios-esperados)
3. [Stakeholders e Usuários](#3-stakeholders-e-usuários)
   - 3.1 [Identificação dos Stakeholders](#31-identificação-dos-stakeholders)
   - 3.2 [Perfis de Usuário](#32-perfis-de-usuário)
4. [Premissas, Restrições e Dependências](#4-premissas-restrições-e-dependências)
   - 4.1 [Premissas](#41-premissas)
   - 4.2 [Restrições](#42-restrições)
   - 4.3 [Dependências](#43-dependências)

---

## 1. INTRODUÇÃO

### 1.1 Propósito

Este documento tem como propósito estabelecer a Especificação de Requisitos de Software (ERS) para o **Sistema de Gestão Contábil Digital**, doravante denominado "Sistema" ou "Plataforma CNS".

A presente especificação destina-se a:

a) Definir de forma clara e completa os requisitos funcionais e não funcionais do Sistema;

b) Servir como base para o planejamento, desenvolvimento, testes e validação do software;

c) Estabelecer um acordo formal entre as partes interessadas quanto às funcionalidades esperadas;

d) Fornecer subsídios para estimativas de esforço, prazo e custo do projeto;

e) Documentar as decisões técnicas e de negócio para referência futura.

Este documento é dirigido às seguintes audiências:

- Equipe de desenvolvimento de software
- Gerentes de projeto
- Analistas de qualidade e testadores
- Stakeholders e patrocinadores do projeto
- Equipe de infraestrutura e operações

### 1.2 Escopo do Produto

#### 1.2.1 Identificação do Produto

**Nome do Produto:** Sistema de Gestão Contábil Digital CNS  
**Versão Inicial:** 1.0  
**Tipo de Software:** Aplicação Web (SaaS - Software as a Service)  

#### 1.2.2 Descrição do Produto

O Sistema de Gestão Contábil Digital CNS é uma plataforma web desenvolvida para modernizar e automatizar a relação entre escritórios de contabilidade e seus clientes empresariais. A solução é composta por dois módulos principais:

**a) Portal do Cliente (Frontend Cliente)**

Interface dedicada às empresas clientes do escritório contábil, permitindo:
- Emissão de notas fiscais de serviço (NFS-e)
- Gestão de documentos fiscais e contábeis
- Consulta e download de guias de impostos
- Cadastro e gestão de tomadores de serviço
- Comunicação direta com o escritório contábil
- Visualização de relatórios e indicadores financeiros

**b) Portal Administrativo (Frontend Admin)**

Interface exclusiva para os colaboradores do escritório de contabilidade, permitindo:
- Gestão centralizada de todas as empresas clientes
- Upload de guias e documentos em nome dos clientes
- Monitoramento de alertas e pendências
- Comunicação em massa com clientes
- Relatórios gerenciais consolidados
- Configurações administrativas do sistema

#### 1.2.3 Delimitação do Escopo

**Está incluído no escopo deste projeto:**

1. Desenvolvimento dos dois portais web (Cliente e Administrativo)
2. Integração com prefeituras para emissão de NFS-e (padrão ABRASF)
3. Sistema de autenticação e autorização com suporte a múltiplas empresas
4. Gestão documental com upload, categorização e busca
5. Sistema de notificações multicanal (in-app, email)
6. Relatórios fiscais e gerenciais
7. Sistema de comunicação (chat e tickets)

**Não está incluído no escopo deste projeto:**

1. Aplicativo móvel nativo (iOS/Android)
2. Integração com sistemas ERP de terceiros
3. Módulo de folha de pagamento
4. Módulo de escrituração contábil completa
5. Integração com Open Finance/Open Banking
6. Emissão de NF-e de produtos (apenas serviços)

#### 1.2.4 Contexto do Sistema

O sistema será implantado como solução white-label, permitindo que cada escritório de contabilidade personalize a plataforma com sua identidade visual. O modelo de negócio prevê cobrança por assinatura mensal, calculada com base no número de empresas clientes ativas.

```
┌─────────────────────────────────────────────────────────────────┐
│                    VISÃO GERAL DO SISTEMA                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────┐         ┌─────────────────┐              │
│   │  PORTAL CLIENTE │         │  PORTAL ADMIN   │              │
│   │  (Empresas)     │         │  (Escritório)   │              │
│   └────────┬────────┘         └────────┬────────┘              │
│            │                           │                        │
│            └───────────┬───────────────┘                        │
│                        │                                        │
│                        ▼                                        │
│            ┌───────────────────────┐                           │
│            │      API BACKEND      │                           │
│            │    (Node.js/Express)  │                           │
│            └───────────┬───────────┘                           │
│                        │                                        │
│         ┌──────────────┼──────────────┐                        │
│         ▼              ▼              ▼                        │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│   │PostgreSQL│  │  Redis   │  │ Storage  │                    │
│   │   (BD)   │  │ (Cache)  │  │  (S3)    │                    │
│   └──────────┘  └──────────┘  └──────────┘                    │
│                                                                 │
│                        │                                        │
│                        ▼                                        │
│            ┌───────────────────────┐                           │
│            │  INTEGRAÇÕES EXTERNAS │                           │
│            │  - Prefeituras (NFS-e)│                           │
│            │  - Receita Federal    │                           │
│            │  - Email (SendGrid)   │                           │
│            └───────────────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Definições, Acrônimos e Abreviações

#### 1.3.1 Definições

| Termo | Definição |
|-------|-----------|
| **Cliente** | Empresa (pessoa jurídica) que contrata os serviços do escritório de contabilidade e utiliza o Portal do Cliente. |
| **Colaborador** | Funcionário do escritório de contabilidade que utiliza o Portal Administrativo. |
| **Contador** | Profissional responsável técnico do escritório de contabilidade. |
| **Escritório** | Empresa de contabilidade que contrata a plataforma CNS para atender seus clientes. |
| **Guia** | Documento de arrecadação de tributos (DAS, ISS, INSS, etc.). |
| **Nota Fiscal de Serviço** | Documento fiscal eletrônico que comprova a prestação de serviços (NFS-e). |
| **Plataforma** | Conjunto completo do sistema, incluindo ambos os portais e infraestrutura. |
| **Portal** | Interface web de acesso ao sistema (Cliente ou Administrativo). |
| **Stakeholder** | Pessoa ou organização que possui interesse no projeto ou será afetada pelo sistema. |
| **Tomador** | Pessoa física ou jurídica que contrata/recebe os serviços prestados pelo Cliente. |
| **Usuário** | Pessoa física que acessa o sistema, podendo ser do Cliente ou do Escritório. |
| **White-label** | Modelo de produto que permite personalização da marca pelo contratante. |

#### 1.3.2 Acrônimos

| Acrônimo | Significado |
|----------|-------------|
| **2FA** | Two-Factor Authentication (Autenticação de Dois Fatores) |
| **ABRASF** | Associação Brasileira das Secretarias de Finanças das Capitais |
| **API** | Application Programming Interface |
| **CDN** | Content Delivery Network |
| **CNAE** | Classificação Nacional de Atividades Econômicas |
| **CNPJ** | Cadastro Nacional da Pessoa Jurídica |
| **COFINS** | Contribuição para o Financiamento da Seguridade Social |
| **CPF** | Cadastro de Pessoas Físicas |
| **CRC** | Conselho Regional de Contabilidade |
| **CSRF** | Cross-Site Request Forgery |
| **CSLL** | Contribuição Social sobre o Lucro Líquido |
| **CTM** | Código de Tributação Municipal |
| **DAS** | Documento de Arrecadação do Simples Nacional |
| **DCTF** | Declaração de Débitos e Créditos Tributários Federais |
| **DRE** | Demonstração do Resultado do Exercício |
| **EFD** | Escrituração Fiscal Digital |
| **EPP** | Empresa de Pequeno Porte |
| **ERS** | Especificação de Requisitos de Software |
| **FGTS** | Fundo de Garantia do Tempo de Serviço |
| **HTTP** | Hypertext Transfer Protocol |
| **HTTPS** | HTTP Secure |
| **IE** | Inscrição Estadual |
| **IM** | Inscrição Municipal |
| **INSS** | Instituto Nacional do Seguro Social |
| **IR** | Imposto de Renda |
| **ISS** | Imposto Sobre Serviços |
| **JSON** | JavaScript Object Notation |
| **JWT** | JSON Web Token |
| **LGPD** | Lei Geral de Proteção de Dados |
| **ME** | Microempresa |
| **MEI** | Microempreendedor Individual |
| **MUI** | Material-UI (biblioteca de componentes React) |
| **NFS-e** | Nota Fiscal de Serviço Eletrônica |
| **OCR** | Optical Character Recognition |
| **ORM** | Object-Relational Mapping |
| **PDF** | Portable Document Format |
| **PIS** | Programa de Integração Social |
| **REST** | Representational State Transfer |
| **RFB** | Receita Federal do Brasil |
| **RPO** | Recovery Point Objective |
| **RTO** | Recovery Time Objective |
| **SaaS** | Software as a Service |
| **SINTEGRA** | Sistema Integrado de Informações sobre Operações Interestaduais |
| **SLA** | Service Level Agreement |
| **SMS** | Short Message Service |
| **SPED** | Sistema Público de Escrituração Digital |
| **SQL** | Structured Query Language |
| **SSL** | Secure Sockets Layer |
| **TLS** | Transport Layer Security |
| **UI** | User Interface |
| **UX** | User Experience |
| **XML** | Extensible Markup Language |

#### 1.3.3 Abreviações

| Abreviação | Significado |
|------------|-------------|
| **Admin** | Administrativo |
| **Auth** | Autenticação |
| **BD** | Banco de Dados |
| **CLI** | Cliente |
| **Conf** | Configurações |
| **Doc** | Documento |
| **Req** | Requisito |
| **RF** | Requisito Funcional |
| **RNF** | Requisito Não Funcional |

### 1.4 Referências

#### 1.4.1 Documentos Normativos

| ID | Documento | Versão | Descrição |
|----|-----------|--------|-----------|
| REF-001 | IEEE 830-1998 | 1998 | IEEE Recommended Practice for Software Requirements Specifications |
| REF-002 | ISO/IEC/IEEE 29148:2018 | 2018 | Systems and software engineering — Life cycle processes — Requirements engineering |
| REF-003 | Lei nº 13.709/2018 | 2018 | Lei Geral de Proteção de Dados Pessoais (LGPD) |
| REF-004 | Decreto nº 10.854/2021 | 2021 | Regulamenta a NFS-e de padrão nacional |
| REF-005 | Manual ABRASF | 2.04 | Manual de Integração da NFS-e |

#### 1.4.2 Documentos do Projeto

| ID | Documento | Descrição |
|----|-----------|-----------|
| DOC-001 | Roadmap_Implementacao.md | Cronograma e fases de implementação |
| DOC-002 | ERS_Parte2_DescricaoGeral.md | Descrição detalhada do sistema |
| DOC-003 | ERS_Parte3_Requisitos.md | Especificação completa dos requisitos |

#### 1.4.3 Documentação Técnica

| ID | Documento | URL/Localização |
|----|-----------|-----------------|
| TEC-001 | React Documentation | https://react.dev |
| TEC-002 | Material-UI Documentation | https://mui.com |
| TEC-003 | Node.js Documentation | https://nodejs.org/docs |
| TEC-004 | PostgreSQL Documentation | https://www.postgresql.org/docs |
| TEC-005 | Redis Documentation | https://redis.io/documentation |

### 1.5 Visão Geral do Documento

Este documento está organizado em três partes complementares:

**Parte 1 — Introdução e Visão Geral (Este documento)**

Apresenta o contexto geral do projeto, incluindo propósito, escopo, glossário de termos, identificação de stakeholders e premissas do projeto. Serve como porta de entrada para compreensão do sistema.

**Parte 2 — Descrição Geral do Sistema**

Detalha a arquitetura do sistema, tecnologias utilizadas, características dos usuários, interfaces externas e restrições de design. Fornece a visão técnica necessária para o desenvolvimento.

**Parte 3 — Requisitos Específicos**

Especifica de forma detalhada todos os requisitos funcionais e não funcionais do sistema, organizados por módulo e priorizados conforme criticidade para o negócio.

---

## 2. DESCRIÇÃO GERAL DO PROJETO

### 2.1 Contexto do Negócio

#### 2.1.1 Situação Atual

Os escritórios de contabilidade brasileiros enfrentam desafios significativos na gestão do relacionamento com seus clientes empresariais:

**Problemas identificados:**

1. **Comunicação fragmentada:** Troca de informações via WhatsApp, email e telefone sem rastreabilidade.

2. **Processos manuais:** Envio de guias de impostos por email, controle em planilhas, dependência de ligações telefônicas.

3. **Baixa autonomia do cliente:** Empresários dependem do contador para tarefas simples como emitir uma nota fiscal ou consultar uma guia.

4. **Falta de visibilidade:** Clientes não têm acesso fácil ao status de suas obrigações fiscais e documentos.

5. **Retrabalho:** Solicitações repetitivas consomem tempo da equipe contábil.

6. **Dificuldade de escala:** Modelo atual limita o crescimento do escritório.

#### 2.1.2 Solução Proposta

O Sistema de Gestão Contábil Digital CNS propõe uma transformação digital completa da relação contador-cliente através de:

1. **Autoatendimento:** Clientes realizam até 80% das operações rotineiras sem intervenção do escritório.

2. **Centralização:** Todas as informações e comunicações em um único ambiente.

3. **Automação:** Notificações automáticas, cálculos de tributos, integração com prefeituras.

4. **Transparência:** Acesso em tempo real a documentos, guias e status das obrigações.

5. **Escalabilidade:** Infraestrutura cloud que permite crescimento sem investimento em hardware.

#### 2.1.3 Modelo de Operação

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODELO DE OPERAÇÃO                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ESCRITÓRIO CONTÁBIL                 EMPRESAS CLIENTES          │
│  ┌─────────────────┐                ┌─────────────────┐        │
│  │                 │                │                 │        │
│  │  • Cadastra     │                │  • Emite NFS-e  │        │
│  │    clientes     │                │  • Consulta     │        │
│  │                 │                │    guias        │        │
│  │  • Upload de    │◄──────────────►│  • Upload docs  │        │
│  │    guias        │   PLATAFORMA   │  • Abre tickets │        │
│  │                 │      CNS       │                 │        │
│  │  • Responde     │                │  • Visualiza    │        │
│  │    tickets      │                │    relatórios   │        │
│  │                 │                │                 │        │
│  │  • Comunicados  │                │  • Recebe       │        │
│  │    em massa     │                │    alertas      │        │
│  │                 │                │                 │        │
│  └─────────────────┘                └─────────────────┘        │
│           │                                  │                  │
│           │         ┌──────────────┐         │                  │
│           └────────►│   RECEITA    │◄────────┘                  │
│                     │   FEDERAL    │                            │
│                     │  PREFEITURAS │                            │
│                     └──────────────┘                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Objetivos do Sistema

#### 2.2.1 Objetivo Geral

Desenvolver e implantar uma plataforma web que automatize e simplifique a gestão contábil de pequenas empresas, promovendo autonomia aos clientes e eficiência operacional aos escritórios de contabilidade.

#### 2.2.2 Objetivos Específicos

| ID | Objetivo | Indicador de Sucesso |
|----|----------|---------------------|
| OBJ-01 | Permitir emissão de NFS-e de forma autônoma pelo cliente | 90% das notas emitidas sem intervenção do escritório |
| OBJ-02 | Centralizar documentos fiscais e contábeis | 100% dos documentos acessíveis na plataforma |
| OBJ-03 | Automatizar alertas de vencimento de guias | Zero guias vencidas por falta de comunicação |
| OBJ-04 | Reduzir tempo de atendimento a solicitações | Redução de 50% no tempo médio de resposta |
| OBJ-05 | Facilitar comunicação contador-cliente | 80% das comunicações via plataforma |
| OBJ-06 | Prover visibilidade de indicadores financeiros | Dashboard atualizado em tempo real |
| OBJ-07 | Garantir conformidade com LGPD | 100% dos dados tratados conforme legislação |
| OBJ-08 | Assegurar disponibilidade do sistema | Uptime de 99,5% |

### 2.3 Benefícios Esperados

#### 2.3.1 Benefícios para o Escritório Contábil

| Benefício | Descrição | Impacto Estimado |
|-----------|-----------|------------------|
| Aumento de produtividade | Redução de tarefas manuais e repetitivas | +40% de capacidade |
| Escalabilidade | Atender mais clientes com a mesma equipe | +50% de carteira |
| Redução de erros | Automação de cálculos e validações | -70% de retrabalho |
| Satisfação do cliente | Atendimento ágil e transparente | +30% NPS |
| Diferencial competitivo | Modernização do serviço prestado | Retenção de clientes |

#### 2.3.2 Benefícios para as Empresas Clientes

| Benefício | Descrição | Impacto Estimado |
|-----------|-----------|------------------|
| Autonomia | Realizar operações sem depender do contador | Disponibilidade 24/7 |
| Agilidade | Emissão de notas em menos de 2 minutos | -80% tempo |
| Organização | Documentos centralizados e categorizados | Busca instantânea |
| Controle | Visibilidade de obrigações e vencimentos | Zero surpresas |
| Comunicação | Canal direto e rastreável com escritório | Histórico completo |

---

## 3. STAKEHOLDERS E USUÁRIOS

### 3.1 Identificação dos Stakeholders

#### 3.1.1 Stakeholders Primários

| ID | Stakeholder | Papel | Interesse no Sistema |
|----|-------------|-------|---------------------|
| STK-01 | Escritório de Contabilidade (Contratante) | Proprietário/Cliente | Sistema funcional que aumente produtividade e satisfação dos clientes |
| STK-02 | Empresas Clientes | Usuário final | Ferramenta que simplifique obrigações fiscais |
| STK-03 | Contador Responsável Técnico | Usuário administrativo | Controle e visibilidade de todos os clientes |
| STK-04 | Equipe de Desenvolvimento | Executor | Requisitos claros e estáveis para desenvolvimento |

#### 3.1.2 Stakeholders Secundários

| ID | Stakeholder | Papel | Interesse no Sistema |
|----|-------------|-------|---------------------|
| STK-05 | Receita Federal | Regulador | Conformidade fiscal das empresas |
| STK-06 | Prefeituras | Regulador/Integrador | Recebimento correto de NFS-e |
| STK-07 | Conselho Regional de Contabilidade | Regulador | Conformidade profissional |
| STK-08 | Autoridade Nacional de Proteção de Dados | Regulador | Conformidade com LGPD |

### 3.2 Perfis de Usuário

#### 3.2.1 Usuários do Portal do Cliente

**Perfil UC-01: Administrador da Empresa**

| Atributo | Descrição |
|----------|-----------|
| **Descrição** | Sócio ou responsável legal da empresa cliente |
| **Responsabilidades** | Gerenciar usuários, configurações da empresa, aprovar operações críticas |
| **Frequência de uso** | Diária a semanal |
| **Conhecimento técnico** | Básico a intermediário |
| **Conhecimento do domínio** | Intermediário (conhece suas obrigações fiscais) |
| **Permissões** | Acesso total às funcionalidades do Portal Cliente |

**Perfil UC-02: Operador**

| Atributo | Descrição |
|----------|-----------|
| **Descrição** | Funcionário da empresa cliente com permissão de operação |
| **Responsabilidades** | Emitir notas fiscais, cadastrar tomadores, fazer upload de documentos |
| **Frequência de uso** | Diária |
| **Conhecimento técnico** | Básico |
| **Conhecimento do domínio** | Básico a intermediário |
| **Permissões** | Operações do dia a dia, sem acesso a configurações |

**Perfil UC-03: Visualizador**

| Atributo | Descrição |
|----------|-----------|
| **Descrição** | Funcionário ou consultor com acesso somente leitura |
| **Responsabilidades** | Consultar informações, gerar relatórios, baixar documentos |
| **Frequência de uso** | Eventual |
| **Conhecimento técnico** | Básico |
| **Conhecimento do domínio** | Variável |
| **Permissões** | Apenas visualização e download |

#### 3.2.2 Usuários do Portal Administrativo

**Perfil UA-01: Administrador do Escritório**

| Atributo | Descrição |
|----------|-----------|
| **Descrição** | Sócio ou gestor do escritório de contabilidade |
| **Responsabilidades** | Configurações gerais, gestão de colaboradores, relatórios gerenciais |
| **Frequência de uso** | Diária |
| **Conhecimento técnico** | Intermediário |
| **Conhecimento do domínio** | Avançado |
| **Permissões** | Acesso total ao Portal Administrativo |

**Perfil UA-02: Contador**

| Atributo | Descrição |
|----------|-----------|
| **Descrição** | Contador responsável por um grupo de clientes |
| **Responsabilidades** | Gestão de clientes atribuídos, upload de guias, resposta a tickets |
| **Frequência de uso** | Diária |
| **Conhecimento técnico** | Intermediário |
| **Conhecimento do domínio** | Avançado |
| **Permissões** | Gestão de clientes, sem configurações administrativas |

**Perfil UA-03: Assistente**

| Atributo | Descrição |
|----------|-----------|
| **Descrição** | Auxiliar administrativo do escritório |
| **Responsabilidades** | Upload de documentos, atendimento de tickets simples |
| **Frequência de uso** | Diária |
| **Conhecimento técnico** | Básico |
| **Conhecimento do domínio** | Básico a intermediário |
| **Permissões** | Operações básicas, sem gestão de clientes |

**Perfil UA-04: Visualizador**

| Atributo | Descrição |
|----------|-----------|
| **Descrição** | Usuário com acesso somente leitura |
| **Responsabilidades** | Consultas e acompanhamento |
| **Frequência de uso** | Eventual |
| **Conhecimento técnico** | Básico |
| **Conhecimento do domínio** | Variável |
| **Permissões** | Apenas visualização |

#### 3.2.3 Matriz de Permissões Resumida

**Portal do Cliente:**

| Funcionalidade | Administrador | Operador | Visualizador |
|----------------|:-------------:|:--------:|:------------:|
| Emitir NFS-e | ✓ | ✓ | — |
| Cancelar NFS-e | ✓ | — | — |
| Upload de documentos | ✓ | ✓ | — |
| Download de documentos | ✓ | ✓ | ✓ |
| Gerenciar tomadores | ✓ | ✓ | — |
| Visualizar guias | ✓ | ✓ | ✓ |
| Gerenciar usuários | ✓ | — | — |
| Configurações | ✓ | — | — |

**Portal Administrativo:**

| Funcionalidade | Admin Escritório | Contador | Assistente | Visualizador |
|----------------|:----------------:|:--------:|:----------:|:------------:|
| Cadastrar clientes | ✓ | ✓ | — | — |
| Bloquear clientes | ✓ | — | — | — |
| Upload de guias | ✓ | ✓ | ✓ | — |
| Gestão de usuários | ✓ | ◐ | — | — |
| Comunicados em massa | ✓ | ✓ | — | — |
| Configurações | ✓ | — | — | — |
| Relatórios | ✓ | ✓ | ◐ | ✓ |
| Auditoria | ✓ | — | — | — |

**Legenda:** ✓ = Acesso total | ◐ = Acesso parcial | — = Sem acesso

---

## 4. PREMISSAS, RESTRIÇÕES E DEPENDÊNCIAS

### 4.1 Premissas

As seguintes premissas foram consideradas na elaboração desta especificação:

| ID | Premissa | Impacto se Falsa |
|----|----------|------------------|
| PRE-01 | O escritório contábil possui infraestrutura de internet adequada | Impossibilidade de uso do sistema |
| PRE-02 | Os usuários possuem conhecimento básico de informática | Necessidade de treinamento extensivo |
| PRE-03 | As empresas clientes possuem certificado digital A1 válido | Impossibilidade de emissão de NFS-e |
| PRE-04 | Os municípios de atuação possuem webservice de NFS-e disponível | Necessidade de processo manual |
| PRE-05 | O escritório possui contador com registro ativo no CRC | Impedimento legal de operação |
| PRE-06 | Os navegadores dos usuários serão versões atualizadas | Possíveis incompatibilidades |
| PRE-07 | O cliente disponibilizará ambiente de homologação | Atrasos nos testes de integração |

### 4.2 Restrições

#### 4.2.1 Restrições de Negócio

| ID | Restrição | Justificativa |
|----|-----------|---------------|
| RES-N01 | O sistema deve estar em conformidade com a LGPD | Obrigação legal |
| RES-N02 | O sistema deve seguir as normas do CFC | Regulamentação profissional |
| RES-N03 | O sistema deve suportar o padrão ABRASF de NFS-e | Interoperabilidade com prefeituras |
| RES-N04 | O modelo de precificação será por assinatura mensal | Decisão estratégica de negócio |

#### 4.2.2 Restrições Técnicas

| ID | Restrição | Justificativa |
|----|-----------|---------------|
| RES-T01 | Frontend desenvolvido em React com TypeScript | Padronização tecnológica |
| RES-T02 | Backend desenvolvido em Node.js | Padronização tecnológica |
| RES-T03 | Banco de dados PostgreSQL | Performance e recursos |
| RES-T04 | Hospedagem em infraestrutura cloud | Escalabilidade e disponibilidade |
| RES-T05 | Interface responsiva para dispositivos móveis | Acessibilidade |
| RES-T06 | Comunicação exclusivamente via HTTPS | Segurança |

#### 4.2.3 Restrições de Prazo e Orçamento

| ID | Restrição | Descrição |
|----|-----------|-----------|
| RES-P01 | MVP em 6 meses | Primeira versão funcional |
| RES-P02 | Versão completa em 12 meses | Todos os módulos implementados |
| RES-P03 | Orçamento definido pelo patrocinador | Limitação de recursos |

### 4.3 Dependências

#### 4.3.1 Dependências Externas

| ID | Dependência | Tipo | Responsável | Criticidade |
|----|-------------|------|-------------|-------------|
| DEP-01 | API de consulta CNPJ (Receita Federal) | Serviço externo | RFB | Alta |
| DEP-02 | Webservices de NFS-e das prefeituras | Serviço externo | Prefeituras | Alta |
| DEP-03 | Serviço de envio de emails (SendGrid/SES) | Serviço contratado | Fornecedor | Média |
| DEP-04 | API de consulta de CEP | Serviço externo | Correios/ViaCEP | Baixa |
| DEP-05 | Serviço de armazenamento (S3) | Serviço contratado | AWS | Alta |
| DEP-06 | Serviço de CDN (CloudFlare) | Serviço contratado | CloudFlare | Média |

#### 4.3.2 Dependências Internas

| ID | Dependência | Descrição | Criticidade |
|----|-------------|-----------|-------------|
| DEP-I01 | Definição de marca do escritório | Necessário para white-label | Média |
| DEP-I02 | Base de clientes para migração | Dados para importação inicial | Alta |
| DEP-I03 | Certificados digitais dos clientes | Necessário para emissão de NFS-e | Alta |
| DEP-I04 | Treinamento de usuários | Necessário para adoção | Média |

---

## ANEXO A — GLOSSÁRIO ESTENDIDO

### A.1 Termos Tributários

| Termo | Definição |
|-------|-----------|
| **Alíquota** | Percentual aplicado sobre a base de cálculo para determinar o valor do tributo. |
| **Base de Cálculo** | Valor sobre o qual incide a alíquota do tributo. |
| **Competência** | Período (mês/ano) a que se refere determinada obrigação tributária. |
| **Contribuinte** | Pessoa física ou jurídica obrigada ao pagamento de tributo. |
| **Fato Gerador** | Situação que dá origem à obrigação tributária. |
| **Regime Tributário** | Conjunto de regras que define como uma empresa paga seus impostos (Simples Nacional, Lucro Presumido, Lucro Real). |
| **Retenção** | Desconto de tributo feito pelo tomador do serviço e repassado ao fisco. |
| **Substituição Tributária** | Transferência da responsabilidade pelo pagamento do tributo a terceiro. |

### A.2 Termos Contábeis

| Termo | Definição |
|-------|-----------|
| **Ativo** | Bens e direitos de propriedade da empresa. |
| **Balanço Patrimonial** | Demonstração contábil que apresenta a posição financeira da empresa. |
| **Balancete** | Relatório contábil que lista os saldos das contas em determinado período. |
| **Demonstração do Resultado** | Relatório que apresenta receitas, custos e despesas de um período. |
| **Escrituração** | Registro sistemático dos fatos contábeis. |
| **Passivo** | Obrigações e dívidas da empresa. |
| **Patrimônio Líquido** | Diferença entre ativo e passivo; representa os recursos próprios. |

### A.3 Termos Técnicos de Software

| Termo | Definição |
|-------|-----------|
| **Backend** | Parte do sistema que processa dados no servidor, não visível ao usuário. |
| **Cache** | Armazenamento temporário de dados para acesso mais rápido. |
| **Deploy** | Processo de disponibilizar uma versão do software em ambiente de produção. |
| **Endpoint** | URL específica de uma API que responde a requisições. |
| **Frontend** | Parte do sistema visível e interativa para o usuário. |
| **Microserviço** | Arquitetura que divide o sistema em serviços pequenos e independentes. |
| **Webhook** | Mecanismo de notificação automática entre sistemas via HTTP. |

---

## ANEXO B — DOCUMENTOS COMPLEMENTARES

### B.1 Lista de Documentos do Projeto

| Código | Nome | Descrição | Status |
|--------|------|-----------|--------|
| ERS-CNS-2024-001 | ERS Parte 1 - Introdução | Este documento | Elaborado |
| ERS-CNS-2024-002 | ERS Parte 2 - Descrição Geral | Arquitetura e especificações técnicas | Pendente |
| ERS-CNS-2024-003 | ERS Parte 3 - Requisitos | Requisitos funcionais e não funcionais | Pendente |
| PGP-CNS-2024-001 | Plano de Gerenciamento do Projeto | Cronograma, recursos, riscos | Pendente |
| ARQ-CNS-2024-001 | Documento de Arquitetura | Arquitetura detalhada do sistema | Pendente |
| TST-CNS-2024-001 | Plano de Testes | Estratégia e casos de teste | Pendente |

---

**FIM DA PARTE 1**

---

*Este documento faz parte da Especificação de Requisitos de Software do Sistema de Gestão Contábil Digital CNS.*

*Documento controlado. A versão válida é a mais recente disponível no repositório oficial do projeto.*
