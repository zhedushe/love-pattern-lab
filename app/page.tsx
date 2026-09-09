import Link from "next/link";
import { LanguageToggle } from "@/components/language-toggle";
import { getQuizPath, quizzes, type Language } from "@/lib/quizzes";

export default async function Home({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const params = await searchParams;
  const language: Language = params.lang === "es" ? "es" : "en";
  const t = language === "es"
    ? {
        nav: "Tres pausas para conocerte mejor",
        kicker: "AUTORREFLEXIÓN PARA RELACIONES REALES",
        titleA: "Entenderte cambia",
        titleB: "cómo conectas.",
        intro: "Cuestionarios breves y cuidados para reconocer tus patrones, poner palabras a tus necesidades y abrir conversaciones más honestas.",
        start: "Comenzar un test",
        free: "Resultado básico gratuito",
        paid: "Informe completo opcional · US$2.99",
        explore: "Explora los tests",
        time: "3–4 min",
        cta: "Hacer el test",
        note: "Contenido educativo y de entretenimiento. No ofrece diagnóstico médico ni psicológico."
      }
    : {
        nav: "Three pauses to know yourself better",
        kicker: "SELF-REFLECTION FOR REAL RELATIONSHIPS",
        titleA: "Understanding yourself",
        titleB: "changes how you connect.",
        intro: "Short, thoughtful quizzes to notice your patterns, put words to your needs, and begin more honest conversations.",
        start: "Start a quiz",
        free: "Free basic result",
        paid: "Optional full report · US$2.99",
        explore: "Explore the quizzes",
        time: "3–4 min",
        cta: "Take the quiz",
        note: "For education, entertainment, and self-reflection only. Not medical or psychological diagnosis."
      };

  return (
    <main>
      <nav className="nav wrap">
        <Link href={`/?lang=${language}`} className="brand">LOVE PATTERN <i>LAB</i></Link>
        <span className="nav-note">{t.nav}</span>
        <LanguageToggle language={language} />
      </nav>

      <section className="hero wrap">
        <div className="hero-orbit" aria-hidden="true"><span>↗</span></div>
        <p className="kicker">{t.kicker}</p>
        <h1>{t.titleA}<br /><em>{t.titleB}</em></h1>
        <p className="hero-copy">{t.intro}</p>
        <div className="hero-actions">
          <Link className="button primary" href={`#quizzes`}>{t.start} <span>↘</span></Link>
          <div className="price-note"><b>✓</b> {t.free}<br /><b>✓</b> {t.paid}</div>
        </div>
      </section>

      <section className="quiz-section" id="quizzes">
        <div className="wrap">
          <div className="section-heading"><h2>{t.explore}</h2><span>01 — 04</span></div>
          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <article className={`quiz-card ${quiz.accent}`} key={quiz.slug}>
                <div className="card-number">{quiz.number}</div>
                <div className="card-glyph" aria-hidden="true">{quiz.slug === "attachment-compass" ? "◒" : quiz.slug === "conflict-rhythm" ? "≋" : "✦"}</div>
                <h3>{quiz.title[language]}</h3>
                <p>{quiz.subtitle[language]}</p>
                <div className="card-footer">
                  <span>{quiz.estimatedTime?.[language] || t.time}</span>
                  <Link href={getQuizPath(quiz.slug, language)}>{quiz.startCta?.[language] || t.cta} →</Link>
                </div>
              </article>
            ))}
          </div>
          <p className="disclaimer">{t.note}</p>
          <footer className="site-footer">
            <span>© 2026 Love Pattern Lab</span>
            <div>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/refund-policy">Refund Policy</Link>
              <Link href="/disclaimer">Disclaimer</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
