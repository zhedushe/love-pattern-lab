import { notFound } from "next/navigation";
import { QuizExperience } from "@/components/quiz-experience";
import { getQuiz, type Language } from "@/lib/quizzes";

export default async function QuizPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string; payment?: string; result_id?: string; session_id?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const quiz = getQuiz(slug);
  if (!quiz) notFound();
  const language: Language = query.lang === "es" ? "es" : "en";
  return <QuizExperience
    quiz={quiz}
    initialLanguage={language}
    paymentStatus={query.payment}
    resultId={query.result_id}
    sessionId={query.session_id}
  />;
}
