import {
  buildPullAwayPaidResult,
  getPullAwayFreeResult,
  pullAwayQuiz,
  scorePullAway,
  type PatternId,
  type PatternScores,
  type PullAwayFreeResult
} from "./pull-away.ts";

export type Language = "en" | "es";
export type Localized = { en: string; es: string };
export type Quiz = {
  slug: string;
  accent: string;
  number: string;
  title: Localized;
  subtitle: Localized;
  questions: Localized[];
  scale: { low: Localized; high: Localized; options?: Localized[] };
  meta?: Localized;
  startCta?: Localized;
  disclaimer?: Localized;
  estimatedTime?: Localized;
  resultMode?: "tier" | "pattern";
};

export type ReportSection = { heading: string; body: string };

export const quizzes: Quiz[] = [
  {
    slug: "attachment-compass",
    accent: "coral",
    number: "01",
    title: { en: "Attachment Compass", es: "Brújula del apego" },
    subtitle: {
      en: "Notice how you seek closeness, safety, and space in relationships.",
      es: "Observa cómo buscas cercanía, seguridad y espacio en tus relaciones."
    },
    scale: {
      low: { en: "Not like me", es: "No me describe" },
      high: { en: "Very like me", es: "Me describe mucho" }
    },
    questions: [
      { en: "I can ask for reassurance without feeling ashamed.", es: "Puedo pedir tranquilidad sin sentir vergüenza." },
      { en: "I stay grounded when someone I care about needs space.", es: "Mantengo la calma cuando alguien que quiero necesita espacio." },
      { en: "I can name my needs before resentment builds.", es: "Puedo expresar mis necesidades antes de acumular resentimiento." },
      { en: "Closeness feels safe without costing me my independence.", es: "La cercanía se siente segura sin costarme mi independencia." },
      { en: "After tension, I trust that connection can be repaired.", es: "Después de una tensión, confío en que la conexión puede repararse." }
    ]
  },
  {
    slug: "conflict-rhythm",
    accent: "blue",
    number: "02",
    title: { en: "Conflict Rhythm", es: "Ritmo del conflicto" },
    subtitle: {
      en: "Explore what happens inside you when conversations get difficult.",
      es: "Explora qué ocurre dentro de ti cuando las conversaciones se complican."
    },
    scale: {
      low: { en: "Rarely", es: "Casi nunca" },
      high: { en: "Almost always", es: "Casi siempre" }
    },
    questions: [
      { en: "I can pause a heated conversation without abandoning it.", es: "Puedo pausar una conversación intensa sin abandonarla." },
      { en: "I listen for the need beneath the other person's words.", es: "Escucho la necesidad que hay detrás de las palabras de la otra persona." },
      { en: "I can own my impact even when my intention was different.", es: "Puedo reconocer mi impacto aunque mi intención haya sido otra." },
      { en: "I return to unfinished conversations when I am calmer.", es: "Retomo las conversaciones pendientes cuando estoy más en calma." },
      { en: "I can disagree without treating the relationship as unsafe.", es: "Puedo discrepar sin sentir que la relación deja de ser segura." }
    ]
  },
  {
    slug: "connection-language",
    accent: "gold",
    number: "03",
    title: { en: "Connection Language", es: "Lenguaje de conexión" },
    subtitle: {
      en: "See which everyday signals help you feel seen and valued.",
      es: "Descubre qué señales cotidianas te ayudan a sentirte visto y valorado."
    },
    scale: {
      low: { en: "Less important", es: "Menos importante" },
      high: { en: "Very important", es: "Muy importante" }
    },
    questions: [
      { en: "Undistracted time together helps me feel connected.", es: "El tiempo juntos sin distracciones me ayuda a sentir conexión." },
      { en: "Specific words of appreciation stay with me.", es: "Las palabras concretas de aprecio permanecen conmigo." },
      { en: "Small practical acts make care feel real.", es: "Los pequeños gestos prácticos hacen que el cariño se sienta real." },
      { en: "Warm, welcome touch helps me settle.", es: "El contacto cálido y bienvenido me ayuda a relajarme." },
      { en: "Being remembered in small details matters to me.", es: "Que recuerden pequeños detalles sobre mí es importante." }
    ]
  },
  pullAwayQuiz
];

