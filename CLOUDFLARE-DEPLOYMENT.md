# Bisi Interiors — Cloudflare deployment notes

This is a Cloudflare-ready configuration draft for the existing Next.js App Router project. Keep the current Vercel deployment online until the Cloudflare preview passes all tests.

## 1. Install dependencies

From this project folder, run:

```bash
npm install
```

## 2. Configure environment variables

In Cloudflare Workers, open the `bisi-interiors` Worker settings and add these as environment variables/secrets:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `ADMIN_ACCESS_CODE` (store as a secret)
- `SUPABASE_SERVICE_ROLE_KEY` (store as a secret; server-side only)

Use the existing values from the private `.env.local` file. Do not upload `.env.local`, commit it, or paste secrets into chat. The `.env.local` file is intentionally not included in this ZIP.

## 3. Preview locally

```bash
npm run cf:preview
```

Test the storefront, `/admin`, admin login, product listing, add/delete product operations, and product image uploads. Use a test product first.

## 4. Deploy only after preview passes

```bash
npx wrangler login
npm run cf:deploy
```

This deploys to the Cloudflare account selected by `wrangler login`. Confirm the correct client-owned account before deploying.

## 5. Domain

Do not change DNS until the Cloudflare deployment passes all tests. Then add the client's existing domain under the Worker custom domains and follow Cloudflare's displayed DNS instructions. Keep Vercel available as a rollback until the new domain works.

## Important limitations

- This configuration has not been validated by a successful Cloudflare build in this environment; package installation timed out here. Treat it as a prepared draft, not proof of a successful deployment.
- OpenNext supports most App Router and Route Handler features, but compatibility should be confirmed by building and testing this exact app.
- Supabase remains the database and storage provider; switching app hosting does not migrate Supabase data.
- The admin access-code cookie is a basic gate. Before a real public launch, review authorization and rate limiting, and rotate any credentials that may have been exposed previously.
