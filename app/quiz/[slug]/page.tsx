import Link from "next/link";
import { notFound } from "next/navigation";

const quizzes: Record<string,{title:string;intro:string;questions:string[]}> = {
  "attachment-compass": {title:"Attachment Compass",intro:"Notice how you seek closeness, reassurance, and space.",questions:["I can ask for reassurance directly when I need it.","I can stay connected without losing my independence.","After distance or tension, I trust that connection can be repaired."]},
  "conflict-rhythm": {title:"Conflict Rhythm",intro:"Explore what happens when tension enters a relationship.",questions:["I can name a concern without attacking or withdrawing.","I stay curious about the other person's experience.","I can pause and return to a difficult conversation."]},
  "love-language": {title:"Connection Signals",intro:"Reflect on the ways care feels most meaningful to you.",questions:["Thoughtful words help me feel seen.","Shared, undistracted time helps me feel close.","Practical support makes care feel tangible."]}
};

export default async function QuizPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const quiz=quizzes[slug]; if(!quiz) notFound();
  return <main><nav className="nav wrap"><Link href="/" className="brand">LOVE PATTERN LAB</Link><Link href="/">← All quizzes</Link></nav><article className="content wrap"><p className="kicker">RELATIONSHIP SELF-REFLECTION QUIZ</p><h1>{quiz.title}</h1><p className="lead">{quiz.intro}</p><div className="notice"><strong>Free basic result</strong><p>Reflect on each statement from 1 (rarely true) to 5 (usually true). Your pattern can change with context; there is no good or bad score.</p></div><ol>{quiz.questions.map(q=><li key={q}>{q}</li>)}</ol><div className="notice"><strong>Optional full report · US$2.99 one-time</strong><p>A deeper reading, strengths and watch-outs, a practical experiment, and a conversation prompt. Payments remain in Stripe Test Mode during validation.</p></div><p><strong>Important:</strong> This quiz is for education, entertainment, and self-reflection only. It is not a medical or psychological diagnosis.</p></article></main>;
}
