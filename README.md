# Stockholmsbytarn

> Byt hyresrätt i Stockholm — tryggt och gratis

## Stack

- **Next.js 14** App Router + TypeScript
- **Tailwind CSS** med anpassat designsystem
- **Supabase** – Postgres, Auth (magic link), Storage
- **react-hot-toast** – notifieringar
- **react-dropzone** – bilduppladdning

## Komma igång

### 1. Klona och installera

```bash
cd stockholmsbytarn
npm install
```

### 2. Skapa Supabase-projekt

1. Gå till [app.supabase.com](https://app.supabase.com) och skapa ett nytt projekt
2. Kopiera **Project URL** och **anon public key** under Settings → API

### 3. Konfigurera miljövariabler

```bash
cp .env.local.example .env.local
```

Fyll i dina Supabase-uppgifter i `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4. Kör databasschemat

1. Öppna Supabase Dashboard → SQL Editor
2. Klistra in innehållet från `schema.sql`
3. Klicka **Run**

### 5. Konfigurera Auth

I Supabase Dashboard → Authentication → URL Configuration:

- **Site URL**: `http://localhost:3000` (prod: din domän)
- **Redirect URLs**: `http://localhost:3000/auth/callback`

### 6. Starta dev-servern

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000)

---

## Projektstruktur

```
src/
├── app/
│   ├── layout.tsx              # Root layout med Navbar/Footer
│   ├── page.tsx                # Startsida med hero + senaste annonser
│   ├── not-found.tsx           # 404-sida
│   ├── globals.css             # Global CSS + Tailwind
│   ├── annonser/
│   │   ├── page.tsx            # Annonslista med sökfilter
│   │   └── [id]/
│   │       ├── page.tsx        # Annonsdetaljsida
│   │       └── ContactButton.tsx
│   ├── lagg-upp/
│   │   └── page.tsx            # Formulär för ny annons
│   ├── logga-in/
│   │   └── page.tsx            # Magic link-inloggning
│   ├── mina-annonser/
│   │   └── page.tsx            # Hantera egna annonser
│   └── auth/callback/
│       └── route.ts            # Supabase auth callback
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ListingCard.tsx
│   ├── SearchFilters.tsx
│   └── ImageUpload.tsx
├── lib/
│   ├── types.ts                # TypeScript-typer
│   └── supabase/
│       ├── client.ts           # Browser-klient
│       └── server.ts           # Server-klient
└── middleware.ts               # Auth-skydd för skyddade rutter
```

## Driftsätta på Vercel

```bash
npx vercel
```

Lägg till miljövariablerna i Vercel Dashboard → Settings → Environment Variables.

Uppdatera sedan Supabase Redirect URLs med din Vercel-domän.
