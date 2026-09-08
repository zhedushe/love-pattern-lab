import { LegalPage } from "@/components/legal-page";

export default function Terms() {
  return <LegalPage title="Terms of Service">
    <p>By using Love Pattern Lab, you agree to these terms. You must be legally able to enter into this agreement and use the service only for lawful purposes.</p>
    <h2>The service</h2>
    <p>We offer relationship and personality self-reflection quizzes, free basic results, and optional one-time digital full reports for US$2.99. Content is educational and for self-reflection and entertainment.</p>
    <h2>Payments</h2>
    <p>Payments are processed by Stripe. Prices are shown before checkout. You authorize the stated one-time charge when you complete payment.</p>
    <h2>Acceptable use</h2>
    <p>Do not misuse, disrupt, reverse engineer, or attempt unauthorized access to the service. Site content may not be reproduced or resold without permission.</p>
    <h2>Availability and liability</h2>
    <p>The service is provided as available without guarantees of uninterrupted operation. To the extent permitted by law, Love Pattern Lab is not liable for indirect or consequential losses arising from use of the service.</p>
    <h2>Questions</h2>
    <p>For terms or purchase questions, use our <a href="/contact">Contact page</a>.</p>
  </LegalPage>;
}
