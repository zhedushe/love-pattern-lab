import type Stripe from "stripe";
import { getPatternResult, isValidAnswers, type Language, type PatternId } from "@/lib/quizzes";

export const CHECKOUT_PRICE_ID = "price_1UDbU8PCmPdZthdIfnAGd6s0";
export const CHECKOUT_AMOUNT = 299;
export const CHECKOUT_CURRENCY = "usd";

export type CheckoutMetadata = {
  resultId: string;
  quizType: string;
  answers: number[];
  language: Language;
  primaryPattern?: PatternId;
  secondaryPattern?: PatternId;
};

export function isResultId(value: string | null | undefined): value is string {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}

export function readCheckoutMetadata(session: Stripe.Checkout.Session): CheckoutMetadata | null {
  const resultId = session.metadata?.result_id;
  const quizType = session.metadata?.quiz_type;
  const language: Language = session.metadata?.language === "es" ? "es" : "en";
  if (!isResultId(resultId) || !quizType || session.client_reference_id !== resultId) return null;

  try {
    const answers = JSON.parse(session.metadata?.answers || "") as unknown;
    if (!isValidAnswers(quizType, answers)) return null;
    const patterns = getPatternResult(quizType, answers);
    if (patterns && (session.metadata?.primary_pattern !== patterns.primary || session.metadata?.secondary_pattern !== patterns.secondary)) return null;
    return { resultId, quizType, answers, language, ...(patterns ? { primaryPattern: patterns.primary, secondaryPattern: patterns.secondary } : {}) };
  } catch {
    return null;
  }
}

export function hasExpectedLineItem(session: Stripe.Checkout.Session) {
  const items = session.line_items?.data;
  return Boolean(
    items?.length === 1 &&
    items[0].quantity === 1 &&
    items[0].price?.id === CHECKOUT_PRICE_ID
  );
}

export function isPaidExpectedCheckout(session: Stripe.Checkout.Session) {
  return Boolean(
    session.mode === "payment" &&
    session.status === "complete" &&
    session.payment_status === "paid" &&
    session.amount_total === CHECKOUT_AMOUNT &&
    session.currency === CHECKOUT_CURRENCY &&
    readCheckoutMetadata(session) &&
    hasExpectedLineItem(session)
  );
}
