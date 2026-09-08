import "server-only";
import Stripe from "stripe";

let client: Stripe | undefined;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !key.startsWith("sk_test_")) {
    throw new Error("STRIPE_SECRET_KEY must be a rotated Stripe test-mode secret key.");
  }
  client ??= new Stripe(key, { apiVersion: "2026-08-26.dahlia" });
  return client;
}
