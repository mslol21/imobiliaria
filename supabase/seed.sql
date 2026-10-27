-- =============================================================================
-- SEED OPCIONAL DE DESENVOLVIMENTO (NÃO EXECUTAR EM PRODUÇÃO SEM REVISÃO)
-- =============================================================================

INSERT INTO public.site_settings (
  agency_name,
  agency_slogan,
  creci,
  phone,
  whatsapp,
  email,
  address_line,
  city,
  state,
  zip_code,
  business_hours,
  about_title,
  about_history,
  about_positioning,
  about_differentials,
  about_consulting
)
VALUES (
  'Maison Aurum Imóveis',
  'Curadoria de propriedades singulares para viver e investir.',
  '', -- Configurar CRECI real no painel administrativo
  '', -- Configurar telefone real no painel administrativo
  '', -- Configurar WhatsApp real no painel administrativo
  '', -- Configurar e-mail real no painel administrativo
  '', -- Configurar endereço real no painel administrativo
  'São Paulo',
  'SP',
  '',
  'Segunda a Sexta, das 9h às 19h • Sábados mediante agendamento',
  'Arquitetura, patrimônio e atendimento sob medida',
  'A Maison Aurum atua na curadoria criteriosa de imóveis residenciais e corporativos, conectando clientes exigentes a propriedades com arquitetura autoral, localização consolidada e potencial de valorização.',
  'Trabalhamos com portfólio selecionado, visitas privativas e assessoria integral desde a prospecção até a assinatura e pós-fechamento.',
  '[
    {"title": "Curadoria Criteriosa", "description": "Avaliação técnica, arquitetônica e documental prévia de cada propriedade apresentada."},
    {"title": "Atendimento Privativo", "description": "Consultores dedicados com agenda flexível, sigilo absoluto e negociação transparente."},
    {"title": "Segurança Jurídica", "description": "Due diligence imobiliária completa para operações de compra, venda e locação de longo prazo."}
  ]'::jsonb,
  'Oferecemos consultoria completa para aquisição, locação corporativa e gestão de ativos imobiliários.'
)
ON CONFLICT DO NOTHING;

INSERT INTO public.banners (
  title,
  subtitle,
  image_url,
  cta_label,
  cta_href,
  position,
  display_order,
  is_active
)
VALUES (
  'Seu próximo capítulo começa no lugar certo.',
  'Encontre imóveis selecionados para viver, investir e transformar seus planos em realidade.',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85',
  'Explorar acervo',
  '/imoveis',
  'hero',
  1,
  TRUE
);
