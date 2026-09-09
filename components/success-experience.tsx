"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Language, ReportSection } from "@/lib/quizzes";

type PaidReport = {
  quizTitle: string;
  label: string;
  summary: string;
  sections: ReportSection[];
};

export function SuccessExperience({
  sessionId,
  resultId,
  initialLanguage
}: {
  sessionId: string;
  resultId: string;
  initialLanguage: Language;
}) {
  const language = initialLanguage;
  const [state, setState] = useState<"waiting" | "paid" | "failed">(sessionId ? "waiting" : "failed");
  const [report, setReport] = useState<PaidReport | null>(null);
  const t = language === "es"
    ? { brand: "LOVE PATTERN LAB", waiting: "Confirmando tu pago…", waitCopy: "Stripe ha recibido el pago. Estamos esperando la confirmación segura del webhook antes de abrir el informe.", title: "Tu informe completo", paid: "Pago verificado", home: "Volver a todos los tests", failed: "Aún no podemos verificar este pago.", retry: "Reintentar", foot: "Guarda esta página si quieres volver a consultar el informe. Este contenido no es un diagnóstico médico ni psicológico." }
    : { brand: "LOVE PATTERN LAB", waiting: "Confirming your payment…", waitCopy: "Stripe has received the payment. We’re waiting for the secure webhook confirmation before opening your report.", title: "Your full report", paid: "Payment verified", home: "Back to all quizzes", failed: "We can’t verify this payment yet.", retry: "Try again", foot: "Save this page if you want to revisit your report. This content is not a medical or psychological diagnosis." };

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let attempts = 0;
    async function check() {
      attempts += 1;
      try {
        const response = await fetch(`/api/entitlement?session_id=${encodeURIComponent(sessionId)}&result_id=${encodeURIComponent(resultId)}`, { cache: "no-store" });
        const data = await response.json() as { status?: string; report?: PaidReport };
        if (data.status === "paid" && data.report) {
          if (!cancelled) { setReport(data.report); setState("paid"); }
          return;
        }
        if (data.status === "failed" || attempts >= 12) {
          if (!cancelled) setState("failed");
          return;
        }
      } catch {
        if (attempts >= 12 && !cancelled) { setState("failed"); return; }
      }
      if (!cancelled) window.setTimeout(check, 1500);
    }
    check();
    return () => { cancelled = true; };
  }, [resultId, sessionId]);

  if (state === "waiting") return (
    <main className="status-page"><div className="status-card"><div className="spinner" /><h1>{t.waiting}</h1><p>{t.waitCopy}</p></div></main>
  );
  if (state === "failed" || !report) return (
    <main className="status-page"><div className="status-card"><span className="status-icon">?</span><h1>{t.failed}</h1><p>{t.waitCopy}</p><button className="button dark" onClick={() => window.location.reload()}>{t.retry}</button></div></main>
  );

  return (
    <main className="report-page">
      <nav className="nav wrap"><Link href={`/?lang=${language}`} className="brand">LOVE PATTERN <i>LAB</i></Link><span className="verified">✓ {t.paid}</span></nav>
      <header className="report-header wrap"><p className="kicker">{report.quizTitle}</p><h1>{t.title}</h1><div className="report-label">{report.label}</div><p>{report.summary}</p></header>
      <section className="report-sections wrap">{report.sections.map((section, index) => <article key={section.heading}><span>0{index + 1}</span><div><h2>{section.heading}</h2><p>{section.body}</p></div></article>)}</section>
      <footer className="report-footer wrap"><p>{t.foot}</p><Link className="button primary" href={`/?lang=${language}`}>{t.home} →</Link></footer>
    </main>
  );
}
