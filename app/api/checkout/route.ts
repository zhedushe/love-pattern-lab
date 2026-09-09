import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { CHECKOUT_PRICE_ID } from "@/lib/checkout";
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
    const resultId = randomUUID();
    const origin = safeOrigin(request);
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        ui_mode: "hosted",
        locale: language,
        line_items: [
          {
            quantity: 1,
            price: CHECKOUT_PRICE_ID
          }
        ],
        client_reference_id: resultId,
        metadata: {
          result_id: resultId,
          quiz_type: quizSlug,
          answers: JSON.stringify(body.answers),
          language
        },
        success_url: `${origin}/quiz/${quizSlug}?lang=${language}&payment=success&result_id=${resultId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/quiz/${quizSlug}?lang=${language}&payment=cancelled&result_id=${resultId}`
      },
      { idempotencyKey: `checkout_${resultId}` }
    );

    if (!session.url) throw new Error("Stripe did not return a Checkout URL.");
    return NextResponse.json({ url: session.url, resultId });
  } catch (error) {
    console.error("Checkout creation failed", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
