import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { isPaidExpectedCheckout } from "@/lib/checkout";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret || !secret.startsWith("whsec_")) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (error) {
    console.error("Webhook signature verification failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.livemode) {
    return NextResponse.json({ error: "Live-mode events are disabled." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const eventSession = event.data.object;
      const session = await getStripe().checkout.sessions.retrieve(eventSession.id, {
        expand: ["line_items"]
      });
      if (isPaidExpectedCheckout(session)) {
        await getStripe().checkout.sessions.update(session.id, {
          metadata: {
            ...session.metadata,
            webhook_verified: event.id,
            webhook_verified_at: new Date(event.created * 1000).toISOString()
          }
        });
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
