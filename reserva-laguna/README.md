# Fornecedores — Reserva Laguna
### Plataforma de fornecedores e prestadores de serviço

---

## 🚀 Deploy em 5 passos

### PASSO 1 — Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) → **New Project**
2. Nomeie: `reserva-laguna` | Escolha a região: **South America (São Paulo)**
3. Anote: **Project URL** e **anon key** (em Settings → API)
4. Anote também a **service_role key** (manter em segredo)

---

### PASSO 2 — Configurar banco de dados

No Supabase Dashboard → **SQL Editor** → cole e execute:
```
supabase/migrations/001_initial_schema.sql
```

Depois, em **Storage** → **New Bucket**:
- Nome: `supplier-photos` | ✅ Public
- Nome: `cover-photo` | ✅ Public

Copie e execute o bloco de políticas de storage que está comentado no final da migration.

---

### PASSO 3 — Criar usuário admin

No Supabase Dashboard → **Authentication** → **Users** → **Invite user**
- E-mail: `admin@reservalaguna.com.br` (ou o que preferir)
- Após criar, vá em SQL Editor e execute:

```sql
UPDATE public.profiles
SET role = 'admin', unit = 'Administração'
WHERE id = '<cole-aqui-o-uuid-do-usuario>';
```

O UUID aparece na lista de usuários em Authentication → Users.

---

### PASSO 4 — Configurar autenticação OAuth (Google e Apple)

**Google:**
1. [console.cloud.google.com](https://console.cloud.google.com) → Credentials → OAuth 2.0
2. Authorized redirect URI: `https://SEU_PROJETO.supabase.co/auth/v1/callback`
3. No Supabase → Authentication → Providers → Google → cole Client ID e Secret

**Apple:**
1. [developer.apple.com](https://developer.apple.com) → Certificates → Sign in with Apple
2. Siga as instruções do Supabase: Authentication → Providers → Apple

> Para e-mail (magic link) funciona automaticamente com o SMTP do Supabase.

---

### PASSO 5 — Deploy no Vercel

1. Faça upload deste projeto para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) → **New Project** → importe o repositório
3. Em **Environment Variables**, adicione:

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sua_anon_key` |
| `SUPABASE_SERVICE_ROLE_KEY` | `sua_service_role_key` |
| `NEXT_PUBLIC_APP_URL` | `https://seu-projeto.vercel.app` |
| `ADMIN_EMAIL` | `admin@reservalaguna.com.br` |

4. Clique **Deploy** — em ~2 minutos estará no ar ✅

---

## 📁 Estrutura do projeto

```
reserva-laguna/
├── app/
│   ├── page.tsx                  # Página principal
│   ├── admin/page.tsx            # Painel administrativo
│   ├── convite/[token]/          # Página de convite do morador
│   ├── fornecedor-cad/           # Auto-cadastro de fornecedores
│   └── api/
│       ├── auth/callback/        # OAuth callback
│       ├── auth/signout/         # Logout
│       ├── suppliers/            # CRUD de fornecedores
│       ├── reviews/              # Moderação de avaliações
│       ├── users/                # Gestão de convites
│       └── cover/                # Upload da foto de capa
├── components/
│   ├── ui/                       # Componentes da plataforma
│   └── admin/                    # Componentes do painel admin
├── lib/
│   ├── supabase-client.ts        # Supabase para o browser
│   ├── supabase-server.ts        # Supabase para o servidor
│   ├── auth.ts                   # Helpers de autenticação
│   └── types.ts                  # TypeScript types
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql  # Schema completo do banco
```

---

## 🔧 Desenvolvimento local

```bash
# 1. Instalar dependências
npm install

# 2. Copiar e preencher variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas credenciais

# 3. Rodar em desenvolvimento
npm run dev
# Acesse: http://localhost:3000
```

---

## 👤 Fluxo de usuários

### Admin
1. Login em `/` → botão Entrar → credenciais do Supabase Auth
2. Menu → Painel Admin → `/admin`
3. Pré-cadastra moradores (gera link de convite)
4. Aprova fornecedores e avaliações

### Morador
1. Recebe link de convite (`/convite/TOKEN`)
2. Escolhe: Apple, Google ou e-mail
3. Confirma e-mail → acesso liberado
4. Pode indicar fornecedores e avaliar
5. Pode copiar link de auto-cadastro para fornecedores

### Fornecedor
1. Recebe link `/fornecedor-cad`
2. Preenche formulário de auto-cadastro
3. Admin aprova → aparece na plataforma
4. Fornecedor **não pode** avaliar ou comentar (bloqueado por RLS)

---

## 🔒 Segurança

- **RLS (Row Level Security)** ativo em todas as tabelas
- Fornecedores não podem avaliar (verificado no banco, não só no frontend)
- Service role key nunca exposta ao cliente
- Tokens de convite expiram em 7 dias
- Admin verificado server-side em todas as rotas protegidas

---

## 📝 Após o deploy — próximas configurações

1. **Adicionar logo**: coloque `logo.png` em `/public/logo.png`
2. **Configurar domínio personalizado**: Vercel → Settings → Domains
3. **Configurar SMTP para e-mails**: Supabase → Settings → Auth → SMTP (recomendo SendGrid ou Resend)
4. **Adicionar fornecedores iniciais**: Admin → Fornecedores → ou via SQL

---

*Reserva Laguna — Plataforma de Fornecedores v1.0*
