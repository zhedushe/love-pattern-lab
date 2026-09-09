import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export default function PrivacyPolicy() {
  return <LegalPage title="Privacy Policy">
    <p>Love Pattern Lab provides relationship and personality self-reflection quizzes. This policy explains the limited information used to operate the service.</p>
    <h2>Information we process</h2>
    <p>We process quiz answers to generate results. If you purchase a full report, Stripe processes your payment details and sends us transaction identifiers and payment status. We do not receive or store your full card number.</p>
    <h2>How information is used</h2>
    <p>Information is used to provide quiz results, fulfill purchases, prevent fraud, maintain the service, and comply with legal obligations. We do not sell personal information.</p>
    <h2>Service providers and retention</h2>
    <p>We use hosting and payment providers, including Vercel and Stripe, to operate the site. Information is retained only as reasonably necessary for service delivery, security, accounting, and legal compliance.</p>
    <h2>Your choices</h2>
    <p>You may stop using the service at any time. For privacy questions or requests, use our <Link href="/contact">Contact page</Link>.</p>
  </LegalPage>;
}
