# Travel Insurance Intake

Static Cloudflare Pages site for Henry Lee's Tokio Marine Explorer clients. The experience is built around a fast quote-first flow: compare plans, get the payable amount instantly, and submit details online.

## Structure

- `index.html`: client-facing landing page and form shell
- `assets/app.css`: styles
- `assets/app.js`: quote logic, multi-step form flow, traveller generation, submit handling
- `functions/api/submit.ts`: Cloudflare Pages Function that forwards submissions to Resend
- `wrangler.toml`: Cloudflare Pages local/dev configuration
- `package.json`: local dev and typecheck scripts
- `.dev.vars.example`: local environment variable template

## What is implemented

- Premium landing page with plan showcase and preselection
- Single trip and annual quoting flow
- Domestic / Area 1 / Area 2 / Area 3 travel area logic
- Explorer brochure pricing
- Individual, family, and group policy rules
- 5% group discount logic
- Dynamic insured traveller cards based on traveller count
- Optional flight, bank, and nominee sections
- Payment method selection with optional payment slip upload
- Resend email delivery through Cloudflare Pages Functions

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
3. Build command: none
4. Build output directory: `/`
5. Add the environment variables above.
6. Redeploy.

If you deploy from CLI instead:

```bash
npm install
npx wrangler pages deploy .
```

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

- The current live flow is a 3-step intake: `Travel Details`, `Choose Plan`, and `Confirm & Pay`.
- The top marketing plan cards sync directly into the in-form plan selection.
- `assets/app.js` contains the premium logic, validation, summary rendering, and submit payload.
- `functions/api/submit.ts` handles the Resend email delivery from Cloudflare Pages Functions.
- Copy `.dev.vars.example` to `.dev.vars` for local development, but do not commit `.dev.vars`.
