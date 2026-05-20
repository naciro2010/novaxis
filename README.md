# NOVAXIS — Site one-page

L'axe nouveau de la finance augmentée. Comptabilité × Intelligence — Souveraineté marocaine.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS — palette dark néo-futurisme
- Framer Motion — animations et transitions
- React Three Fiber + Three.js — réseau 3D du hero
- Lenis — smooth scroll
- Lucide — icônes
- i18n custom — FR / EN / AR (RTL)

## Démarrage

```bash
npm install
npm run dev
```

Le site est disponible sur `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Structure

```
app/
  layout.tsx        # Layout root + fonts + LocaleProvider
  page.tsx          # Assemblage des sections
  globals.css
components/
  Navbar.tsx
  Hero.tsx          # + NetworkScene.tsx (R3F)
  FusionSection.tsx
  VisionSection.tsx
  SolutionsSection.tsx   # + démo OCR live
  PartnersSection.tsx
  SecuritySection.tsx
  WhyNovaxisSection.tsx
  TeamSection.tsx
  StatsSection.tsx
  TrustSection.tsx
  CTASection.tsx
  Footer.tsx
  CustomCursor.tsx
  SmoothScroll.tsx
  DecryptText.tsx
  Counter.tsx
  SectionHeader.tsx
  Logo.tsx
lib/
  i18n.tsx          # FR / EN / AR
  utils.ts
```

## Personnalisation

- **Palette** : `tailwind.config.ts` → `theme.extend.colors`
- **Textes** : `lib/i18n.tsx`
- **3D hero** : `components/NetworkScene.tsx` (nombre de nœuds, distances, couleurs)
- **Stack partenaires** : `components/PartnersSection.tsx` → tableau `PARTNERS`
