import { NextResponse } from "next/server";
import { findOrderBySession, markOrderPaid } from "@/lib/order-store";
import { buildResult } from "@/lib/quizzes";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function paymentIntentId(paymentIntent: string | { id: string } | null) {
  if (!paymentIntent) return undefined;
  return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id;
}

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_test_")) {
    return NextResponse.json({ error: "Invalid checkout session." }, { status: 400 });
  }

  const order = await findOrderBySession(sessionId);
  if (!order) return NextResponse.json({ status: "not_found" }, { status: 404 });

  if (order.status === "pending") {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      const securelyVerified =
        session.payment_status === "paid" &&
        session.status === "complete" &&
        session.mode === "payment" &&
        session.amount_total === 299 &&
        session.currency === "usd" &&
        session.client_reference_id === order.id &&
        session.metadata?.orderId === order.id &&
        session.metadata?.quizSlug === order.quizSlug;

      if (securelyVerified) {
        await markOrderPaid(order.id, session.id, paymentIntentId(session.payment_intent));
        order.status = "paid";
      }
    } catch (error) {
      console.warn(
        "Checkout verification is still pending",
        error instanceof Error ? error.message : "Unknown Stripe error"
      );
    }
  }

  if (order.status !== "paid") return NextResponse.json({ status: order.status });

  return NextResponse.json({
    status: "paid",
    report: buildResult(order.quizSlug, order.answers, order.language),
    language: order.language
  });
}
