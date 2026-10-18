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

## Romassistent (/studio) — AI-verktøy

Last opp et rombilde og få romanalyse, møbelforslag fra produktkatalogen, en Pinterest-pin og et bloggutkast — generert med Claude API.

**Tilgang.** `/studio` er en offentlig side som alle kan se, men analysen krever innlogget bruker
med aktivt abonnement — se «Kontoer og betaling» under. Uten Clerk-nøkler i miljøet oppfører
verktøyet seg som før: fullt brukbart i `npm run dev`, uten innlogging.

1. Lag `.env.local` med `ANTHROPIC_API_KEY=...` (nøkkel fra console.anthropic.com). Se `.env.example`.
2. `npm run dev` og åpne http://localhost:3000/studio
3. Last opp bilde → «Analyser rommet» → rediger teksten → «Lagre utkast i repoet»
4. Se over filene og commit:
   - `content/posts/<slug>.md` — blogginnlegget (med «Shop the look» når katalogprodukter er valgt)
   - `public/images/studio/<slug>.jpg` — coverbildet
   - `content/studio/pins/<slug>.json` — Pinterest-tekst å lime inn på Pinterest

**Produktkatalog:** `content/products.json`. Når et affiliate-program er godkjent, fyll inn `affiliateUrl` på produktene — den brukes da automatisk i stedet for `url`. Legg gjerne til flere produkter; Claude velger bare blant id-ene som finnes der.

### Publisere pinnen direkte til Pinterest

Studio kan publisere pinnen via Pinterest API v5 i stedet for at teksten kopieres manuelt.

1. Opprett en app på https://developers.pinterest.com/apps/ og registrer redirect-URI-en
   `http://localhost:3000/api/pinterest/callback` nøyaktig slik.
2. Legg `PINTEREST_APP_ID`, `PINTEREST_APP_SECRET` og `PINTEREST_REDIRECT_URI` i `.env.local`.
3. I studio: «Koble til Pinterest» → godkjenn → velg tavle → «Publiser pin».

Tokenet lagres i `.pinterest-token.<miljø>.json` i repo-roten (gitignorert) og fornyes
automatisk. `/api/pinterest/*` er forbeholdt eier-kontoen (`STUDIO_OWNER_EMAILS`), siden pinnene
publiseres til bloggens egen Pinterest-konto.

**Tilgangsnivåer.** En ny app starter på *Trial access*: pinnene blir kun synlige for deg selv
(sandbox), og appen er begrenset til ca. 1 000 kall per dag. For at pinnene skal bli offentlige
må appen oppgraderes til *Standard access*, og det krever en **videodemo som viser hele
OAuth-innloggingen** i den faktiske appen — den vanligste avslagsgrunnen er at videoen ikke viser
autentiseringsflyten. Flyten over er laget for å kunne skjermopptas direkte som den demoen.

**Sandbox vs. produksjon.** `PINTEREST_ENV=production` bruker `api.pinterest.com`; alt annet (og
standard) bruker `api-sandbox.pinterest.com`. Sandboxen har to egenskaper som er verdt å kjenne
til, begge verifisert mot API-et:

- `GET /v5/boards` returnerer **alltid** en tom liste der, også rett etter at en tavle er
  opprettet med 201 og gyldig id. Derfor lagres tavler du oppretter i
  `.pinterest-boards.<miljø>.json` (gitignorert), og tavlelista slår sammen API og cache.
- `POST /v5/boards` sjekker navnet mot den **ekte** kontoen din. Et navn du allerede bruker på
  pinterest.com avvises med kode 58 selv om tavla er usynlig i sandbox — da opprettes den med
  «(sandbox)» bak navnet i stedet. Navnet betyr ingenting der; ingen ser sandbox-tavler.

Sandbox-pinner finnes ikke på pinterest.com, så det vises ingen lenke til dem.

## Kontoer og betaling

Innlogging går via [Clerk](https://dashboard.clerk.com) og abonnement via
[Stripe](https://dashboard.stripe.com). Kortdata håndteres kun av Stripe — appen ser dem aldri.

Nøkler legges i `.env.local` (og i Vercel for produksjon); alle er dokumentert i `.env.example`:

| Variabel | Hva den gjør |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Slår på innlogging. Uten dem vises ingen innloggingsknapp, og studio er dev-only som før. |
| `STUDIO_OWNER_EMAILS` | Komma-separerte e-poster med full tilgang uten abonnement — inkludert Pinterest-publisering og lagring til repoet. |
| `STUDIO_MONTHLY_QUOTA` | Analyser per bruker per måned (standard 30). |
| `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET` | Abonnementet. Skru også på Customer Portal i Stripe-dashboardet. |
| `STRIPE_AUTOMATIC_TAX` | Sett til `1` først når Stripe Tax er aktivert. |

Abonnementsstatus og forbruk lagres i Clerk-brukerens `privateMetadata` — det finnes ingen egen
database. Stripe-webhooken (`/api/stripe/webhook`) er eneste skriver av abonnementsstatus; test
den lokalt med `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

Tilgangsnivåene er samlet i `src/lib/access.ts`:

- **Utlogget:** ser `/studio` og hva verktøyet gjør, kan ikke kjøre analyse.
- **Innlogget uten abonnement:** samme, men med «Start abonnement».
- **Abonnent:** kjører analyser innenfor kvoten, kopierer pin-tekst og bloggutkast.
- **Eier:** i tillegg Pinterest-publisering og lagring av utkast til repoet (kun lokalt — `save`
  skriver filer og er blokkert i produksjon).

Bloggen er åpen for alle uansett.
