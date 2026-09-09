import "server-only";
import Stripe from "stripe";

let client: Stripe | undefined;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (
  !key ||
  (!key.startsWith("sk_test_") && !key.startsWith("sk_live_"))
) {
  throw new Error("Invalid STRIPE_SECRET_KEY.");
}
  client ??= new Stripe(key, { apiVersion: "2026-08-26.dahlia" });
  return client;
}
