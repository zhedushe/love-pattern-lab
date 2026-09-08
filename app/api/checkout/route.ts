import { NextResponse } from "next/server";
import { createOrder, attachStripeSession } from "@/lib/order-store";
import { getQuiz, isValidAnswers, type Language } from "@/lib/quizzes";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function safeOrigin(request: Request) {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return new URL(configured).origin;
  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      quizSlug?: string;
      answers?: unknown;
      language?: Language;
    };
    const quizSlug = body.quizSlug || "";
    const language: Language = body.language === "es" ? "es" : "en";
    const quiz = getQuiz(quizSlug);
    if (!quiz || !isValidAnswers(quizSlug, body.answers)) {
      return NextResponse.json({ error: "Invalid quiz submission." }, { status: 400 });
    }

    const stripe = getStripe();
    const order = await createOrder({ quizSlug, answers: body.answers, language });
    const origin = safeOrigin(request);
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        locale: language,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: 299,
              product_data: {
                name: language === "es" ? `Love Pattern Lab — Informe completo: ${quiz.title.es}` : `Love Pattern Lab — Full report: ${quiz.title.en}`,
                description:
                  language === "es"
                    ? "Informe digital personalizado de autorreflexión"
                    : "Personalized digital self-reflection report"
              }
            }
          }
        ],
        client_reference_id: order.id,
        metadata: { orderId: order.id, quizSlug },
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&lang=${language}`,
        cancel_url: `${origin}/quiz/${quizSlug}?lang=${language}&payment=cancelled`
      },
      { idempotencyKey: `checkout_${order.id}` }
    );

    if (!session.url) throw new Error("Stripe did not return a Checkout URL.");
    await attachStripeSession(order.id, session.id);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout creation failed", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
