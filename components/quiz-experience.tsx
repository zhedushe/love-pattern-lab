"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Language, Quiz } from "@/lib/quizzes";
import { buildFreeResult, getTier } from "@/lib/quizzes";
import { SuccessExperience } from "@/components/success-experience";

export function QuizExperience({
  quiz,
  initialLanguage,
  paymentStatus,
  resultId,
  sessionId
}: {
  quiz: Quiz;
  initialLanguage: Language;
  paymentStatus?: string;
  resultId?: string;
  sessionId?: string;
}) {
  const [language, setLanguage] = useState(initialLanguage);
  const [started, setStarted] = useState(!quiz.startCta);
  const [answers, setAnswers] = useState<(number | null)[]>(quiz.questions.map(() => null));
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const complete = answers.every((answer) => answer !== null);
  const result = useMemo(() => {
    if (!complete) return null;
    const pattern = buildFreeResult(quiz.slug, answers as number[], language);
    if (pattern) return { kind: "pattern" as const, ...pattern };
    const tier = getTier(answers as number[]);
    const content = language === "es"
      ? {
          growing: ["Un área de crecimiento", "Aquí puede haber una necesidad de más seguridad, claridad o práctica. Reconocer el patrón ya empieza a cambiarlo."],
          exploring: ["Un punto medio flexible", "Tienes recursos para conectar de forma sana, aunque el estrés o el contexto pueden hacer que cueste acceder a ellos."],
          grounded: ["Una fortaleza estable", "Tus respuestas reflejan una base sólida de autoconciencia, conexión y capacidad de reparar."]
        }
      : {
          growing: ["A growing edge", "This may be an area that needs more safety, clarity, or practice. Noticing the pattern is already the beginning of change."],
          exploring: ["A flexible middle", "You have access to healthy ways of connecting, though stress or context may make those skills harder to reach."],
          grounded: ["A grounded strength", "Your answers reflect a steady base of self-awareness, connection, and capacity for repair."]
        };
    return { kind: "tier" as const, content: content[tier] };
  }, [answers, complete, language, quiz.slug]);
  const t = language === "es"
    ? { back: "Todos los tests", intro: "Responde según lo que suele ser cierto, no según lo que quisieras que fuera.", question: "Pregunta", of: "de", view: "Ver mi resultado", free: "Tu resultado gratuito", looks: "Cómo puede verse", secondary: "Patrón secundario", full: "Desbloquea tu informe personalizado completo — US$2.99", price: "US$2.99 · pago único", includes: ["9 módulos personalizados", "Tu patrón principal y secundario", "Fortalezas y puntos ciegos", "Próximos pasos concretos"], cancel: "El pago se canceló. Tu resultado sigue aquí.", error: "No pudimos iniciar el pago. Inténtalo de nuevo.", disclaimer: "Este test es para autorreflexión, educación y entretenimiento; no es un diagnóstico." }
    : { back: "All quizzes", intro: "Answer for what is usually true—not what you wish were true.", question: "Question", of: "of", view: "See my result", free: "Your free result", looks: "What this may look like", secondary: "Secondary pattern", full: "Unlock your full personalized report — US$2.99", price: "US$2.99 · one-time", includes: ["9 personalized report modules", "Your primary and secondary patterns", "Strengths and blind spots", "Concrete next steps"], cancel: "Payment was cancelled. Your result is still here.", error: "We couldn’t start checkout. Please try again.", disclaimer: "This quiz is for self-reflection, education, and entertainment—not diagnosis." };

  if (paymentStatus === "success" && sessionId && resultId) {
    return <SuccessExperience sessionId={sessionId} resultId={resultId} initialLanguage={initialLanguage} />;
  }

  async function checkout() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizSlug: quiz.slug, answers, language })
      });
      const data = (await response.json()) as { url?: string; resultId?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error);
      window.location.assign(data.url);
    } catch {
      setError(t.error);
      setLoading(false);
    }
  }

  return (
    <main className="quiz-page">
      <nav className="nav wrap">
        <Link href={`/?lang=${language}`} className="brand">LOVE PATTERN <i>LAB</i></Link>
        <Link className="back-link" href={`/?lang=${language}`}>← {t.back}</Link>
        <div className="language-toggle"><button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button><span>·</span><button className={language === "es" ? "active" : ""} onClick={() => setLanguage("es")}>ES</button></div>
      </nav>
      <section className="quiz-shell wrap">
        <div className="quiz-intro"><span className="tiny-label">{quiz.number}</span><h1>{quiz.title[language]}</h1><p>{quiz.subtitle[language]}</p><small>{t.intro}</small></div>
        {paymentStatus === "cancelled" && <div className="notice">{t.cancel}</div>}
        {!started ? (
          <section className="quiz-start-card">
            <p>{quiz.meta?.[language]}</p>
            <button className="button primary" onClick={() => setStarted(true)}>{quiz.startCta?.[language]} →</button>
            <small>{quiz.disclaimer?.[language]}</small>
          </section>
        ) : !showResult ? (
          <div className="question-list">
            {quiz.questions.map((question, index) => (
              <fieldset key={question.en}>
                <legend><span>{t.question} {index + 1} {t.of} {quiz.questions.length}</span>{question[language]}</legend>
                <div className="scale-labels"><span>{quiz.scale.low[language]}</span><span>{quiz.scale.high[language]}</span></div>
                <div className="scale-options">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value} className={answers[index] === value ? "selected" : ""}>
                      <input type="radio" name={`question-${index}`} value={value} aria-label={quiz.scale.options?.[value - 1]?.[language] || String(value)} checked={answers[index] === value} onChange={() => setAnswers((current) => current.map((answer, i) => i === index ? value : answer))} />
                      {value}
                    </label>
                  ))}
                </div>
                {quiz.scale.options && <p className="scale-key">{quiz.scale.options.map((option, optionIndex) => `${optionIndex + 1} ${option[language]}`).join(" · ")}</p>}
              </fieldset>
            ))}
            <button className="button primary wide" disabled={!complete} onClick={() => { setShowResult(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{t.view} →</button>
          </div>
        ) : (
          <div className="result-grid">
            <section className="free-result">
              <p className="kicker">{t.free}</p>
              <div className="result-mark">◒</div>
              {result?.kind === "pattern" ? <>
                <h2>{result.label}</h2>
                <div className="free-copy">{result.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                <h3>{t.looks}</h3>
                <ul className="free-signs">{result.signs.map((sign) => <li key={sign}>{sign}</li>)}</ul>
                <p className="clarification">{result.clarification}</p>
                <p className="secondary-pattern"><b>{t.secondary}:</b> {result.secondaryLabel}</p>
              </> : <>
                <h2>{result?.content[0]}</h2>
                <p>{result?.content[1]}</p>
              </>}
              <button className="text-button" onClick={() => setShowResult(false)}>← {language === "es" ? "Revisar respuestas" : "Review answers"}</button>
            </section>
            <aside className="unlock-card">
              <span className="lock">✦</span>
              <h2>{t.full}</h2>
              <p className="price">{t.price}</p>
              <ul>{t.includes.map((item) => <li key={item}>✓ <span>{item}</span></li>)}</ul>
              <button className="button dark wide" disabled={loading} onClick={checkout}>{loading ? "…" : `${t.full} →`}</button>
              {error && <p className="error" role="alert">{error}</p>}
              <small>{quiz.disclaimer?.[language] || t.disclaimer}</small>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
