import { NextResponse } from "next/server";
import { isPaidExpectedCheckout, isResultId, readCheckoutMetadata } from "@/lib/checkout";
import { buildResult } from "@/lib/quizzes";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  const sessionId = query.get("session_id");
  const resultId = query.get("result_id");
if (
  !sessionId ||
  (!sessionId.startsWith("cs_test_") && !sessionId.startsWith("cs_live_")) ||
  !isResultId(resultId)
) {
  return NextResponse.json({ error: "Invalid checkout session." }, { status: 400 });
}

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"]
    });
    const metadata = readCheckoutMetadata(session);
    const webhookVerified = session.metadata?.webhook_verified?.startsWith("evt_");
    if (!metadata || metadata.resultId !== resultId || !webhookVerified || !isPaidExpectedCheckout(session)) {
      return NextResponse.json({ status: "pending" });
    }

    return NextResponse.json({
      status: "paid",
      report: buildResult(metadata.quizType, metadata.answers, metadata.language),
      language: metadata.language
    });
  } catch (error) {
    console.warn("Entitlement lookup failed", error instanceof Error ? error.message : "Unknown Stripe error");
    return NextResponse.json({ status: "pending" });
  }
}
