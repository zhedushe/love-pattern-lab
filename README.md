# Between Us

A small English/Spanish relationship self-reflection quiz MVP with three quizzes, a free basic result, and a **US$2.99 one-time Stripe Checkout** upgrade.

The content is educational, entertaining, and reflective. It is not medical care, psychological advice, or a diagnostic tool.

## What is implemented

- Three bilingual quizzes: Attachment Compass, Conflict Rhythm, and Connection Language
- Free result calculated in the browser
- Stripe-hosted Checkout Session for a one-time US$2.99 payment
- Server-only Stripe secret key
- Signed Stripe webhook verification using the untouched request body
- Paid entitlement stored only after the webhook reports a paid Checkout Session
- Success page that waits for the webhook before returning the full report
- Idempotent Checkout creation and idempotent order fulfillment
- A small file-backed order store for local development and a single persistent Node server

## 1. Install and configure

```bash
npm install
copy .env.example .env.local
```

Open `.env.local` and add newly rotated **test-mode** values:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Never paste these secrets into chat, screenshots, client code, or Git. `.env.local` and the local order data directory are ignored by Git.

The application intentionally rejects live secret keys while it is in MVP test mode.

## 2. Start the website

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 3. Forward Stripe webhooks locally

Install and authenticate the [Stripe CLI](https://docs.stripe.com/stripe-cli), then run this in a second terminal:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` value printed by `stripe listen` into `STRIPE_WEBHOOK_SECRET` in `.env.local`, then restart `npm run dev`. The CLI forwarding secret is different from a Dashboard webhook endpoint secret.

## 4. Test the complete flow

1. Complete any quiz and open the free result.
2. Select **Unlock full report**.
3. In Stripe Checkout use test card `4242 4242 4242 4242`, any future expiry, any three-digit CVC, and any postal code.
4. After the redirect, the page waits until the signed `checkout.session.completed` webhook marks the order as paid, then displays the report.
5. Confirm the payment appears under test payments in the Stripe Dashboard.

Useful checks:

```bash
npm run lint
npm test
npm run build
```

## Payment security model

The Checkout success URL is only navigation; it does not unlock anything. `/api/entitlement` returns a report only if the server-side order record was changed to `paid` by a Stripe event whose signature was verified with `STRIPE_WEBHOOK_SECRET`. The session ID is also matched to the internal order before fulfillment.

The local store writes to `.data/orders.json` using atomic file replacement. It is deliberately simple for a solo-founder MVP. Before deploying to a serverless or multi-instance host, replace `lib/order-store.ts` with a persistent transactional database (for example, managed Postgres) while keeping the same webhook-first state transition.

## Production checklist (after test mode works)

- Use a persistent database and create a unique constraint on the Stripe Checkout Session ID.
- Register the production webhook URL in Stripe and subscribe to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `checkout.session.async_payment_failed`.
- Store live secrets only in the hosting provider's encrypted environment settings.
- Replace the test-key guard only during a deliberate go-live change and run Stripe's go-live checklist.
- Review taxes, refund terms, privacy notice, customer support details, and digital-product disclosures for the countries served.
- Add retention/deletion rules for quiz answers; avoid collecting sensitive information that is not needed.

## Main integration files

- `app/api/checkout/route.ts` — creates the one-time Checkout Session
- `app/api/webhooks/stripe/route.ts` — verifies Stripe signatures and fulfills orders
- `app/api/entitlement/route.ts` — returns reports only for webhook-verified orders
- `lib/order-store.ts` — local MVP order persistence
- `lib/quizzes.ts` — bilingual quiz and report content
