# Travel Insurance Intake

Static Cloudflare Pages site for Henry Lee's Tokio Marine Explorer clients. The experience is built around a fast quote-first flow: compare plans, get the payable amount instantly, and submit details online.

## Structure

- `index.html`: the entire client-facing app — markup, styles, and quote/form logic all live inline in this one file. It is fully self-contained; nothing under `assets/` is loaded by the page.
- `assets/explorer.jpg`, `assets/Explorer.pdf`: hero image and the product brochure linked from the page.
- `functions/api/submit.ts`: Cloudflare Pages Function that forwards submissions to Resend (emails Henry only — clients get no confirmation email, only the in-page summary and success screen).
- `wrangler.toml`: Cloudflare Pages local/dev configuration.
- `package.json`: local dev and typecheck scripts.
- `.dev.vars.example`: local environment variable template.

## What is implemented

- Premium landing page with plan showcase and preselection
- Single trip and annual quoting flow
- Direct Domestic / Area 1 / Area 2 / Area 3 coverage-area selection (client picks the area directly — no destination lookup)
- Explorer brochure pricing
- Individual, family (including children), and group policy rules
- 5% group discount logic
- 180-day maximum trip length enforced on the date pickers
- Dynamic insured traveller cards based on traveller count, including children under a Family plan
- Optional flight, bank, and nominee sections
- Application, health/eligibility, and PDPA consent declarations required before submission
- Payment method selection (DuitNow QR, Touch 'n Go, Bank Transfer) with payment slip upload — no card/Billplz payment
- Post-submission success screen with the Tokio Marine Travel Assistance emergency hotline and a reminder to keep claim documents
- Resend email delivery through a Cloudflare Pages Function

## Environment variables

Set these in Cloudflare Pages:

- `RESEND_API_KEY`
- `NOTIFICATION_EMAIL`
- `FROM_EMAIL`

Example:

- `NOTIFICATION_EMAIL=you@yourdomain.com`
- `FROM_EMAIL=Travel Insurance <noreply@yourdomain.com>`

`FROM_EMAIL` must use a sender domain verified in Resend.

## Deploy

1. Push this repo to GitHub.
2. Create a Cloudflare Pages project from the repo.
3. Framework preset: `None`
4. Build command: leave empty
5. Build output directory: `.`
6. Root directory: leave empty
7. Add the environment variables above.
8. Redeploy.

## Local preview

Install dependencies first:

```bash
npm install
```

For full local Pages emulation:

```bash
cp .dev.vars.example .dev.vars
npm run dev
```

Wrangler will serve the static site and the `functions/` endpoint together.

If you only want the frontend, any static server also works:

```bash
python3 -m http.server 8788
```

Then open [http://localhost:8788](http://localhost:8788).

For function typechecking:

```bash
npm run check
```

## Notes

- The live flow is a 4-step intake: `Trip`, `Plan`, `Details`, and `Pay`.
- Everything — HTML, CSS, and JS — lives inline in `index.html`. There is no separate `app.js`/`app.css`/`i18n.js` build; if you're editing behavior or styling, edit `index.html` directly.
- `functions/api/submit.ts` handles the Resend email delivery from Cloudflare Pages Functions.
- Copy `.dev.vars.example` to `.dev.vars` for local development, but do not commit `.dev.vars`.
