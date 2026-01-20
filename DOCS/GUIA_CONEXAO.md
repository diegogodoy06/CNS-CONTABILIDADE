# 🔌 Guia de Conexão Frontend-Backend

## Pré-requisitos

1. **PostgreSQL** instalado e rodando
2. **Node.js** v18+ instalado
3. **npm** ou **yarn** instalado

---

## 🚀 Passo a Passo para Iniciar o Sistema

### 1. Backend (API)

```bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install

# Configurar o banco de dados
# Copie o arquivo .env.example para .env e configure a DATABASE_URL
cp .env.example .env

# Gerar o cliente Prisma
npm run prisma:generate

# Rodar as migrations do banco
npm run prisma:migrate

# (Opcional) Popular o banco com dados de teste
npm run prisma:seed

# Iniciar o servidor de desenvolvimento
npm run start:dev
```

O backend estará disponível em: **http://localhost:3000**

Documentação Swagger: **http://localhost:3000/docs**

---

### 2. Frontend Cliente

```bash
# Entrar na pasta do frontend cliente
cd frontend-cliente

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

O frontend cliente estará disponível em: **http://localhost:5173**

---

### 3. Frontend Admin

```bash
# Entrar na pasta do frontend admin
cd frontend-admin

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

O frontend admin estará disponível em: **http://localhost:5174**

---

## 🔑 Credenciais de Teste (após rodar seed)

### Portal Cliente (http://localhost:5173)

| Email | Senha | Tipo |
|-------|-------|------|
| cliente@teste.com.br | Cliente@123 | CLIENTE |
| admin@cns.com.br | Admin@123 | ADMIN (também funciona) |

### Portal Admin (http://localhost:5174)

| Email | Senha | Tipo |
|-------|-------|------|
| admin@cns.com.br | Admin@123 | ADMIN_ESCRITORIO |

---

## 📁 Arquivos de Configuração

### Backend (.env)

```env
NODE_ENV=development
PORT=3000
API_PREFIX=api
DATABASE_URL="postgresql://user:password@localhost:5432/cns_contabil_db?schema=public"
JWT_SECRET=sua-chave-secreta-muito-segura-aqui-min-32-chars
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=sua-chave-refresh-secreta-muito-segura-aqui
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend Cliente (.env)

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_ENV=development
```

### Frontend Admin (.env)

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_ENV=development
```

---

## 🔄 Fluxo de Autenticação

```
┌─────────────┐     POST /auth/login      ┌─────────────┐
│   Frontend  │ ─────────────────────────>│   Backend   │
│   (React)   │     { email, senha }      │   (NestJS)  │
└─────────────┘                           └─────────────┘
       │                                         │
       │<────────────────────────────────────────│
       │  { user, tokens: { accessToken,         │
       │    refreshToken, expiresIn } }          │
       │                                         │
       ▼                                         │
┌─────────────┐                                  │
│ localStorage│ <- Salva tokens                  │
└─────────────┘                                  │
       │                                         │
       ▼                                         │
┌─────────────┐   GET /api/v1/* + Bearer Token   │
│   Axios     │ ─────────────────────────────────>
│ Interceptor │                                  │
└─────────────┘                                  │
```

---

## 🧪 Testando a Conexão

### 1. Verificar se o Backend está rodando

```bash
curl http://localhost:3000/api/v1/auth/me
# Deve retornar 401 (não autenticado)
```

### 2. Fazer login via API

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cnscontabil.com.br","senha":"admin123"}'
```

### 3. Acessar rota protegida

```bash
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🐛 Troubleshooting

### Erro de CORS

Se você receber erros de CORS, verifique:
1. A variável `CORS_ORIGIN` no `.env` do backend
2. A URL do frontend deve corresponder exatamente

### Erro de conexão com banco de dados

1. Verifique se o PostgreSQL está rodando
2. Verifique a `DATABASE_URL` no `.env`
3. Execute `npm run prisma:migrate` para criar as tabelas

### Token expirado

O frontend automaticamente faz refresh do token quando expira.
Se continuar com problemas, limpe o localStorage e faça login novamente.

---

## 📊 Endpoints Principais

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /api/v1/auth/login | Login |
| POST | /api/v1/auth/register | Registro |
| POST | /api/v1/auth/refresh | Refresh token |
| POST | /api/v1/auth/logout | Logout |
| GET | /api/v1/auth/me | Usuário atual |

### Admin

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/v1/admin/empresas | Listar empresas |
| GET | /api/v1/admin/usuarios | Listar usuários |
| GET | /api/v1/admin/tickets | Listar tickets |
| GET | /api/v1/admin/relatorios/dashboard | Dashboard |

### Cliente

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/v1/cliente/empresas | Minhas empresas |
| POST | /api/v1/cliente/notas-fiscais | Emitir nota |
| GET | /api/v1/cliente/guias | Minhas guias |
| POST | /api/v1/cliente/tickets | Abrir ticket |

---

## ✅ Status de Implementação

- [x] Backend 100% implementado
- [x] Frontend Cliente com login funcional
- [x] Frontend Admin com login funcional
- [x] Interceptors de autenticação
- [x] Refresh token automático
- [ ] Integração completa de todos os módulos (em progresso)

---

**Última atualização:** 20/01/2026
