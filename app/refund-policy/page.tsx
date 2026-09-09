import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export default function RefundPolicy() {
  return <LegalPage title="Refund Policy">
    <p>Love Pattern Lab sells optional digital full reports for a one-time price of US$2.99.</p>
    <h2>Digital purchases</h2>
    <p>Because access to a digital report is provided immediately after successful payment, purchases are generally final once the report has been delivered.</p>
    <h2>When we will help</h2>
    <p>If you were charged more than once, did not receive access after a successful payment, or believe a charge was unauthorized, contact us promptly. We will investigate and provide a refund when appropriate or required by law.</p>
    <h2>Requesting help</h2>
    <p>Use our <Link href="/contact">Contact page</Link> and include the purchase date and Stripe receipt or payment reference. Do not send full card details.</p>
  </LegalPage>;
}
