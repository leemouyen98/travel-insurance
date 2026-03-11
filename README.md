# Travel Insurance Intake

Static travel insurance application site for Henry Lee's Tokio Marine Explorer clients.

## Structure

- `index.html`: client-facing landing page and form shell
- `assets/app.css`: styles
- `assets/app.js`: quote logic, multi-step form flow, traveller generation, submit handling
- `functions/api/submit.ts`: Cloudflare Pages Function that forwards submissions to Resend
- `wrangler.toml`: Cloudflare Pages local/dev configuration
- `package.json`: local dev and typecheck scripts
- `.dev.vars.example`: local environment variable template

## What is implemented

- Single trip and annual quoting flow
- Domestic and international logic
- Area 1 / Area 2 / Area 3 brochure pricing
- Tokio-style traveller age bands
- Individual, family, and group policy rules
- 5% group discount logic
- Dynamic insured traveller cards based on traveller count
- Flight / itinerary details
- Nominee details
- Payment method selection and payment slip upload
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

- The site expects clients to upload a payment slip for DuitNow QR, Touch 'n Go, and bank transfer.
- The UI references Henry's payment details directly in the page.
- If you want to show the actual DuitNow QR image in the UI, add an image asset and place it into the payment content block in `index.html` or `assets/app.js`.
- Copy `.dev.vars.example` to `.dev.vars` for local development, but do not commit `.dev.vars`.
