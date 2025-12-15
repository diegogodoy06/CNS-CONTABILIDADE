-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "audit";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "comm";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "config";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "core";

-- CreateEnum
CREATE TYPE "core"."TipoUsuario" AS ENUM ('ADMIN_SISTEMA', 'ADMIN_ESCRITORIO', 'COLABORADOR', 'CLIENTE');

-- CreateEnum
CREATE TYPE "core"."StatusUsuario" AS ENUM ('ATIVO', 'INATIVO', 'PENDENTE', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "core"."TipoPessoa" AS ENUM ('FISICA', 'JURIDICA');

-- CreateEnum
CREATE TYPE "core"."RegimeTributario" AS ENUM ('SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO', 'LUCRO_REAL', 'MEI');

-- CreateEnum
CREATE TYPE "core"."StatusEmpresa" AS ENUM ('ATIVA', 'INATIVA', 'SUSPENSA', 'BAIXADA');

-- CreateEnum
CREATE TYPE "core"."RoleEmpresa" AS ENUM ('PROPRIETARIO', 'SOCIO', 'CONTADOR', 'FUNCIONARIO', 'VISUALIZADOR');

-- CreateEnum
CREATE TYPE "core"."StatusNota" AS ENUM ('RASCUNHO', 'EMITIDA', 'CANCELADA', 'SUBSTITUIDA');

-- CreateEnum
CREATE TYPE "core"."StatusGuia" AS ENUM ('PENDENTE', 'PAGA', 'VENCIDA', 'CANCELADA', 'PARCELADA');

-- CreateEnum
CREATE TYPE "core"."TipoGuia" AS ENUM ('DAS', 'ISS', 'IRPJ', 'CSLL', 'PIS', 'COFINS', 'INSS', 'FGTS', 'OUTROS');

-- CreateEnum
CREATE TYPE "core"."TipoDocumento" AS ENUM ('CONTRATO_SOCIAL', 'ALTERACAO_CONTRATUAL', 'BALANCO', 'DRE', 'LIVRO_CAIXA', 'PROCURACAO', 'CERTIFICADO_DIGITAL', 'COMPROVANTE', 'NOTA_FISCAL', 'GUIA', 'OUTROS');

-- CreateEnum
CREATE TYPE "core"."StatusDocumento" AS ENUM ('ATIVO', 'ARQUIVADO', 'EXCLUIDO');

-- CreateEnum
CREATE TYPE "comm"."TipoNotificacao" AS ENUM ('SISTEMA', 'VENCIMENTO', 'DOCUMENTO', 'MENSAGEM', 'ALERTA');

-- CreateEnum
CREATE TYPE "comm"."CanalNotificacao" AS ENUM ('APP', 'EMAIL', 'SMS', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "comm"."StatusNotificacao" AS ENUM ('PENDENTE', 'ENVIADA', 'LIDA', 'ERRO');

-- CreateEnum
CREATE TYPE "comm"."StatusTicket" AS ENUM ('ABERTO', 'EM_ANDAMENTO', 'AGUARDANDO_CLIENTE', 'RESOLVIDO', 'FECHADO');

-- CreateEnum
CREATE TYPE "comm"."PrioridadeTicket" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "audit"."TipoAcao" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT');

-- CreateEnum
CREATE TYPE "config"."TipoFeriado" AS ENUM ('NACIONAL', 'ESTADUAL', 'MUNICIPAL');

-- CreateEnum
CREATE TYPE "config"."FrequenciaObrigacao" AS ENUM ('MENSAL', 'TRIMESTRAL', 'ANUAL', 'EVENTUAL');

-- CreateTable
CREATE TABLE "config"."regioes" (
    "id" INTEGER NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "sigla" VARCHAR(2) NOT NULL,

    CONSTRAINT "regioes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config"."estados" (
    "id" INTEGER NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "sigla" VARCHAR(2) NOT NULL,
    "codigo_ibge" INTEGER NOT NULL,
    "regiao_id" INTEGER NOT NULL,
    "capital_codigo" INTEGER,

    CONSTRAINT "estados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config"."municipios" (
    "codigo" INTEGER NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "estado_id" INTEGER NOT NULL,

    CONSTRAINT "municipios_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "config"."configuracoes" (
    "id" UUID NOT NULL,
    "chave" VARCHAR(100) NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" VARCHAR(20) NOT NULL DEFAULT 'string',
    "descricao" TEXT,
    "grupo" VARCHAR(50) NOT NULL DEFAULT 'geral',
    "editavel" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config"."feriados" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "data" DATE NOT NULL,
    "tipo" "config"."TipoFeriado" NOT NULL,
    "recorrente" BOOLEAN NOT NULL DEFAULT true,
    "estado_id" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feriados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config"."obrigacoes_fiscais" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT,
    "frequencia" "config"."FrequenciaObrigacao" NOT NULL,
    "dia_vencimento" INTEGER NOT NULL,
    "antecipa_feriado" BOOLEAN NOT NULL DEFAULT true,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "regimes_tributarios" "core"."RegimeTributario"[],
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "obrigacoes_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config"."empresa_obrigacoes" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "obrigacao_id" UUID NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "observacoes" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresa_obrigacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."escritorio" (
    "id" UUID NOT NULL,
    "razao_social" VARCHAR(200) NOT NULL,
    "nome_fantasia" VARCHAR(200),
    "cnpj" VARCHAR(14) NOT NULL,
    "inscricao_estadual" VARCHAR(20),
    "crc" VARCHAR(20),
    "email" VARCHAR(200) NOT NULL,
    "telefone" VARCHAR(20),
    "celular" VARCHAR(20),
    "logradouro" VARCHAR(200),
    "numero" VARCHAR(20),
    "complemento" VARCHAR(100),
    "bairro" VARCHAR(100),
    "cep" VARCHAR(8),
    "estado_id" INTEGER,
    "municipio_codigo" INTEGER,
    "logo_url" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escritorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."empresas" (
    "id" UUID NOT NULL,
    "escritorio_id" UUID NOT NULL,
    "razao_social" VARCHAR(200) NOT NULL,
    "nome_fantasia" VARCHAR(200),
    "cnpj" VARCHAR(14) NOT NULL,
    "inscricao_estadual" VARCHAR(20),
    "inscricao_municipal" VARCHAR(20),
    "regime_tributario" "core"."RegimeTributario" NOT NULL,
    "ramo_atividade" VARCHAR(200),
    "cnae_principal" VARCHAR(10),
    "data_abertura" DATE,
    "email" VARCHAR(200) NOT NULL,
    "telefone" VARCHAR(20),
    "celular" VARCHAR(20),
    "logradouro" VARCHAR(200),
    "numero" VARCHAR(20),
    "complemento" VARCHAR(100),
    "bairro" VARCHAR(100),
    "cep" VARCHAR(8),
    "estado_id" INTEGER,
    "municipio_codigo" INTEGER,
    "municipio_prestacao_codigo" INTEGER,
    "codigo_servico" VARCHAR(20),
    "aliquota_iss" DECIMAL(5,2) DEFAULT 0,
    "status" "core"."StatusEmpresa" NOT NULL DEFAULT 'ATIVA',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."usuarios" (
    "id" UUID NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "cpf" VARCHAR(11),
    "telefone" VARCHAR(20),
    "celular" VARCHAR(20),
    "avatar_url" TEXT,
    "tipo" "core"."TipoUsuario" NOT NULL,
    "status" "core"."StatusUsuario" NOT NULL DEFAULT 'PENDENTE',
    "email_verificado" BOOLEAN NOT NULL DEFAULT false,
    "token_verificacao" TEXT,
    "token_recuperacao" TEXT,
    "token_expiracao" TIMESTAMP(3),
    "ultimo_login" TIMESTAMP(3),
    "tentativas_login" INTEGER NOT NULL DEFAULT 0,
    "bloqueado_ate" TIMESTAMP(3),
    "mfa_secret" TEXT,
    "mfa_habilitado" BOOLEAN NOT NULL DEFAULT false,
    "mfa_ativado_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."colaboradores_escritorio" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "escritorio_id" UUID NOT NULL,
    "cargo" VARCHAR(100),
    "departamento" VARCHAR(100),
    "data_admissao" DATE,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colaboradores_escritorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."usuarios_empresas" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "role" "core"."RoleEmpresa" NOT NULL,
    "permissoes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."tomadores" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "tipo_pessoa" "core"."TipoPessoa" NOT NULL,
    "cpf_cnpj" VARCHAR(14) NOT NULL,
    "razao_social" VARCHAR(200) NOT NULL,
    "nome_fantasia" VARCHAR(200),
    "inscricao_estadual" VARCHAR(20),
    "inscricao_municipal" VARCHAR(20),
    "email" VARCHAR(200),
    "telefone" VARCHAR(20),
    "logradouro" VARCHAR(200),
    "numero" VARCHAR(20),
    "complemento" VARCHAR(100),
    "bairro" VARCHAR(100),
    "cep" VARCHAR(8),
    "estado_id" INTEGER,
    "municipio_codigo" INTEGER,
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tomadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."notas_fiscais" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "tomador_id" UUID NOT NULL,
    "numero" INTEGER,
    "serie" VARCHAR(10),
    "codigo_verificacao" VARCHAR(50),
    "data_emissao" DATE NOT NULL,
    "competencia" DATE NOT NULL,
    "descricao_servico" TEXT NOT NULL,
    "codigo_servico" VARCHAR(20) NOT NULL,
    "valor_servico" DECIMAL(15,2) NOT NULL,
    "valor_deducoes" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "base_calculo" DECIMAL(15,2) NOT NULL,
    "aliquota_iss" DECIMAL(5,2) NOT NULL,
    "valor_iss" DECIMAL(15,2) NOT NULL,
    "iss_retido" BOOLEAN NOT NULL DEFAULT false,
    "valor_iss_retido" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valor_pis" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valor_cofins" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valor_inss" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valor_ir" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valor_csll" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "outras_retencoes" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valor_liquido" DECIMAL(15,2) NOT NULL,
    "local_prestacao_municipio_codigo" INTEGER,
    "status" "core"."StatusNota" NOT NULL DEFAULT 'RASCUNHO',
    "motivo_cancelamento" TEXT,
    "nota_substituida_id" UUID,
    "xml_nota" TEXT,
    "pdf_url" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notas_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."guias" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "tipo" "core"."TipoGuia" NOT NULL,
    "competencia" DATE NOT NULL,
    "data_vencimento" DATE NOT NULL,
    "data_pagamento" DATE,
    "valor" DECIMAL(15,2) NOT NULL,
    "valor_pago" DECIMAL(15,2),
    "juros" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "multa" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "codigo_barras" TEXT,
    "linha_digitavel" TEXT,
    "numero_documento" VARCHAR(50),
    "status" "core"."StatusGuia" NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "pdf_url" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."documentos" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "tipo" "core"."TipoDocumento" NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descricao" TEXT,
    "nome_arquivo" VARCHAR(255) NOT NULL,
    "caminho_arquivo" TEXT NOT NULL,
    "tamanho_bytes" BIGINT NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "hash_arquivo" VARCHAR(64),
    "versao" INTEGER NOT NULL DEFAULT 1,
    "documento_original_id" UUID,
    "status" "core"."StatusDocumento" NOT NULL DEFAULT 'ATIVO',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comm"."notificacoes" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "tipo" "comm"."TipoNotificacao" NOT NULL,
    "canal" "comm"."CanalNotificacao" NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "mensagem" TEXT NOT NULL,
    "dados" JSONB,
    "link" TEXT,
    "status" "comm"."StatusNotificacao" NOT NULL DEFAULT 'PENDENTE',
    "enviada_em" TIMESTAMP(3),
    "lida_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comm"."configuracoes_notificacao" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "tipo" "comm"."TipoNotificacao" NOT NULL,
    "canal" "comm"."CanalNotificacao" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comm"."mensagens" (
    "id" UUID NOT NULL,
    "remetente_id" UUID NOT NULL,
    "destinatario_id" UUID NOT NULL,
    "assunto" VARCHAR(200),
    "conteudo" TEXT NOT NULL,
    "lida_em" TIMESTAMP(3),
    "arquivada_remetente" BOOLEAN NOT NULL DEFAULT false,
    "arquivada_destinatario" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comm"."tickets" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "criador_id" UUID NOT NULL,
    "atribuido_id" UUID,
    "titulo" VARCHAR(200) NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" VARCHAR(50) NOT NULL,
    "prioridade" "comm"."PrioridadeTicket" NOT NULL DEFAULT 'MEDIA',
    "status" "comm"."StatusTicket" NOT NULL DEFAULT 'ABERTO',
    "prazo_resposta" TIMESTAMP(3),
    "resolvido_em" TIMESTAMP(3),
    "fechado_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comm"."ticket_comentarios" (
    "id" UUID NOT NULL,
    "ticket_id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "conteudo" TEXT NOT NULL,
    "interno" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_comentarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit"."logs" (
    "id" UUID NOT NULL,
    "usuario_id" UUID,
    "acao" "audit"."TipoAcao" NOT NULL,
    "tabela" VARCHAR(100) NOT NULL,
    "registro_id" UUID,
    "dados_antigos" JSONB,
    "dados_novos" JSONB,
    "ip" VARCHAR(45),
    "user_agent" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit"."sessoes" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "ip" VARCHAR(45),
    "user_agent" TEXT,
    "expira_em" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "encerrado_em" TIMESTAMP(3),

    CONSTRAINT "sessoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit"."acessos_documentos" (
    "id" UUID NOT NULL,
    "documento_id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "acao" VARCHAR(20) NOT NULL,
    "ip" VARCHAR(45),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "acessos_documentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "estados_sigla_key" ON "config"."estados"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "estados_codigo_ibge_key" ON "config"."estados"("codigo_ibge");

-- CreateIndex
CREATE INDEX "municipios_estado_id_idx" ON "config"."municipios"("estado_id");

-- CreateIndex
CREATE INDEX "municipios_nome_idx" ON "config"."municipios"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "configuracoes_chave_key" ON "config"."configuracoes"("chave");

-- CreateIndex
CREATE UNIQUE INDEX "feriados_data_tipo_estado_id_key" ON "config"."feriados"("data", "tipo", "estado_id");

-- CreateIndex
CREATE UNIQUE INDEX "empresa_obrigacoes_empresa_id_obrigacao_id_key" ON "config"."empresa_obrigacoes"("empresa_id", "obrigacao_id");

-- CreateIndex
CREATE UNIQUE INDEX "escritorio_cnpj_key" ON "core"."escritorio"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "core"."empresas"("cnpj");

-- CreateIndex
CREATE INDEX "empresas_escritorio_id_idx" ON "core"."empresas"("escritorio_id");

-- CreateIndex
CREATE INDEX "empresas_status_idx" ON "core"."empresas"("status");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "core"."usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "core"."usuarios"("cpf");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "core"."usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_tipo_idx" ON "core"."usuarios"("tipo");

-- CreateIndex
CREATE INDEX "usuarios_status_idx" ON "core"."usuarios"("status");

-- CreateIndex
CREATE UNIQUE INDEX "colaboradores_escritorio_usuario_id_key" ON "core"."colaboradores_escritorio"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_empresas_usuario_id_empresa_id_key" ON "core"."usuarios_empresas"("usuario_id", "empresa_id");

-- CreateIndex
CREATE INDEX "tomadores_empresa_id_idx" ON "core"."tomadores"("empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "tomadores_empresa_id_cpf_cnpj_key" ON "core"."tomadores"("empresa_id", "cpf_cnpj");

-- CreateIndex
CREATE INDEX "notas_fiscais_empresa_id_idx" ON "core"."notas_fiscais"("empresa_id");

-- CreateIndex
CREATE INDEX "notas_fiscais_tomador_id_idx" ON "core"."notas_fiscais"("tomador_id");

-- CreateIndex
CREATE INDEX "notas_fiscais_status_idx" ON "core"."notas_fiscais"("status");

-- CreateIndex
CREATE INDEX "notas_fiscais_competencia_idx" ON "core"."notas_fiscais"("competencia");

-- CreateIndex
CREATE INDEX "guias_empresa_id_idx" ON "core"."guias"("empresa_id");

-- CreateIndex
CREATE INDEX "guias_status_idx" ON "core"."guias"("status");

-- CreateIndex
CREATE INDEX "guias_data_vencimento_idx" ON "core"."guias"("data_vencimento");

-- CreateIndex
CREATE INDEX "documentos_empresa_id_idx" ON "core"."documentos"("empresa_id");

-- CreateIndex
CREATE INDEX "documentos_tipo_idx" ON "core"."documentos"("tipo");

-- CreateIndex
CREATE INDEX "notificacoes_usuario_id_idx" ON "comm"."notificacoes"("usuario_id");

-- CreateIndex
CREATE INDEX "notificacoes_status_idx" ON "comm"."notificacoes"("status");

-- CreateIndex
CREATE UNIQUE INDEX "configuracoes_notificacao_usuario_id_tipo_canal_key" ON "comm"."configuracoes_notificacao"("usuario_id", "tipo", "canal");

-- CreateIndex
CREATE INDEX "mensagens_remetente_id_idx" ON "comm"."mensagens"("remetente_id");

-- CreateIndex
CREATE INDEX "mensagens_destinatario_id_idx" ON "comm"."mensagens"("destinatario_id");

-- CreateIndex
CREATE INDEX "tickets_empresa_id_idx" ON "comm"."tickets"("empresa_id");

-- CreateIndex
CREATE INDEX "tickets_status_idx" ON "comm"."tickets"("status");

-- CreateIndex
CREATE INDEX "logs_usuario_id_idx" ON "audit"."logs"("usuario_id");

-- CreateIndex
CREATE INDEX "logs_tabela_idx" ON "audit"."logs"("tabela");

-- CreateIndex
CREATE INDEX "logs_criado_em_idx" ON "audit"."logs"("criado_em");

-- CreateIndex
CREATE UNIQUE INDEX "sessoes_token_key" ON "audit"."sessoes"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessoes_refresh_token_key" ON "audit"."sessoes"("refresh_token");

-- CreateIndex
CREATE INDEX "sessoes_usuario_id_idx" ON "audit"."sessoes"("usuario_id");

-- CreateIndex
CREATE INDEX "sessoes_token_idx" ON "audit"."sessoes"("token");

-- AddForeignKey
ALTER TABLE "config"."estados" ADD CONSTRAINT "estados_regiao_id_fkey" FOREIGN KEY ("regiao_id") REFERENCES "config"."regioes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "config"."municipios" ADD CONSTRAINT "municipios_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "config"."estados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "config"."feriados" ADD CONSTRAINT "feriados_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "config"."estados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "config"."empresa_obrigacoes" ADD CONSTRAINT "empresa_obrigacoes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "core"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "config"."empresa_obrigacoes" ADD CONSTRAINT "empresa_obrigacoes_obrigacao_id_fkey" FOREIGN KEY ("obrigacao_id") REFERENCES "config"."obrigacoes_fiscais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."escritorio" ADD CONSTRAINT "escritorio_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "config"."estados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."escritorio" ADD CONSTRAINT "escritorio_municipio_codigo_fkey" FOREIGN KEY ("municipio_codigo") REFERENCES "config"."municipios"("codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."empresas" ADD CONSTRAINT "empresas_escritorio_id_fkey" FOREIGN KEY ("escritorio_id") REFERENCES "core"."escritorio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."empresas" ADD CONSTRAINT "empresas_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "config"."estados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."empresas" ADD CONSTRAINT "empresas_municipio_codigo_fkey" FOREIGN KEY ("municipio_codigo") REFERENCES "config"."municipios"("codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."empresas" ADD CONSTRAINT "empresas_municipio_prestacao_codigo_fkey" FOREIGN KEY ("municipio_prestacao_codigo") REFERENCES "config"."municipios"("codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."colaboradores_escritorio" ADD CONSTRAINT "colaboradores_escritorio_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "core"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."colaboradores_escritorio" ADD CONSTRAINT "colaboradores_escritorio_escritorio_id_fkey" FOREIGN KEY ("escritorio_id") REFERENCES "core"."escritorio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."usuarios_empresas" ADD CONSTRAINT "usuarios_empresas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "core"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."usuarios_empresas" ADD CONSTRAINT "usuarios_empresas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "core"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."tomadores" ADD CONSTRAINT "tomadores_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "core"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."tomadores" ADD CONSTRAINT "tomadores_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "config"."estados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."tomadores" ADD CONSTRAINT "tomadores_municipio_codigo_fkey" FOREIGN KEY ("municipio_codigo") REFERENCES "config"."municipios"("codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."notas_fiscais" ADD CONSTRAINT "notas_fiscais_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "core"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."notas_fiscais" ADD CONSTRAINT "notas_fiscais_tomador_id_fkey" FOREIGN KEY ("tomador_id") REFERENCES "core"."tomadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."notas_fiscais" ADD CONSTRAINT "notas_fiscais_local_prestacao_municipio_codigo_fkey" FOREIGN KEY ("local_prestacao_municipio_codigo") REFERENCES "config"."municipios"("codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."notas_fiscais" ADD CONSTRAINT "notas_fiscais_nota_substituida_id_fkey" FOREIGN KEY ("nota_substituida_id") REFERENCES "core"."notas_fiscais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."guias" ADD CONSTRAINT "guias_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "core"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."documentos" ADD CONSTRAINT "documentos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "core"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."documentos" ADD CONSTRAINT "documentos_documento_original_id_fkey" FOREIGN KEY ("documento_original_id") REFERENCES "core"."documentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comm"."notificacoes" ADD CONSTRAINT "notificacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "core"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comm"."configuracoes_notificacao" ADD CONSTRAINT "configuracoes_notificacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "core"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comm"."mensagens" ADD CONSTRAINT "mensagens_remetente_id_fkey" FOREIGN KEY ("remetente_id") REFERENCES "core"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comm"."mensagens" ADD CONSTRAINT "mensagens_destinatario_id_fkey" FOREIGN KEY ("destinatario_id") REFERENCES "core"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comm"."tickets" ADD CONSTRAINT "tickets_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "core"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comm"."tickets" ADD CONSTRAINT "tickets_criador_id_fkey" FOREIGN KEY ("criador_id") REFERENCES "core"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comm"."tickets" ADD CONSTRAINT "tickets_atribuido_id_fkey" FOREIGN KEY ("atribuido_id") REFERENCES "core"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comm"."ticket_comentarios" ADD CONSTRAINT "ticket_comentarios_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "comm"."tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comm"."ticket_comentarios" ADD CONSTRAINT "ticket_comentarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "core"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit"."logs" ADD CONSTRAINT "logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "core"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit"."sessoes" ADD CONSTRAINT "sessoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "core"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit"."acessos_documentos" ADD CONSTRAINT "acessos_documentos_documento_id_fkey" FOREIGN KEY ("documento_id") REFERENCES "core"."documentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit"."acessos_documentos" ADD CONSTRAINT "acessos_documentos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "core"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
