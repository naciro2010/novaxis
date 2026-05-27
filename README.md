# Novaxium — Site one-page

L'axe nouveau de la finance augmentée. Comptabilité × Intelligence — Souveraineté marocaine.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS — palette dark néo-futurisme
- Framer Motion — animations et transitions
- React Three Fiber + Three.js — réseau de neurones (fond global)
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
  SiteBackground.tsx     # monte le réseau de neurones en fond fixe global
  NeuralScene.tsx        # réseau de neurones R3F (fond global)
  NetworkScene.tsx       # atome 3D du hero (monté sur desktop uniquement)
  Preloader.tsx
  Navbar.tsx
  Hero.tsx
  FusionSection.tsx
  VisionSection.tsx
  SolutionsSection.tsx   # + démo OCR (simulation)
  ProductSection.tsx     # maquette de tableau de bord + calculateur ROI
  PartnersSection.tsx
  SecuritySection.tsx
  ComparisonSection.tsx
  TeamSection.tsx
  StatsSection.tsx
  TrustSection.tsx
  PricingSection.tsx     # 3 paliers, sur devis
  CTASection.tsx         # formulaire -> /api/contact
  Footer.tsx
  SmoothScroll.tsx
  DecryptText.tsx
  Counter.tsx
  SectionHeader.tsx
  Logo.tsx
app/
  api/contact/route.ts   # réception des demandes de démo (webhook optionnel)
lib/
  i18n.tsx          # FR / EN / AR
  brand.ts          # source unique de l'identité de marque
  utils.ts
```

## Formulaire de contact

Les demandes de démo sont envoyées en `POST` vers `/api/contact`. Si la variable
d'environnement `CONTACT_WEBHOOK_URL` est définie (Make, Zapier, n8n, Slack…), la
demande y est relayée ; sinon le client bascule sur un lien `mailto:` afin de ne
perdre aucun lead.

## Personnalisation

- **Palette** : `tailwind.config.ts` → `theme.extend.colors`
- **Textes** : `lib/i18n.tsx`
- **Réseau de neurones** : `components/NeuralScene.tsx` (nombre de nœuds, distance des synapses, impulsions, couleurs)
- **Stack partenaires** : `components/PartnersSection.tsx` → tableau `PARTNERS`
