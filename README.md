This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Romassistent (/studio) — internt AI-verktøy

Last opp et rombilde og få romanalyse, møbelforslag fra produktkatalogen, en Pinterest-pin og et bloggutkast — generert med Claude API.

**Kjører kun lokalt.** I produksjon (Vercel) gir `/studio` og `/api/studio/*` 404, så API-nøkkelen kan ikke brukes av besøkende.

1. Lag `.env.local` med `ANTHROPIC_API_KEY=...` (nøkkel fra console.anthropic.com). Se `.env.example`.
2. `npm run dev` og åpne http://localhost:3000/studio
3. Last opp bilde → «Analyser rommet» → rediger teksten → «Lagre utkast i repoet»
4. Se over filene og commit:
   - `content/posts/<slug>.md` — blogginnlegget (med «Shop the look» når katalogprodukter er valgt)
   - `public/images/studio/<slug>.jpg` — coverbildet
   - `content/studio/pins/<slug>.json` — Pinterest-tekst å lime inn på Pinterest

**Produktkatalog:** `content/products.json`. Når et affiliate-program er godkjent, fyll inn `affiliateUrl` på produktene — den brukes da automatisk i stedet for `url`. Legg gjerne til flere produkter; Claude velger bare blant id-ene som finnes der.
