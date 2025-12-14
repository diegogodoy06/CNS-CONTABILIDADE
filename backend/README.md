# CNS Contabilidade - Backend API

API REST desenvolvida com NestJS para o sistema CNS Contabilidade.

## 🚀 Tecnologias

- **NestJS** v11 - Framework Node.js progressivo
- **Prisma** v5 - ORM TypeScript
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **class-validator** - Validação de DTOs
- **class-transformer** - Transformação de dados

## 📋 Pré-requisitos

- Node.js v20.19+
- PostgreSQL v14+
- npm ou yarn

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env com suas configurações
# DATABASE_URL, JWT_SECRET, etc.

# Gerar cliente Prisma
npm run prisma:generate

# Sincronizar schema com o banco (se necessário)
npm run prisma:push
```

## ⚙️ Variáveis de Ambiente

```env
# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5432/cns_contabil_db"

# JWT
JWT_SECRET=sua-chave-secreta-min-32-chars
JWT_REFRESH_SECRET=sua-chave-refresh-min-32-chars

# Servidor
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## 🏃 Executar

```bash
# Desenvolvimento (com hot reload)
npm run start:dev

# Produção
npm run build
npm run start:prod

# Debug
npm run start:debug
```

## 📚 Documentação da API

Após iniciar o servidor, acesse:
- **Swagger UI**: http://localhost:3000/docs

## 🗂️ Estrutura de Módulos

```
src/
├── common/           # Componentes compartilhados
│   ├── decorators/   # @CurrentUser, @Auth, @Roles
│   ├── dto/          # DTOs base (paginação, etc.)
│   ├── filters/      # Exception filters
│   └── interceptors/ # Response transform, logging
├── config/           # Validação de env
├── prisma/           # Prisma service
└── modules/
    ├── auth/         # Autenticação (login, register, JWT)
    ├── usuarios/     # CRUD de usuários
    ├── empresas/     # CRUD de empresas
    ├── tomadores/    # CRUD de tomadores
    ├── notas-fiscais/# Emissão de NFS-e
    ├── guias/        # Gerenciamento de guias
    ├── documentos/   # Upload de documentos
    ├── localidades/  # Estados e municípios
    ├── dashboard/    # Métricas e resumos
    └── notificacoes/ # Sistema de notificações
```

## 🔐 Autenticação

A API usa JWT para autenticação:

```typescript
// Login
POST /api/v1/auth/login
Body: { email, senha }
Response: { user, tokens: { accessToken, refreshToken } }

// Usar token nas requisições
Headers: { Authorization: "Bearer <accessToken>" }

// Refresh token
POST /api/v1/auth/refresh
Body: { refreshToken }
```

## 📍 Endpoints Principais

### Auth
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Dados do usuário autenticado

### Empresas
- `GET /api/v1/empresas` - Listar empresas
- `GET /api/v1/empresas/:id` - Buscar empresa
- `POST /api/v1/empresas` - Criar empresa
- `PATCH /api/v1/empresas/:id` - Atualizar empresa
- `DELETE /api/v1/empresas/:id` - Remover empresa

### Notas Fiscais
- `GET /api/v1/notas-fiscais` - Listar notas
- `POST /api/v1/notas-fiscais` - Criar nota
- `POST /api/v1/notas-fiscais/:id/emitir` - Emitir nota
- `POST /api/v1/notas-fiscais/:id/cancelar` - Cancelar nota

### Guias
- `GET /api/v1/guias` - Listar guias
- `GET /api/v1/guias/proximas-vencer` - Próximas a vencer
- `GET /api/v1/guias/vencidas` - Guias vencidas
- `POST /api/v1/guias/:id/pagar` - Registrar pagamento

### Localidades
- `GET /api/v1/localidades/estados` - Listar estados
- `GET /api/v1/localidades/municipios` - Buscar municípios
- `GET /api/v1/localidades/municipios?termo=são&uf=SP` - Autocomplete

### Dashboard
- `GET /api/v1/dashboard/resumo` - Resumo geral
- `GET /api/v1/dashboard/financeiro` - Resumo financeiro
- `GET /api/v1/dashboard/alertas` - Alertas e pendências

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes com coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📦 Scripts Prisma

```bash
# Gerar cliente
npm run prisma:generate

# Criar migration
npm run prisma:migrate

# Push schema (dev)
npm run prisma:push

# Studio (GUI)
npm run prisma:studio

# Reset banco
npm run db:reset
```

## 🏗️ Build

```bash
# Build para produção
npm run build

# Resultado em ./dist
```

## 📝 Convenções

### DTOs
- `create-*.dto.ts` - Criação
- `update-*.dto.ts` - Atualização (PartialType)
- `filter-*.dto.ts` - Filtros e paginação

### Validação
- Usar decorators do `class-validator`
- DTOs com `@ApiProperty` para Swagger
- Validadores customizados em `common/decorators/validators`

### Resposta Padrão
```typescript
{
  "success": true,
  "data": { ... },
  "meta": { "total": 100, "page": 1, "perPage": 20 },
  "timestamp": "2024-12-14T20:00:00.000Z"
}
```

### Erros
```typescript
{
  "statusCode": 400,
  "message": "Erro de validação",
  "error": "Bad Request",
  "details": { ... },
  "path": "/api/v1/...",
  "timestamp": "2024-12-14T20:00:00.000Z"
}
```

## 🔒 Versionamento da API

A API é versionada via URI:
- `/api/v1/*` - Versão 1 (atual)
- `/api/v2/*` - Versão 2 (futuro)

## 📄 Licença

Proprietário - CNS Contabilidade
