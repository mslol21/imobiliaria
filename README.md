# Plataforma Imobiliária — Site e Painel Administrativo

Plataforma imobiliária de alto padrão desenvolvida com arquitetura moderna, responsiva, segura e pronta para implantação em produção. Combina curadoria arquitetônica no frontend com robustez full stack no backend utilizando Next.js com App Router, TypeScript strict, Tailwind CSS v4, Zod e Supabase (PostgreSQL, Auth, Storage e Row Level Security).

---

## 1. Visão Geral da Arquitetura

O sistema foi concebido com estrita separação entre a **Área Pública** (aberta a visitantes, sem cadastro público, focada em descoberta, filtro e conversão) e a **Área Administrativa** (restrita a gestores autorizados, protegida em nível de middleware, servidor e banco com RLS).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS APP ROUTER                              │
├───────────────────────────────────┬────────────────────────────────────┤
│           ÁREA PÚBLICA            │        PAINEL ADMINISTRATIVO       │
│  - Home com Hero & Buscador       │  - Login Privativo (Supabase Auth) │
│  - /comprar, /alugar, /imoveis    │  - Dashboard com 9 Indicadores     │
│  - /imoveis/[slug] (Galeria/Mapa) │  - CRUD Completo de Imóveis        │
│  - /sobre, /contato, /anunciar    │  - Upload Múltiplo para Storage    │
│  - /privacidade (LGPD)            │  - CRM de Interessados (Leads)     │
│  - Schema.org JSON-LD & OpenGraph │  - Gestão de Banners e Dados       │
├───────────────────────────────────┴────────────────────────────────────┤
│                       CAMADA DE SERVIÇOS & ACTIONS                     │
│  - Server Actions com Validação Zod & Honeypot Antispam                │
│  - Rate Limiting em Memória por IP                                     │
│  - Revalidação Incremental de Rotas (revalidatePath)                   │
├────────────────────────────────────────────────────────────────────────┤
│                     SUPABASE (BACKEND & PERSISTÊNCIA)                  │
│  - PostgreSQL 15+ com RLS e Triggers de updated_at                     │
│  - Buckets no Supabase Storage: 'property-images'                      │
│  - Supabase Auth com Verificação em public.profiles                    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Stack Tecnológica

- **Frontend:**
  - Next.js (App Router, Server Components)
  - React com TypeScript em modo estrito (`strict: true`, `noImplicitAny: true`)
  - Tailwind CSS v4 (Design Tokens nativos `@theme inline`)
  - Lucide React (Ícones consistentes)
  - Radix UI Primitives (Acessibilidade WCAG 2.2 AA)
  - Google Fonts: `Cormorant Garamond` (títulos editoriais) e `Manrope` (corpo e interfaces)
- **Backend & Dados:**
  - Next.js Server Actions e Route Handlers
  - Supabase PostgreSQL com Migrations versionadas
  - Supabase Auth (Sessões seguras via `@supabase/ssr` e cookies `httpOnly`)
  - Supabase Storage (Bucket `property-images` com upload direto, compressão e validação MIME)
  - Row Level Security (RLS) habilitado em 100% das tabelas
  - Zod para validação rigorosa de entradas
- **Testes & Qualidade:**
  - Vitest para testes unitários e de integração
  - TypeScript Compiler (`tsc --noEmit`)

---

## 3. Identidade Visual e Design Tokens

A identidade foi inspirada em portais imobiliários e publicações arquitetônicas internacionais:

| Token | Hex | Aplicação |
|---|---|---|
| `Ciano` | `#0891B2` | Identidade de destaque, links ativos e botões principais |
| `Cinza claro` | `#F8FAFC` | Superfícies neutras e seções alternadas |
| `Branco Puro` | `#FFFFFF` | Cards, modais e áreas de leitura |
| `Cinza suave` | `#E5E5E5` | Bordas discretas e divisores |
| `Grafite` | `#18181B` | Tipografia principal de alta legibilidade |

---

## 4. Estrutura de Pastas

