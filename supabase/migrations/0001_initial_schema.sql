-- =============================================================================
-- MIGRATION 0001: SISTEMA IMOBILIÁRIO PREMIUM - SCHEMA INICIAL + RLS + STORAGE
-- =============================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- =============================================================================
-- 1. FUNÇÃO DE ATUALIZAÇÃO AUTOMÁTICA DE UPDATED_AT
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =============================================================================
-- 2. TABELA: profiles (Administradores autorizados)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Função auxiliar de segurança para RLS (SECURITY DEFINER com search_path fixo)
CREATE OR REPLACE FUNCTION public.is_authorized_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND is_active = TRUE
      AND role IN ('admin', 'editor')
  );
$$;

-- =============================================================================
-- 3. TABELA: properties (Imóveis)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  property_type TEXT NOT NULL CHECK (
    property_type IN (
      'apartamento',
      'casa',
      'condominio',
      'cobertura',
      'terreno',
      'comercial',
      'alto_padrao'
    )
  ),
  purpose TEXT NOT NULL CHECK (purpose IN ('venda', 'aluguel', 'ambos')),
  description TEXT NOT NULL,
  short_description TEXT,

  -- Localização
  zip_code TEXT,
  state TEXT NOT NULL DEFAULT 'SP',
  city TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  street TEXT,
  street_number TEXT,
  complement TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  hide_exact_address BOOLEAN NOT NULL DEFAULT TRUE,

  -- Valores comerciais
  sale_price NUMERIC(14, 2) CHECK (sale_price IS NULL OR sale_price >= 0),
  rent_price NUMERIC(14, 2) CHECK (rent_price IS NULL OR rent_price >= 0),
  condo_fee NUMERIC(12, 2) CHECK (condo_fee IS NULL OR condo_fee >= 0),
  iptu_price NUMERIC(12, 2) CHECK (iptu_price IS NULL OR iptu_price >= 0),
  iptu_periodicity TEXT NOT NULL DEFAULT 'mensal' CHECK (iptu_periodicity IN ('mensal', 'anual', 'isento')),
  other_fees NUMERIC(12, 2) CHECK (other_fees IS NULL OR other_fees >= 0),
  other_fees_description TEXT,

  -- Características físicas
  usable_area NUMERIC(10, 2) CHECK (usable_area IS NULL OR usable_area >= 0),
  built_area NUMERIC(10, 2) CHECK (built_area IS NULL OR built_area >= 0),
  total_area NUMERIC(10, 2) CHECK (total_area IS NULL OR total_area >= 0),
  bedrooms INTEGER NOT NULL DEFAULT 0 CHECK (bedrooms >= 0),
  suites INTEGER NOT NULL DEFAULT 0 CHECK (suites >= 0),
  bathrooms INTEGER NOT NULL DEFAULT 0 CHECK (bathrooms >= 0),
  parking_spots INTEGER NOT NULL DEFAULT 0 CHECK (parking_spots >= 0),
  floor_number INTEGER,
  is_furnished BOOLEAN NOT NULL DEFAULT FALSE,
  is_pet_friendly BOOLEAN NOT NULL DEFAULT FALSE,
  is_high_end BOOLEAN NOT NULL DEFAULT FALSE,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  highlights TEXT[] NOT NULL DEFAULT '{}',

  -- Controle comercial e editorial
  availability_status TEXT NOT NULL DEFAULT 'disponivel' CHECK (
    availability_status IN ('disponivel', 'reservado', 'vendido', 'alugado', 'inativo')
  ),
  publication_status TEXT NOT NULL DEFAULT 'rascunho' CHECK (
    publication_status IN ('rascunho', 'publicado', 'arquivado')
  ),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  views_count INTEGER NOT NULL DEFAULT 0,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Soft delete e auditoria
  deleted_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Índices estratégicos para os filtros públicos e administrativos
CREATE INDEX IF NOT EXISTS idx_properties_public_lookup
  ON public.properties (publication_status, availability_status, deleted_at);
CREATE INDEX IF NOT EXISTS idx_properties_purpose
  ON public.properties (purpose);
