# Animações da home — S&A Gestora Imobiliária

A home permanece em **Next.js + React + TypeScript**. GSAP/ScrollTrigger e Lenis rodam apenas no componente client `src/components/motion/home-scroll-motion.tsx`, sem alterar autenticação, Supabase ou painel admin.

## Instalação e verificação

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run dev
```

Se o projeto utiliza outro gerenciador de pacotes, atualize o lockfile correspondente antes de fazer deploy. **Os comandos acima ainda precisam ser executados em um ambiente com checkout do repositório.**

## Parâmetros

- Lenis: `duration: 1.05`; ajuste para controlar a suavidade da rolagem.
- Título do hero: `duration: 1.15`, `stagger: 0.14`, `ease: power3.out`.
- Parallax do hero: `yPercent: 15`, `scrub: 1`.
- Revelação das seções: `start: "top 88%"`, `duration: 0.85`.
- Texto sobre a região: `start: "top 82%"`, `end: "bottom 48%"`, `scrub: 1`.
- Galeria de categorias: pin apenas acima de 767px; distância calculada pelo overflow real.
- Zoom: `scale: 1.18` até `1` e `clipPath` de 8% até 0%.

## Responsividade e acessibilidade

Em telas de até 767px, a galeria horizontal usa overflow nativo e CSS scroll snap, sem pin. `prefers-reduced-motion` desativa Lenis e GSAP. O conteúdo permanece visível sem JavaScript; os estilos não escondem seções por padrão.

## Checklist manual

- [ ] Hero e buscador acessíveis em 375px, 768px e 1440px
- [ ] Rolagem vertical sem travamentos
- [ ] Galeria sem pin no mobile
- [ ] Navegação por teclado e foco visível
- [ ] Modo reduzir movimento
- [ ] Fotos carregadas e ScrollTrigger atualizado
- [ ] Links de compra, aluguel, imóveis e WhatsApp
- [ ] Cadastro/admin/Supabase intactos
- [ ] Lighthouse Performance acima de 90, se confirmado em medição

A integração com a logo SVG local é independente da camada de animação. Imagens ilustrativas não representam imóveis disponíveis.
