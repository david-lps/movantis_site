# Movantis — Design Explorations (para colar no claude.ai/design)

Este arquivo é um "pacote" pronto para você testar direções alternativas de design no
**claude.ai/design** sem perder o conteúdo/estratégia que já consolidamos. Copie a parte
que precisar.

---

## 0. Como usar o claude.ai/design aqui

O claude.ai/design é ótimo para **divergir rápido** — gerar várias direções visuais em
conversa, iterar em paleta/tipografia/layout e ver mockups/protótipos — sem mexer no código
do site atual. O segredo para um resultado "10 estrelas" é alimentá-lo com um **brief forte +
conteúdo real** (abaixo), e pedir **direções divergentes**, não variações tímidas.

Fluxo sugerido:
1. Cole a **Seção 1 (brief)** + a **Seção 2 (conteúdo)**.
2. Peça as **6 direções da Seção 3**, uma de cada vez ("gere a direção Editorial/Swiss…").
3. Escolha 1–2 vencedoras e peça refino (hero → seções → mobile).
4. Traga a vencedora de volta pra mim e eu **implemento no site real** (o design vira código).

---

## 1. BRIEF (colar primeiro)

Você é um diretor de arte + engenheiro front-end de classe mundial (nível Stripe, Linear,
Vercel, Adyen). Vamos desenhar o site da **Movantis**.

**O que é a Movantis:** a marca corporativa por trás de uma **plataforma unificada de
infraestrutura financeira** que permite mover valor globalmente por uma única integração —
começando pela América Latina. Construída sobre TransNetwork + Spectrum + Inswitch + Appriza.

**Promessa (H1 oficial):** *Powering the global flow of value across high-variance markets.*
**Slogan:** *Move Value. Unlock Growth.*

**Marca:** laranja oficial `#FF7F39` (+ `#FF9A5E` claro, `#E8631C` escuro); base escura
`#0A0A0F`; acento ciano `#2DD4BF` = trilho digital/stablecoin. Fonte: **Inter**. Logo: wordmark
"MOVANTIS" com o "a" estilizado (branco sobre escuro).

**Tom:** institucional, regulado, confiável, "infraestrutura" — nada de cripto-gimmick.
Sales-led (CTA = "Contact Us / Scale your business"), não developer-first.

**Objetivo:** que um CFO de banco, um fundador de fintech e um tesoureiro de marketplace
entendam em 5s: *"esta é a camada de movimentação de valor para as Américas e além."*

**Meta de qualidade:** não "5 estrelas", mas **10 estrelas** — deve poder ficar ao lado da
home da Stripe/Adyen/Linear e parecer distintamente Movantis.

---

## 2. CONTEÚDO (colar junto do brief)

**Capacidades (5):** Cross-Border Money Transmission · Payments · FX & Liquidity ·
Issuing & Processing · Wallet Infrastructure. + **Stablecoin Settlement** (sub-seção).

**Números reais:** 130+ países · 80.000+ pontos de payout · 70+ MTOs · US$60B+ volume anual
cross-border.

**Indústrias (8):** Banks & FIs · Remittance & MTOs · Fintechs & Neobanks · Crypto Exchanges ·
Stablecoin Networks & Issuers · Marketplaces & Gig Economy · Enterprise · Global → LATAM.
(Cada uma: desafio → como a Movantis habilita → vantagem estratégica → 4 pilares
Growth/Ops/Liquidity/Risk.)

**Stablecoin — soluções (2 famílias):**
- *Corridor Infrastructure:* Off-Ramp/Last-Mile · Origination (OFI).
- *Wallet Spendability:* Wallet · QR Code (local spend) · Card Issuing (global).

**Cobertura:** EUA, México, Brasil, América Central, Colômbia, Região Andina, Worldwide —
com trilhos locais (SPEI, PIX, Bre-B), corredores cross-border, multi-moeda, licenças.

**Prova social:** parceiros/rails abstratos; selo "2026 Cross-Border Payments 100 / FXC
Intelligence"; LinkedIn.

**Legal:** GLBA Privacy Notice · Global Privacy Notice · disclaimer "serviços prestados por
entidades reguladas localmente ou parceiros autorizados".

---

## 3. AS 6 DIREÇÕES PARA TESTAR (peça uma de cada vez)

1. **Editorial / Swiss (Linear · Vercel)** — tipografia gigante, grid rígido, muito respiro,
   detalhes em mono, quase sem cor além do laranja pontual. Confiança pela contenção.
2. **Control Room / Data-Live** — telemetria viva: números que contam, mini-dashboards de
   corredores, mapa operacional. Vende escala e confiabilidade.
3. **Spatial / 3D-first** — o globo como protagonista full-bleed, cena 3D imersiva, câmera
   cinemática, corredores luminosos. Momento assinatura.
4. **Scrollytelling / Motion-first** — a jornada do dinheiro se movendo: pinning, transições
   de estado, o "antes fragmentado → depois unificado" como narrativa animada.
5. **Light Premium / Institutional** — modo claro, sério, bancário; display serifado de
   caráter; sensação de instituição regulada de peso.
6. **Bold Fintech / Color Blocks** — blocos de cor confiantes, laranja protagonista,
   tipografia forte; enérgico e memorável.

Para cada direção peça: hero, uma seção de capacidades, uma seção de indústrias e o mobile.

---

## 4. CHECKLIST "10 ESTRELAS" (o que separa bom de excepcional)

- **Momento assinatura** — uma coisa que ninguém mais tem (o globo de corredores é isso; dá
  pra elevar a cena, luz, profundidade).
- **Tipografia com craft** — escala intencional, tracking nos títulos, talvez licenciar um
  display face (GT, Söhne, Neue Haas) para o hero.
- **Coreografia de movimento** — não só fade-ins: orquestração, easing custom, pinning,
  transições de estado, número count-up, parallax sutil. Sempre honrando `reduced-motion`.
- **Microinterações** — magnetic buttons, cursor, hovers com física, foco visível, "draw-on"
  de ícones.
- **Ilustração / 3D custom** — diagramas isométricos de rails, corredores, topografia de rede.
- **Performance** — Lighthouse 95+, lazy-load do 3D, imagens otimizadas (AVIF/WebP), fontes
  com `font-display`.
- **Acessibilidade AA+** — contraste, navegação por teclado, reduced-motion (já temos base).
- **Design system coeso** — tokens, componentes, dark **e** light, estados definidos.
- **Copy afiada** — voz consistente; headlines que vendem o resultado, não a feature.
- **Credibilidade** — números reais, logos, selo, casos; regulado e Americas-native na cara.

---

## 5. Testável no claude.ai/design  ×  Feito na engenharia (aqui comigo)

| Testar no claude.ai/design | Implementar aqui (código no site real) |
|---|---|
| Direção de arte, paleta, tipografia | Globo 3D interativo (three.js/globe.gl) |
| Layout / composição das seções | Coreografia de scroll real, pinning, count-ups |
| Copy / hierarquia de mensagem | Performance (Lighthouse, lazy 3D, assets) |
| Mockups de hero e componentes | Acessibilidade, reduced-motion, responsivo real |
| Variações de tom (light vs dark) | Deploy contínuo (GitHub Pages, já integrado) |

**Regra:** o claude.ai/design decide *como deve parecer*; eu transformo a vencedora em site
real, versionado e publicado.
