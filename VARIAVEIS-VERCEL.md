# ✅ Variáveis de Ambiente — Vercel

Cole exatamente estas 5 variáveis no Vercel:
(Settings → Environment Variables → Add)

---

## Como encontrar cada valor:

### 1. NEXT_PUBLIC_SUPABASE_URL
**Onde:** supabase.com → Seu projeto → Settings → API → Project URL
**Formato:** `https://abcdefghijklmnop.supabase.co`

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY  
**Onde:** supabase.com → Seu projeto → Settings → API → Project API keys → `anon` `public`
**Formato:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...` (JWT longo)

### 3. SUPABASE_SERVICE_ROLE_KEY
**Onde:** supabase.com → Seu projeto → Settings → API → Project API keys → `service_role` `secret`
**Formato:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...` (JWT longo, diferente do anterior)
⚠️ Esta chave é secreta — não marcar como "Expose to browser"

### 4. NEXT_PUBLIC_APP_URL
**Onde:** você mesmo define — é a URL do seu site no Vercel
**Formato:** `https://amigos-do-reserva.vercel.app`
(encontre em Vercel → seu projeto → Domains)

### 5. ADMIN_EMAIL
**Onde:** você mesmo define — e-mail do administrador
**Formato:** `admin@reservalaguna.com.br`
(use o mesmo e-mail que cadastrar no Supabase Auth)

---

## Passo a passo visual no Vercel:

1. Acesse vercel.com → seu projeto
2. Clique em **Settings** (barra superior)
3. Clique em **Environment Variables** (menu lateral)
4. Para cada variável:
   - Campo **Name** → cole o nome (ex: `NEXT_PUBLIC_SUPABASE_URL`)
   - Campo **Value** → cole o valor
   - Em **Environments** → marque: ✅ Production ✅ Preview ✅ Development
   - Clique **Save**
5. Após adicionar as 5, vá em **Deployments** → clique nos 3 pontinhos do último deploy → **Redeploy**

