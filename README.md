# Bisi Interiors — Next.js project

A fresh Next.js App Router project with a Bisi Interiors storefront and a starter admin product manager.

## Run in VS Code

1. Extract `Bisi-Interiors-NextJS.zip`.
2. Open the extracted `Bisi-Interiors-NextJS` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Visit `http://localhost:3000`.
6. Open the product manager at `http://localhost:3000/admin`.

## Admin dashboard (prototype)

The `/admin` dashboard currently lets you add and remove products in the browser. It stores the list in that browser's `localStorage`, so it is a front-end prototype only. The data is not shared across devices/users and is not secure. Before public launch, connect a database and add real admin authentication.

## Business setup before launch

- Replace the placeholder WhatsApp number `2349032959552` in `app/page.tsx` and `app/admin/AdminDashboard.tsx` with the business's real WhatsApp number.
- Add/replace product images in `public/images/`.
- The provided transparent barber chair image is included as `public/images/chair.png`.
- Confirm business contact details, prices, delivery information, and product descriptions.

## Design note

Category cards now include illustrative photos. They load from Unsplash, so an internet connection is required for those category images.
- The homepage hero follows the supplied screenshot's white background, oversized serif headline, muted gold accents, black enquiry button, product image on the right, and four-item trust strip. It aims to closely reproduce the reference, but is not guaranteed to be pixel-perfect without a live visual comparison.


## Admin access code

1. Create `.env.local` in the project root (beside `package.json`).
2. Add `ADMIN_ACCESS_CODE=your-own-private-code` and keep your existing Supabase environment variables in the same file.
3. Restart the dev server after changing environment variables.
4. Visit `/admin` and enter the code. The server sets an HTTP-only cookie for up to 8 hours.

This is a basic access-code gate for the prototype, not a replacement for a full authenticated admin system. Before production, use Supabase Auth and enforce authorization in every server/database operation. Product edits are still local-browser-only until the database integration is implemented.


## Product listing behaviour
- Product listings are intended to show the product image and product name only, with an Enquire on WhatsApp action.
- WhatsApp contact number: +234 903 295 9952 (international link format: 2349032959952).


## Supabase product catalogue setup

1. In Supabase SQL Editor, run `supabase-setup.sql`.
2. Install dependencies with `npm install` (includes `@supabase/supabase-js`).
3. In project-root `.env.local`, set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `ADMIN_ACCESS_CODE`, and `SUPABASE_SERVICE_ROLE_KEY`. Get the service-role/secret key from Supabase project settings and keep it server-only; never prefix it with `NEXT_PUBLIC_` or share it publicly.
4. Restart Next.js after changing environment variables.

The storefront reads available products from Supabase. Admin add/delete operations use server routes guarded by the admin-code cookie and the server-only service role key; image files are uploaded to the `product-images` Storage bucket. Product cards show the image, product name, and WhatsApp enquiry action only. WhatsApp number: +234 903 295 9952.

Security note: the code gate is a basic private admin gate. For a public production launch, replace it with Supabase Auth / proper user authorization and review server security. Never expose the service-role key.


## Product prices

The admin dashboard's **Add product** form requires a product price in Nigerian naira. The price is stored in `public.products.price` and displayed on the storefront. If your existing products table predates this column, run `supabase-setup.sql` in the Supabase SQL Editor.

## Environment variables

For security, `.env.local` is not included in the ZIP. Copy `.env.example` to `.env.local`, then fill in the Supabase project URL, publishable key, your admin access code, and your server-only Supabase secret key. Never commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.
