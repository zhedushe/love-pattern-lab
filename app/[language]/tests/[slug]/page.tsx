import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { QuizExperience } from "@/components/quiz-experience";
import { getQuiz, type Language } from "@/lib/quizzes";

const localizedSlugs = {
  en: "why-do-you-pull-away",
  es: "por-que-te-alejas"
} as const;

export async function generateMetadata({ params }: { params: Promise<{ language: string; slug: string }> }): Promise<Metadata> {
  const { language } = await params;
  const isSpanish = language === "es";
  return {
    title: isSpanish ? "¿Por qué te alejas cuando alguien empieza a gustar de ti? | Love Pattern Lab" : "Why Do You Pull Away When Someone Likes You? | Love Pattern Lab",
    description: isSpanish
      ? "Test bilingüe de 25 preguntas sobre lo que ocurre cuando la atracción se convierte en cercanía emocional."
      : "A 25-question relationship pattern quiz about what happens when attraction turns into emotional closeness."
  };
}

export default async function LocalizedQuizPage({
  params,
  searchParams
}: {
  params: Promise<{ language: string; slug: string }>;
  searchParams: Promise<{ payment?: string; result_id?: string; session_id?: string }>;
}) {
  const { language: rawLanguage, slug } = await params;
  const query = await searchParams;
  if (rawLanguage !== "en" && rawLanguage !== "es") notFound();
  const language: Language = rawLanguage;
  if (slug !== localizedSlugs[language]) {
    const otherLanguage: Language = language === "en" ? "es" : "en";
    if (slug === localizedSlugs[otherLanguage]) redirect(`/${otherLanguage}/tests/${localizedSlugs[otherLanguage]}`);
    notFound();
  }
  const quiz = getQuiz("why-do-you-pull-away");
  if (!quiz) notFound();
  return <QuizExperience quiz={quiz} initialLanguage={language} paymentStatus={query.payment} resultId={query.result_id} sessionId={query.session_id} />;
}