CREATE INDEX IF NOT EXISTS idx_properties_type
  ON public.properties (property_type);
CREATE INDEX IF NOT EXISTS idx_properties_location
  ON public.properties (state, city, neighborhood);
CREATE INDEX IF NOT EXISTS idx_properties_sale_price
  ON public.properties (sale_price) WHERE sale_price IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_properties_rent_price
  ON public.properties (rent_price) WHERE rent_price IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_properties_usable_area
  ON public.properties (usable_area) WHERE usable_area IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_properties_specs
  ON public.properties (bedrooms, suites, bathrooms, parking_spots);
CREATE INDEX IF NOT EXISTS idx_properties_featured
  ON public.properties (is_featured, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_amenities_gin
  ON public.properties USING GIN (amenities);

-- =============================================================================
-- 4. TABELA: property_images (Galeria de fotografias do imóvel)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  storage_path TEXT,
  url TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '',
  is_cover BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_property_images_property_order
  ON public.property_images (property_id, is_cover DESC, display_order ASC);

-- =============================================================================
-- 5. TABELA: property_features (Características e comodidades estruturadas)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.property_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'comodidade' CHECK (
    category IN ('comodidade', 'diferencial', 'seguranca', 'lazer')
  ),
  label TEXT NOT NULL,
  icon_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_property_features_property
  ON public.property_features (property_id, category);

-- =============================================================================
-- 6. TABELA: leads (Interessados e solicitações de atendimento / CRM)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  property_reference_code TEXT,
  property_title TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'formulario_imovel' CHECK (
    source IN (
      'formulario_imovel',
      'agendar_visita',
      'contato_geral',
      'anunciar_imovel',
      'whatsapp'
    )
  ),
  status TEXT NOT NULL DEFAULT 'novo' CHECK (
    status IN (
      'novo',
      'em_atendimento',
      'visita_agendada',
      'negociacao',
      'convertido',
      'encerrado'
    )
  ),
  internal_notes TEXT,
  consent_lgpd BOOLEAN NOT NULL DEFAULT TRUE,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_leads_status_created
  ON public.leads (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_property
  ON public.leads (property_id);

-- =============================================================================
-- 7. TABELA: site_settings (Configurações institucionais e de contato)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name TEXT NOT NULL DEFAULT 'Maison Aurum Private Realty',
  agency_slogan TEXT DEFAULT 'Curadoria imobiliária para viver e investir com excelência.',
  creci TEXT DEFAULT '',
  cnpj TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address_line TEXT DEFAULT '',
  city TEXT DEFAULT 'São Paulo',
  state TEXT DEFAULT 'SP',
  zip_code TEXT DEFAULT '',
  business_hours TEXT DEFAULT 'Segunda a Sexta, das 9h às 19h • Sábados com agendamento',
  about_title TEXT DEFAULT 'Curadoria arquitetônica e consultoria patrimonial sob medida',
  about_history TEXT DEFAULT 'Especializada na comercialização e locação de propriedades residenciais e comerciais de alto padrão, nossa atuação combina análise técnica, discrição e acompanhamento próximo em todas as etapas da jornada imobiliária.',
  about_positioning TEXT DEFAULT 'Selecionamos cada imóvel a partir de critérios rigorosos de localização, arquitetura, liquidez e qualidade construtiva, garantindo segurança jurídica e transparência.',
  about_differentials JSONB NOT NULL DEFAULT '[]'::jsonb,
  about_consulting TEXT DEFAULT 'Atendimento individualizado com especialistas em avaliação, estruturação contratual e negociação estratégica.',
  instagram_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  facebook_url TEXT DEFAULT '',
  privacy_policy_updated_at DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 8. TABELA: banners (Banners e destaques visuais administráveis)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  cta_label TEXT,
  cta_href TEXT,
  position TEXT NOT NULL DEFAULT 'hero' CHECK (
    position IN ('hero', 'home_destaque', 'institucional')
  ),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_banners_active_position
  ON public.banners (position, is_active, display_order ASC);

-- =============================================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Políticas: profiles
CREATE POLICY "Admins podem visualizar perfis"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_authorized_admin());

CREATE POLICY "Admins podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Políticas: properties
CREATE POLICY "Visitantes visualizam apenas imóveis publicados e disponíveis"
  ON public.properties FOR SELECT
  TO anon, authenticated
  USING (
    (
      publication_status = 'publicado'
      AND availability_status IN ('disponivel', 'reservado')
      AND deleted_at IS NULL
    )
    OR public.is_authorized_admin()
  );

CREATE POLICY "Admins gerenciam imóveis (INSERT)"
  ON public.properties FOR INSERT
  TO authenticated
  WITH CHECK (public.is_authorized_admin());

CREATE POLICY "Admins gerenciam imóveis (UPDATE)"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (public.is_authorized_admin())
  WITH CHECK (public.is_authorized_admin());

CREATE POLICY "Admins gerenciam imóveis (DELETE)"
  ON public.properties FOR DELETE
  TO authenticated
  USING (public.is_authorized_admin());

-- Políticas: property_images
CREATE POLICY "Visitantes visualizam imagens de imóveis públicos"
  ON public.property_images FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_images.property_id
        AND p.publication_status = 'publicado'
        AND p.availability_status IN ('disponivel', 'reservado')
        AND p.deleted_at IS NULL
    )
    OR public.is_authorized_admin()
  );

