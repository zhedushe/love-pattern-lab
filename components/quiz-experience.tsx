"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Language, Quiz } from "@/lib/quizzes";
import { getTier } from "@/lib/quizzes";

export function QuizExperience({
  quiz,
  initialLanguage,
  paymentCancelled
}: {
  quiz: Quiz;
  initialLanguage: Language;
  paymentCancelled: boolean;
}) {
  const [language, setLanguage] = useState(initialLanguage);
  const [answers, setAnswers] = useState<(number | null)[]>(quiz.questions.map(() => null));
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const complete = answers.every((answer) => answer !== null);
  const result = useMemo(() => {
    if (!complete) return null;
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
    return content[tier];
  }, [answers, complete, language]);
  const t = language === "es"
    ? { back: "Todos los tests", intro: "Responde según lo que suele ser cierto, no según lo que quisieras que fuera.", question: "Pregunta", of: "de", view: "Ver mi resultado", free: "Tu resultado gratuito", full: "Desbloquear informe completo", price: "US$2.99 · pago único", includes: ["Lectura detallada de tu patrón", "Puntos fuertes y áreas de atención", "Un experimento práctico", "Pregunta para conversar"], cancel: "El pago se canceló. Tu resultado sigue aquí.", error: "No pudimos iniciar el pago. Inténtalo de nuevo.", disclaimer: "Este test es para autorreflexión, educación y entretenimiento; no es un diagnóstico." }
    : { back: "All quizzes", intro: "Answer for what is usually true—not what you wish were true.", question: "Question", of: "of", view: "See my result", free: "Your free result", full: "Unlock full report", price: "US$2.99 · one-time", includes: ["A deeper reading of your pattern", "Strengths and watch-outs", "One practical experiment", "A conversation prompt"], cancel: "Payment was cancelled. Your result is still here.", error: "We couldn’t start checkout. Please try again.", disclaimer: "This quiz is for self-reflection, education, and entertainment—not diagnosis." };

  async function checkout() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizSlug: quiz.slug, answers, language })
      });
      const data = (await response.json()) as { url?: string; error?: string };
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
        {paymentCancelled && <div className="notice">{t.cancel}</div>}
        {!showResult ? (
          <div className="question-list">
            {quiz.questions.map((question, index) => (
              <fieldset key={question.en}>
                <legend><span>{t.question} {index + 1} {t.of} {quiz.questions.length}</span>{question[language]}</legend>
                <div className="scale-labels"><span>{quiz.scale.low[language]}</span><span>{quiz.scale.high[language]}</span></div>
                <div className="scale-options">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value} className={answers[index] === value ? "selected" : ""}>
                      <input type="radio" name={`question-${index}`} value={value} checked={answers[index] === value} onChange={() => setAnswers((current) => current.map((answer, i) => i === index ? value : answer))} />
                      {value}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <button className="button primary wide" disabled={!complete} onClick={() => { setShowResult(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{t.view} →</button>
          </div>
        ) : (
          <div className="result-grid">
            <section className="free-result">
              <p className="kicker">{t.free}</p>
              <div className="result-mark">◒</div>
              <h2>{result?.[0]}</h2>
              <p>{result?.[1]}</p>
              <button className="text-button" onClick={() => setShowResult(false)}>← {language === "es" ? "Revisar respuestas" : "Review answers"}</button>
            </section>
            <aside className="unlock-card">
              <span className="lock">✦</span>
              <h2>{t.full}</h2>
              <p className="price">{t.price}</p>
              <ul>{t.includes.map((item) => <li key={item}>✓ <span>{item}</span></li>)}</ul>
              <button className="button dark wide" disabled={loading} onClick={checkout}>{loading ? "…" : `${t.full} →`}</button>
              {error && <p className="error" role="alert">{error}</p>}
              <small>{t.disclaimer}</small>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