export function getQuiz(slug: string) {
  return quizzes.find((quiz) => quiz.slug === slug);
}

export function getQuizPath(slug: string, language: Language) {
  if (slug === "why-do-you-pull-away") {
    return language === "es" ? "/es/tests/por-que-te-alejas" : "/en/tests/why-do-you-pull-away";
  }
  return `/quiz/${slug}?lang=${language}`;
}

export function getTier(answers: number[]) {
  const average = answers.reduce((sum, value) => sum + value, 0) / answers.length;
  if (average < 2.7) return "growing" as const;
  if (average < 4) return "exploring" as const;
  return "grounded" as const;
}

const copy = {
  en: {
    growing: {
      label: "A growing edge",
      summary: "Your answers point to an area that may need more safety, clarity, or practice. Awareness is already a useful first step.",
      sections: [
        ["What your pattern may protect", "This response may help you avoid overwhelm, rejection, or disappointment. It is not a flaw; it is a strategy that may have outlived some of the situations that shaped it."],
        ["What to notice", "Watch for the moment your body speeds up, shuts down, or starts predicting the worst. Naming that moment creates a little space before the automatic response takes over."],
        ["A small experiment", "Choose one low-stakes moment this week. Name one feeling and one concrete request using: “I notice… I need… Would you be willing to…?”"],
        ["Conversation prompt", "Ask someone you trust: “What helps you feel safe enough to stay present when a conversation gets vulnerable?” Listen without trying to fix the answer."]
      ]
    },
    exploring: {
      label: "A flexible middle",
      summary: "You show access to healthy connection skills, while context and stress may still change how available they feel.",
      sections: [
        ["What is working", "You appear able to move toward openness in many situations. That flexibility is a strength, especially when you notice your limits early."],
        ["Where it gets harder", "Your pattern may become less flexible when stakes feel high, signals are ambiguous, or you are already depleted. Those conditions are useful data, not a verdict."],
        ["A small experiment", "Before an important conversation, rate your capacity from 1–10. If it is below 6, agree on a time to return rather than forcing resolution."],
        ["Conversation prompt", "Complete this sentence together: “When I am stressed, the most helpful sign that we are still a team is…”"]
      ]
    },
    grounded: {
      label: "A grounded strength",
      summary: "Your answers suggest a steady capacity for connection, self-awareness, and repair. The next step is keeping that strength available under pressure.",
      sections: [
        ["What is working", "You seem able to hold closeness and individuality at the same time. This creates room for honesty without making every difference feel threatening."],
        ["Your watch-out", "Strong skills can become invisible expectations. Remember that another person may need clearer reassurance, more time, or a different route back to connection."],
        ["A small experiment", "Offer one specific appreciation and one curious question this week. Make both about a recent, observable moment rather than a general trait."],
        ["Conversation prompt", "Ask: “What is one thing we already do well when we reconnect—and how can we make it easier to repeat?”"]
      ]
    }
  },
  es: {
    growing: {
      label: "Un área de crecimiento",
      summary: "Tus respuestas señalan un área que quizá necesite más seguridad, claridad o práctica. Ser consciente ya es un primer paso útil.",
      sections: [
        ["Lo que tu patrón puede proteger", "Esta respuesta puede ayudarte a evitar sentirte abrumado, rechazado o decepcionado. No es un defecto; es una estrategia que quizá ya no sea necesaria en todas las situaciones."],
        ["Qué observar", "Detecta el momento en que tu cuerpo se acelera, se bloquea o empieza a anticipar lo peor. Nombrarlo crea un pequeño espacio antes de la respuesta automática."],
        ["Un pequeño experimento", "Elige un momento de poca presión esta semana. Nombra una emoción y una petición concreta: “Noto… Necesito… ¿Estarías dispuesto/a a…?”"],
        ["Pregunta para conversar", "Pregunta a alguien de confianza: “¿Qué te ayuda a sentir suficiente seguridad para estar presente cuando una conversación se vuelve vulnerable?”"]
      ]
    },
    exploring: {
      label: "Un punto medio flexible",
      summary: "Tienes acceso a habilidades sanas de conexión, aunque el contexto y el estrés pueden cambiar cuán disponibles se sienten.",
      sections: [
        ["Lo que funciona", "Parece que puedes avanzar hacia la apertura en muchas situaciones. Esa flexibilidad es una fortaleza, sobre todo cuando reconoces pronto tus límites."],
        ["Dónde se complica", "Tu patrón puede volverse menos flexible cuando hay mucho en juego, las señales son ambiguas o ya estás agotado. Esas condiciones son información, no un veredicto."],
        ["Un pequeño experimento", "Antes de una conversación importante, valora tu capacidad del 1 al 10. Si está por debajo de 6, acuerda cuándo retomarla en vez de forzar una solución."],
        ["Pregunta para conversar", "Completen juntos: “Cuando estoy bajo estrés, la señal que más me ayuda a sentir que seguimos siendo un equipo es…”"]
      ]
    },
    grounded: {
      label: "Una fortaleza estable",
      summary: "Tus respuestas sugieren una capacidad estable de conexión, autoconciencia y reparación. El siguiente paso es conservarla bajo presión.",
      sections: [
        ["Lo que funciona", "Parece que puedes sostener la cercanía y la individualidad al mismo tiempo. Esto permite ser honesto sin que cada diferencia resulte amenazante."],
        ["Algo a vigilar", "Las habilidades sólidas pueden convertirse en expectativas invisibles. La otra persona quizá necesite más claridad, más tiempo u otra vía para reconectar."],
        ["Un pequeño experimento", "Ofrece esta semana un agradecimiento específico y una pregunta curiosa. Basa ambos en un momento reciente y observable."],
        ["Pregunta para conversar", "Pregunta: “¿Qué hacemos bien cuando reconectamos y cómo podemos facilitar que vuelva a ocurrir?”"]
      ]
    }
  }
} as const;