```
imobiliaria/
├── src/
│   ├── actions/               # Server Actions (Auth, Imóveis, Leads, Configurações)
│   ├── app/                   # Next.js App Router
│   │   ├── (public)/          # Rotas públicas com Layout (Header, Footer, WhatsApp)
│   │   │   ├── page.tsx       # Home com todas as 8 seções
│   │   │   ├── comprar/       # Catálogo filtrado para venda
│   │   │   ├── alugar/        # Catálogo filtrado para locação
│   │   │   ├── imoveis/       # Portfólio completo com filtros combinados
│   │   │   │   └── [slug]/    # Página individual do imóvel (galeria, mapa, ficha)
│   │   │   ├── sobre/         # Página institucional
│   │   │   ├── contato/       # Central de atendimento
│   │   │   ├── anunciar/      # Captação de proprietários
│   │   │   └── privacidade/   # Política de privacidade LGPD
│   │   ├── admin/             # Área Administrativa Privada
│   │   │   ├── login/         # Tela de autenticação segura
│   │   │   └── (dashboard)/   # Layout autenticado com Sidebar
│   │   │       ├── page.tsx   # Dashboard comercial (9 indicadores)
│   │   │       ├── imoveis/   # CRUD de imóveis (listagem, novo, editar)
│   │   │       ├── interessados/ # CRM de Leads
│   │   │       ├── banners/   # Gestão de Hero & Banners
│   │   │       └── configuracoes/ # Dados societários, CRECI e contato
│   │   ├── globals.css        # Tailwind v4 e Design Tokens
│   │   ├── layout.tsx         # Layout raiz com fontes e metadados
│   │   ├── not-found.tsx      # Erro 404 personalizado
│   │   ├── error.tsx          # Error boundary
│   │   ├── sitemap.ts         # Sitemap dinâmico XML
│   │   └── robots.ts          # Configuração robots.txt
│   ├── components/            # Componentes React
│   │   ├── admin/             # Tabelas, uploaders e formulários admin
│   │   ├── forms/             # Formulários públicos com feedback
│   │   ├── layout/            # Header, Footer, WhatsApp flutuante
│   │   ├── properties/        # Cards, Buscador Hero, Filtros, Galeria Lightbox
│   │   └── ui/                # Botões, Inputs, Badges, Labels, Skeletons
│   ├── config/                # Design tokens e listas de comodidades
│   ├── lib/                   # Utilitários, sanitizadores e conexões Supabase
│   ├── schemas/               # Schemas de validação Zod
│   ├── services/              # Camada de consultas ao banco com fallback controlado
│   └── types/                 # Tipagem TypeScript estrita de domínio
├── supabase/
│   ├── migrations/            # Migrations organizadas e idempotentes
│   │   └── 0001_initial_schema.sql
│   └── seed.sql               # Seed de configuração inicial
├── tests/                     # Testes automatizados Vitest
├── .env.example               # Modelo de variáveis de ambiente
└── package.json
```

---

## 5. Como Configurar e Executar

### Pré-requisitos
- Node.js 18.17+ ou 20+
- Conta no [Supabase](https://supabase.com) (plano gratuito ou Pro)

### Passo 1: Clonar e instalar dependências
```bash
npm install
```

### Passo 2: Configurar variáveis de ambiente
Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```
Edite `.env.local` com suas credenciais do projeto Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-secreta-aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Passo 3: Executar a Migration no Supabase
1. Acesse o painel do Supabase no seu navegador.
2. Vá em **SQL Editor**.
3. Copie o conteúdo de `supabase/migrations/0001_initial_schema.sql` e execute o script.
   - O script cria todas as 7 tabelas (`profiles`, `properties`, `property_images`, `property_features`, `leads`, `site_settings`, `banners`).
   - Habilita RLS em todas as tabelas com políticas estritas.
   - Cria o bucket de armazenamento `property-images` no Supabase Storage.
4. (Opcional) Execute `supabase/seed.sql` para pré-configurar o banner do Hero e os textos institucionais padrão.

### Passo 4: Criar o Administrador Inicial
1. No painel do Supabase, acesse **Authentication → Users**.
2. Clique em **Add User → Create User** e cadastre o e-mail e senha do gestor (ex: `admin@imobiliaria.com.br`).
3. Copie o `User UID` gerado.
4. No **SQL Editor**, vincule o UID à tabela `profiles`:
```sql
INSERT INTO public.profiles (id, full_name, email, role, is_active)
VALUES (
  'SEU_USER_UID_AQUI',
  'Diretor Imobiliário',
  'admin@imobiliaria.com.br',
  'admin',
  true
);
```

### Passo 5: Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 6. Testes Automatizados e Build

Para executar a suíte de testes com Vitest:
```bash
npm test
```

Para verificar tipagem estrita do TypeScript sem compilação:
```bash
npm run typecheck
```

Para gerar a compilação otimizada de produção:
```bash
npm run build
```

---

## 7. Políticas de Segurança e Conformidade (LGPD)

1. **Row Level Security (RLS):**
   - Visitantes não autenticados somente podem consultar propriedades com `publication_status = 'publicado'` e `availability_status IN ('disponivel', 'reservado')`.
   - Propriedades com exclusão lógica (`deleted_at IS NOT NULL`) são automaticamente omitidas.
   - A tabela `leads` é 100% privada para leitura; visitantes só têm permissão para inserir solicitações com consentimento explícito.
2. **Proteção Antispam:**
   - Campo Honeypot silencioso em formulários públicos para descartar bots automatizados sem atrito para o usuário real.
   - Rate limiting em memória por hash de IP nos Server Actions.
3. **Privacidade de Endereço:**
   - Respeito à flag `hide_exact_address`: se ativada pelo gestor, ruas e números não são expostos na interface pública nem na API, apresentando apenas o mapa de referência do bairro.
4. **Armazenamento de Imagens Seguro:**
   - Validação MIME no cliente e no servidor.
   - Exclusão de arquivos físicos no bucket `property-images` ao desvincular ou excluir imóveis, impedindo arquivos órfãos.