CREATE POLICY "Admins gerenciam imagens de imóveis"
  ON public.property_images FOR ALL
  TO authenticated
  USING (public.is_authorized_admin())
  WITH CHECK (public.is_authorized_admin());

-- Políticas: property_features
CREATE POLICY "Visitantes visualizam características de imóveis públicos"
  ON public.property_features FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_features.property_id
        AND p.publication_status = 'publicado'
        AND p.availability_status IN ('disponivel', 'reservado')
        AND p.deleted_at IS NULL
    )
    OR public.is_authorized_admin()
  );

CREATE POLICY "Admins gerenciam características de imóveis"
  ON public.property_features FOR ALL
  TO authenticated
  USING (public.is_authorized_admin())
  WITH CHECK (public.is_authorized_admin());

-- Políticas: leads (100% privados para leitura, inserção via endpoint seguro ou anon validado)
CREATE POLICY "Apenas administradores visualizam leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (public.is_authorized_admin());

CREATE POLICY "Visitantes podem registrar leads via formulário"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    consent_lgpd = TRUE
    AND char_length(trim(name)) >= 2
    AND char_length(trim(phone)) >= 8
    AND char_length(trim(message)) >= 3
  );

CREATE POLICY "Apenas administradores atualizam leads"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (public.is_authorized_admin())
  WITH CHECK (public.is_authorized_admin());

CREATE POLICY "Apenas administradores excluem leads"
  ON public.leads FOR DELETE
  TO authenticated
  USING (public.is_authorized_admin());

-- Políticas: site_settings
CREATE POLICY "Configurações públicas visíveis para todos"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Apenas administradores alteram configurações"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_authorized_admin())
  WITH CHECK (public.is_authorized_admin());

-- Políticas: banners
CREATE POLICY "Visitantes visualizam banners ativos"
  ON public.banners FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE OR public.is_authorized_admin());

CREATE POLICY "Apenas administradores gerenciam banners"
  ON public.banners FOR ALL
  TO authenticated
  USING (public.is_authorized_admin())
  WITH CHECK (public.is_authorized_admin());

-- =============================================================================
-- 10. STORAGE BUCKET PARA IMAGENS DOS IMÓVEIS
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  TRUE,
  10485760, -- 10MB por arquivo
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Leitura pública das imagens do bucket property-images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'property-images');

CREATE POLICY "Upload restrito a administradores no bucket property-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-images'
    AND public.is_authorized_admin()
  );

CREATE POLICY "Atualização restrita a administradores no bucket property-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND public.is_authorized_admin()
  )
  WITH CHECK (
    bucket_id = 'property-images'
    AND public.is_authorized_admin()
  );

CREATE POLICY "Exclusão restrita a administradores no bucket property-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND public.is_authorized_admin()
  );