export function buildResult(slug: string, answers: number[], language: Language) {
  const quiz = getQuiz(slug);
  if (!quiz) throw new Error("Unknown quiz");
  if (quiz.resultMode === "pattern") return buildPullAwayPaidResult(answers, language);
  const tier = getTier(answers);
  const localized = copy[language][tier];
  return {
    quizTitle: quiz.title[language],
    tier,
    label: localized.label,
    summary: localized.summary,
    sections: localized.sections.map(([heading, body]) => ({ heading, body })) as ReportSection[]
  };
}

export function buildFreeResult(slug: string, answers: number[], language: Language): PullAwayFreeResult | null {
  const quiz = getQuiz(slug);
  if (!quiz || quiz.resultMode !== "pattern") return null;
  return getPullAwayFreeResult(answers, language);
}

export function getPatternResult(slug: string, answers: number[]): { primary: PatternId; secondary: PatternId; scores: PatternScores } | null {
  const quiz = getQuiz(slug);
  if (!quiz || quiz.resultMode !== "pattern") return null;
  return scorePullAway(answers);
}

export type { PatternId, PatternScores, PullAwayFreeResult } from "./pull-away.ts";

export function isValidAnswers(slug: string, value: unknown): value is number[] {
  const quiz = getQuiz(slug);
  return Boolean(
    quiz &&
      Array.isArray(value) &&
      value.length === quiz.questions.length &&
      value.every((answer) => Number.isInteger(answer) && answer >= 1 && answer <= 5)
  );
}
