import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { markOrderFailed, markOrderPaid } from "@/lib/order-store";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function paymentIntentId(session: Stripe.Checkout.Session) {
  return typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
}

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

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      if (orderId && session.payment_status === "paid") {
        await markOrderPaid(orderId, session.id, paymentIntentId(session));
      }
    }
    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      if (orderId) await markOrderFailed(orderId, session.id);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
