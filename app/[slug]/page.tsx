import Link from "next/link";
import { notFound } from "next/navigation";

const pages: Record<string,{title:string;sections:[string,string][]}> = {
  "privacy-policy": { title:"Privacy Policy", sections:[
    ["Information we process","We process quiz answers to generate results. If you purchase a full report, Stripe processes payment details and sends us transaction identifiers and payment status. We do not receive or store your full card number."],
    ["How information is used","Information is used to provide results, fulfill purchases, prevent fraud, maintain the service, and comply with legal obligations. We do not sell personal information."],
    ["Service providers and retention","We use hosting and payment providers, including Vercel and Stripe. Information is retained only as reasonably necessary for service delivery, security, accounting, and legal compliance."],
    ["Your choices","You may stop using the service at any time. Contact details for purchase and privacy support are provided on our Contact page."]
  ]},
  "terms": { title:"Terms of Service", sections:[
    ["The service","Love Pattern Lab offers relationship and personality self-reflection quizzes, free basic results, and optional one-time digital full reports for US$2.99."],
    ["Payments","Payments are processed by Stripe. Prices are shown before checkout. You authorize the stated one-time charge when you complete payment."],
    ["Acceptable use","Do not misuse, disrupt, reverse engineer, or attempt unauthorized access to the service. Site content may not be reproduced or resold without permission."],
    ["Availability and liability","The service is provided as available. To the extent permitted by law, Love Pattern Lab is not liable for indirect or consequential losses arising from use of the service."]
  ]},
  "refund-policy": { title:"Refund Policy", sections:[
    ["Digital purchases","Because access to a US$2.99 digital report is provided immediately after successful payment, purchases are generally final once delivered."],
    ["When we will help","If you were charged more than once, did not receive access after successful payment, or believe a charge was unauthorized, contact us promptly. We will investigate and provide a refund when appropriate or required by law."],
    ["Requesting help","Use the merchant contact details shown on your Stripe receipt and include the purchase date and payment reference. Never send full card details."]
  ]},
  "disclaimer": { title:"Disclaimer", sections:[
    ["Not professional advice","Love Pattern Lab is for education, entertainment, and self-reflection only. It is not a medical or psychological diagnosis, assessment, treatment, or substitute for professional advice."],
    ["No guaranteed outcomes","Results are generalized reflections based on your answers. They are not definitive descriptions of you, your partner, or your relationship and do not guarantee any outcome."],
    ["Urgent support","If you are in crisis, feel unsafe, or may harm yourself or someone else, contact local emergency services or a qualified crisis-support provider immediately."]
  ]},
  "contact": { title:"Contact", sections:[
    ["Customer support","Support is available through the merchant contact details shown on your Stripe purchase receipt. Include the purchase date and payment reference. Never send a password or full card number."],
    ["Response time","We aim to respond to support requests within three business days."]
  ]}
};

export default async function InfoPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const page=pages[slug]; if(!page) notFound();
  return <main><nav className="nav wrap"><Link href="/" className="brand">LOVE PATTERN LAB</Link><Link href="/">← Home</Link></nav><article className="content wrap"><p className="kicker">LOVE PATTERN LAB</p><h1>{page.title}</h1><p>Effective September 8, 2026</p><p>Love Pattern Lab provides relationship and personality self-reflection quizzes.</p>{page.sections.map(([heading,body])=><section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}</article></main>;
}
