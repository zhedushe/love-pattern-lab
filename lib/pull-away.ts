import type { Language, Localized, Quiz, ReportSection } from "./quizzes.ts";

export const PULL_AWAY_SLUG = "why-do-you-pull-away";

export type PatternId = "guarded" | "chase" | "overthinking" | "slow" | "secure";
export type PatternScores = Record<PatternId, number>;
export type PullAwayFreeResult = {
  primary: PatternId;
  secondary: PatternId;
  label: string;
  secondaryLabel: string;
  paragraphs: string[];
  signs: string[];
  clarification: string;
};

const q = (en: string, es: string): Localized => ({ en, es });

export const pullAwayQuiz: Quiz = {
  slug: PULL_AWAY_SLUG,
  accent: "rose",
  number: "04",
  resultMode: "pattern",
  title: q("Why Do You Pull Away When Someone Likes You?", "¿Por qué te alejas cuando alguien empieza a gustar de ti?"),
  subtitle: q(
    "Take this 2-minute relationship pattern quiz to discover what may happen when attraction turns into real emotional closeness.",
    "Haz este test de 2 minutos y descubre qué puede pasar cuando la atracción empieza a convertirse en cercanía emocional real."
  ),
  meta: q("25 questions · Free basic result · No signup required", "25 preguntas · Resultado básico gratis · Sin registro"),
  startCta: q("Start the free quiz", "Empezar el test gratis"),
  estimatedTime: q("2 min", "2 min"),
  disclaimer: q(
    "This quiz is designed for entertainment, education, and self-reflection. It is not a psychological assessment, medical diagnosis, or substitute for professional advice.",
    "Este test está diseñado con fines de entretenimiento, educación y autorreflexión. No constituye una evaluación psicológica, un diagnóstico médico ni sustituye el asesoramiento profesional."
  ),
  scale: {
    low: q("Strongly disagree", "Muy en desacuerdo"),
    high: q("Strongly agree", "Muy de acuerdo"),
    options: [
      q("Strongly disagree", "Muy en desacuerdo"),
      q("Disagree", "En desacuerdo"),
      q("Neutral", "Neutral"),
      q("Agree", "De acuerdo"),
      q("Strongly agree", "Muy de acuerdo")
    ]
  },
  questions: [
    q("When someone starts showing strong interest in me, I sometimes become less interested.", "Cuando alguien empieza a mostrar mucho interés en mí, a veces empiezo a perder interés."),
    q("I enjoy the uncertainty of not knowing whether someone likes me.", "Disfruto la incertidumbre de no saber si le gusto a alguien."),
    q("I sometimes miss someone more when they become distant.", "A veces extraño más a alguien cuando empieza a distanciarse."),
    q("When a relationship becomes serious, I start noticing more reasons it might not work.", "Cuando una relación empieza a ponerse seria, empiezo a notar más razones por las que podría no funcionar."),
    q("I feel slightly uncomfortable when someone becomes emotionally dependent on me.", "Me siento un poco incómodo/a cuando alguien empieza a depender emocionalmente de mí."),
    q("I need a lot of personal space, even when I really like someone.", "Necesito mucho espacio personal, incluso cuando alguien me gusta de verdad."),
    q("I have been very interested in someone until I realized they liked me back.", "Alguna vez he estado muy interesado/a en alguien hasta que me di cuenta de que también le gustaba."),
    q("I often question whether my feelings are ‘strong enough.’", "A menudo me pregunto si mis sentimientos son ‘lo suficientemente fuertes’."),
    q("I can become irritated by affection if it feels too intense.", "Puedo sentirme irritado/a por el afecto cuando se vuelve demasiado intenso."),
    q("I feel more attracted to people who are difficult to read.", "Me atraen más las personas difíciles de interpretar."),
    q("I sometimes confuse emotional intensity with romantic chemistry.", "A veces confundo la intensidad emocional con la química romántica."),
    q("When someone treats me consistently well, part of me wonders if something is missing.", "Cuando alguien me trata bien de manera constante, una parte de mí siente que quizá falta algo."),
    q("I need time before I feel comfortable being emotionally vulnerable.", "Necesito tiempo antes de sentirme cómodo/a siendo emocionalmente vulnerable."),
    q("I sometimes withdraw instead of explaining what I’m feeling.", "A veces me distancio en vez de explicar lo que siento."),
    q("Small imperfections in someone can suddenly become very noticeable once we get closer.", "Los pequeños defectos de alguien pueden volverse mucho más evidentes cuando empezamos a acercarnos."),
    q("I am comfortable telling someone that I genuinely like them.", "Me siento cómodo/a diciéndole a alguien que realmente me gusta."),
    q("I often replay conversations and look for signs that something is wrong.", "A menudo repaso conversaciones en mi cabeza buscando señales de que algo va mal."),
    q("Being wanted can sometimes feel more pressuring than flattering.", "A veces sentir que alguien me desea me genera más presión que ilusión."),
    q("I prefer relationships that develop gradually rather than very quickly.", "Prefiero las relaciones que se desarrollan poco a poco en lugar de avanzar muy rápido."),
    q("I am usually able to stay interested even after the excitement of the chase disappears.", "Normalmente puedo mantener el interés incluso después de que desaparece la emoción de la conquista."),
    q("I sometimes fantasize about unavailable people more than people who are actually available to me.", "A veces fantaseo más con personas emocionalmente inaccesibles que con quienes realmente están disponibles para mí."),
    q("When someone gets very close to me, I sometimes feel trapped.", "Cuando alguien se acerca mucho emocionalmente a mí, a veces me siento atrapado/a."),
    q("I can accept affection without immediately questioning the other person’s intentions.", "Puedo aceptar el afecto sin cuestionar inmediatamente las intenciones de la otra persona."),
    q("I sometimes pull away first because I don’t want to be the one who gets hurt.", "A veces me alejo primero porque no quiero ser yo quien termine herido/a."),
    q("A calm, predictable relationship generally feels good to me.", "Una relación tranquila y predecible normalmente me hace sentir bien.")
  ]
};

const patternOrder: PatternId[] = ["guarded", "chase", "overthinking", "slow", "secure"];
const direct: Record<Exclude<PatternId, "secure">, number[]> = {
  guarded: [5, 6, 9, 14, 18, 22, 24],
  chase: [1, 2, 3, 7, 10, 11, 12, 21],
  overthinking: [4, 8, 15, 17, 24],
  slow: [6, 13, 19]
};
const securityPositive = [16, 20, 23, 25];
const securityReverse = [1, 5, 9, 12, 14, 18, 22, 24];
const mean = (answers: number[], indexes: number[]) => indexes.reduce((sum, index) => sum + answers[index - 1], 0) / indexes.length;

export function scorePullAway(answers: number[]) {
  if (answers.length !== 25 || answers.some((answer) => !Number.isInteger(answer) || answer < 1 || answer > 5)) {
    throw new Error("Pull-away scoring requires exactly 25 answers from 1 to 5.");
  }
  const scores: PatternScores = {
    guarded: mean(answers, direct.guarded),
    chase: mean(answers, direct.chase),
    overthinking: mean(answers, direct.overthinking),
    slow: mean(answers, direct.slow),
    secure: (securityPositive.reduce((sum, index) => sum + answers[index - 1], 0) + securityReverse.reduce((sum, index) => sum + (6 - answers[index - 1]) * 0.5, 0)) / (securityPositive.length + securityReverse.length * 0.5)
  };
  const ranked = [...patternOrder].sort((a, b) => scores[b] - scores[a] || patternOrder.indexOf(a) - patternOrder.indexOf(b));
  return { primary: ranked[0], secondary: ranked[1], scores };
}

type PatternCopy = {
  name: string;
  free: { paragraphs: string[]; signs: string[]; clarification: string };
  paid: Array<[string, string]>;
};

const en: Record<PatternId, PatternCopy> = {
  guarded: {
    name: "The Guarded Heart",
    free: {
      paragraphs: [
        "You want real connection, but when closeness starts to feel intense, a protective part of you may reach for distance, control, or extra independence.",
        "Pulling back can be your way of keeping emotional pressure manageable. It may happen even when your interest is genuine, especially if closeness begins to feel like responsibility or a loss of personal space.",
        "Your secondary pattern adds another layer to how this protection tends to show up."
      ],
      signs: ["You need more space just as a connection deepens.", "You withdraw before explaining what feels too intense.", "Being strongly wanted can feel pressuring rather than flattering."],
      clarification: "Wanting autonomy is not the same as being unable to love; healthy space and honest closeness can coexist."
    },
    paid: [
      ["Your Core Relationship Pattern", "You value connection, yet vulnerability can activate a strong need for independence and emotional protection. Distance helps you feel like yourself again, even when the relationship matters."],
      ["Why You May Pull Away", "Closeness can register as a demand before it registers as comfort. You may step back to reduce pressure, avoid being responsible for another person’s feelings, or protect yourself from being hurt first."],
      ["What Usually Triggers It", "Common triggers include moving too fast, constant messaging, expectations of immediate vulnerability, feeling responsible for someone else’s emotions, and losing personal space."],
      ["How You Act When You Really Like Someone", "You may show care through reliability, observation, or practical gestures while revealing your inner world slowly. When the stakes rise, you may become quieter precisely because the person matters."],
      ["Your Hidden Strengths", "You are often independent, observant, deliberate, and unlikely to rush a bond. At your best, your boundaries protect both people without shutting down connection."],
      ["Your Blind Spots", "You may equate vulnerability with losing freedom, withdraw without explanation, or end something before the actual problem has been discussed."],
      ["What You Need From a Partner", "You tend to do well with someone who respects space, communicates directly, does not demand instant disclosure, and can stay warm without chasing you through every pause."],
      ["What To Try Next", "Name the need before taking distance: ‘I care about this, and I need a little time to settle. Can we reconnect tomorrow?’ A defined return makes space feel safer for both people."]
    ]
  },
  chase: {
    name: "The Thrill Chaser",
    free: {
      paragraphs: [
        "Your attraction may feel strongest when there is uncertainty, anticipation, or emotional distance. The chase creates energy, focus, and a vivid sense of possibility.",
        "Once someone becomes clearly available, the nervous-system intensity can drop—and that quieter feeling may look like lost chemistry even when a deeper connection could still grow.",
        "Your secondary pattern helps explain what you do after the excitement shifts."
      ],
      signs: ["You think about someone more when they reply less.", "Early flirting feels more exciting than established closeness.", "Consistency can make you wonder whether something is missing."],
      clarification: "This does not mean you are incapable of commitment; you may simply respond strongly to novelty and anticipation."
    },
    paid: [
      ["Your Core Relationship Pattern", "Attraction may become stronger when the outcome is uncertain and quieter when it feels guaranteed. Your attention naturally locks onto novelty, pursuit, and emotional movement."],
      ["Why You May Pull Away", "When the chase ends, calm can feel flat by comparison. You may interpret the loss of adrenaline as proof that the person is wrong rather than as a normal transition into a different kind of intimacy."],
      ["What Usually Triggers It", "Constant availability, predictability, the end of the flirting phase, and strong reassurance can all reduce the tension that previously amplified attraction."],
      ["How You Act When You Really Like Someone", "You bring energy, imagination, boldness, and play. If uncertainty returns, your attention may surge; if things stabilize, you may scan for a new spark or a reason to retreat."],
      ["Your Hidden Strengths", "You are often passionate, curious, energetic, and open to novelty. You can bring freshness and momentum to a relationship when excitement is built intentionally rather than through instability."],
      ["Your Blind Spots", "You may mistake anxiety for chemistry, idealize unavailable people, or exit before slower and more durable intimacy has time to develop."],
      ["What You Need From a Partner", "You benefit from someone consistent who also values play, autonomy, discovery, and new shared experiences—not someone who manufactures distance to hold your interest."],
      ["What To Try Next", "When interest dips, wait before treating it as a verdict. Create novelty together, then ask whether warmth, respect, curiosity, and desire are still present without the chase."]
    ]
  },
  overthinking: {
    name: "The Overthinker",
    free: {
      paragraphs: [
        "Your feelings may not disappear when closeness grows; they may become buried under analysis, doubt, and repeated attempts to reach certainty.",
        "The more important a connection becomes, the more your mind may inspect attraction, conversations, imperfections, and future compatibility. Thinking promises control, but it can make your direct experience harder to hear.",
        "Your secondary pattern suggests what tends to feed or soften that mental loop."
      ],
      signs: ["You replay conversations for signs that something changed.", "You repeatedly check whether your feelings are strong enough.", "Small imperfections feel louder once commitment becomes possible."],
      clarification: "Careful reflection is a strength; the goal is not to stop thinking, but to notice when analysis replaces experience."
    },
    paid: [
      ["Your Core Relationship Pattern", "You try to understand love by examining it closely. When a bond matters, analysis can become a way to prevent mistakes, disappointment, or an irreversible choice."],
      ["Why You May Pull Away", "Distance offers temporary relief from questions that have no perfectly certain answer. You may wait to feel completely sure before moving closer, even though relationships rarely provide that level of proof."],
      ["What Usually Triggers It", "Defining the relationship, long-term decisions, noticing imperfections, and changes in texting rhythm can all start a cycle of interpretation and checking."],
      ["How You Act When You Really Like Someone", "You pay close attention, remember details, and consider consequences. You may also monitor every shift in feeling, accidentally turning natural emotional variation into evidence of a problem."],
      ["Your Hidden Strengths", "You are thoughtful, reflective, careful, and motivated to make conscious choices. These qualities support excellent communication when curiosity is not forced to produce certainty."],
      ["Your Blind Spots", "You may treat feelings as facts, chase impossible certainty, or repeatedly test whether you are still attracted—making the relationship feel like an exam."],
      ["What You Need From a Partner", "Clear, steady communication helps, as does a partner who can discuss concerns without making every doubt an emergency or supplying endless reassurance."],
      ["What To Try Next", "Set a short window for reflection, then return to observable facts: How do you feel during real time together? What values align? What concern needs one direct conversation rather than another private review?"]
    ]
  },
  slow: {
    name: "The Slow Opener",
    free: {
      paragraphs: [
        "Your pace is less about avoiding connection and more about needing trust and emotional safety to develop gradually.",
        "You may look reserved from the outside, but your interest can be steady and sincere. Pressure to open quickly may slow you down further, while consistency gives your feelings room to become clear.",
        "Your secondary pattern describes the main influence shaping that careful pace."
      ],
      signs: ["You prefer relationships that unfold step by step.", "You need time before vulnerability feels natural.", "You show commitment more clearly after trust has been demonstrated."],
      clarification: "A slower pace is not a defect; communicated clearly, it can be an intentional and emotionally healthy way to build trust."
    },
    paid: [
      ["Your Core Relationship Pattern", "You need trust to develop gradually. Emotional openness becomes easier through repeated evidence of safety rather than through instant intensity or pressure."],
      ["Why You May Pull Away", "You are most likely to create distance when the relationship moves faster than your internal sense of readiness. The pause is often about pacing, not lack of care."],
      ["What Usually Triggers It", "Rapid escalation, early demands for disclosure, unclear expectations, and being asked to define feelings before they have settled can make you retreat."],
      ["How You Act When You Really Like Someone", "You tend to observe, build consistency, and invest deliberately. Your affection may appear through dependable actions before it appears through big emotional statements."],
      ["Your Hidden Strengths", "You are often loyal, intentional, less impulsive, and attentive to emotional safety. Once trust is established, your commitment can be unusually steady."],
      ["Your Blind Spots", "Others may read your pace as disinterest. You may communicate too late or expect someone to infer needs you have not yet named."],
      ["What You Need From a Partner", "Patience, consistency, low-pressure honesty, and respect for gradual vulnerability help you open without feeling managed or rushed."],
      ["What To Try Next", "Give your pace words early: ‘I am interested, and I open gradually.’ Pair that message with one visible sign of interest so the other person is not left to guess."]
    ]
  },
  secure: {
    name: "The Secure Connector",
    free: {
      paragraphs: [
        "You can usually welcome emotional closeness without losing your sense of independence. Affection and consistency tend to feel supportive rather than threatening.",
        "You are generally able to stay interested after novelty fades, express care directly, and let a calm connection be meaningful. Stress can still affect you; security is a capacity, not perfection.",
        "Your secondary pattern shows where you may become more cautious under pressure."
      ],
      signs: ["You can receive affection without immediately doubting it.", "You remain engaged after the chase settles.", "You can express interest while maintaining your own space."],
      clarification: "This is not a ‘perfect personality’ result; it reflects flexibility that still benefits from attention and communication."
    },
    paid: [
      ["Your Core Relationship Pattern", "You generally tolerate closeness while maintaining independence. Connection does not usually require you to abandon yourself, and personal space does not automatically signal rejection."],
      ["Why You May Pull Away", "You may step back when communication becomes persistently unclear, boundaries are ignored, or mutual effort disappears—not simply because intimacy has become real."],
      ["What Usually Triggers It", "Repeated inconsistency, unresolved conflict, pressure that overrides your stated needs, or carrying the relationship alone can reduce your willingness to stay open."],
      ["How You Act When You Really Like Someone", "You tend to communicate affection, remain curious after novelty fades, and make room for both closeness and separate lives. You can usually address uncertainty without turning it into a crisis."],
      ["Your Hidden Strengths", "You express care, maintain interest, tolerate ordinary uncertainty, and communicate needs. Your steadiness can create room for honest repair."],
      ["Your Blind Spots", "Because closeness feels relatively natural to you, you may underestimate how threatening it feels to another pattern or become too quick to interpret their pause as lack of interest."],
      ["What You Need From a Partner", "Mutuality matters: a partner who communicates, respects boundaries, accepts affection, and participates in repair allows your security to remain a shared practice."],
      ["What To Try Next", "Keep asking rather than assuming. When someone pulls back, name what you observe, explain its impact, and invite clarity while preserving your own limits."]
    ]
  }
};

const es: Record<PatternId, PatternCopy> = {
  guarded: {
    name: "El corazón protegido",
    free: {
      paragraphs: ["Deseas una conexión real, pero cuando la cercanía se intensifica, una parte protectora puede buscar distancia, control o más independencia.", "Alejarte puede ayudarte a reducir la presión emocional. Puede ocurrir aunque tu interés sea sincero, sobre todo si la cercanía empieza a sentirse como responsabilidad o pérdida de espacio personal.", "Tu patrón secundario añade otra capa a la forma en que suele aparecer esta protección."],
      signs: ["Necesitas más espacio justo cuando el vínculo se profundiza.", "Te distancias antes de explicar qué se siente demasiado intenso.", "Sentirte muy deseado/a puede generar presión en vez de ilusión."],
      clarification: "Querer autonomía no significa ser incapaz de amar; el espacio saludable y la cercanía honesta pueden coexistir."
    },
    paid: [
      ["Tu patrón central en las relaciones", "Valoras la conexión, pero la vulnerabilidad puede activar una fuerte necesidad de independencia y protección emocional. La distancia te ayuda a volver a sentirte tú, incluso cuando la relación importa."],
      ["Por qué podrías alejarte", "La cercanía puede sentirse como una exigencia antes que como consuelo. Quizá retrocedas para reducir presión, evitar hacerte responsable de las emociones ajenas o protegerte de ser quien salga herido."],
      ["Qué suele activarlo", "Avanzar demasiado rápido, los mensajes constantes, esperar vulnerabilidad inmediata, sentirte responsable de las emociones de otra persona y perder espacio personal son activadores frecuentes."],
      ["Cómo actúas cuando alguien te gusta de verdad", "Puedes demostrar cariño con fiabilidad, observación o gestos prácticos mientras revelas tu mundo interior lentamente. Cuando hay más en juego, puedes callarte precisamente porque esa persona importa."],
      ["Tus fortalezas ocultas", "Sueles ser independiente, observador/a, prudente y poco propenso/a a precipitarte. En tu mejor versión, tus límites protegen a ambos sin cerrar la conexión."],
      ["Tus puntos ciegos", "Puedes confundir vulnerabilidad con pérdida de libertad, retirarte sin explicarlo o terminar algo antes de hablar del problema real."],
      ["Lo que necesitas de una pareja", "Te favorece alguien que respete tu espacio, comunique con claridad, no exija apertura instantánea y pueda mantener la calidez sin perseguirte durante cada pausa."],
      ["Qué puedes intentar ahora", "Nombra la necesidad antes de tomar distancia: ‘Esto me importa y necesito un poco de tiempo para calmarme. ¿Podemos retomarlo mañana?’. Definir el regreso hace el espacio más seguro para ambos."]
    ]
  },
  chase: {
    name: "Quien persigue la emoción",
    free: {
      paragraphs: ["Tu atracción puede sentirse más intensa cuando hay incertidumbre, anticipación o distancia emocional. La conquista crea energía, enfoque y una viva sensación de posibilidad.", "Cuando alguien está claramente disponible, esa intensidad puede bajar. La calma puede parecer pérdida de química aunque todavía exista espacio para una conexión más profunda.", "Tu patrón secundario ayuda a explicar qué haces cuando cambia la emoción inicial."],
      signs: ["Piensas más en alguien cuando responde menos.", "El coqueteo inicial te emociona más que la cercanía estable.", "La constancia puede hacerte sentir que falta algo."],
      clarification: "Esto no significa que no puedas comprometerte; quizá simplemente respondes con fuerza a la novedad y la anticipación."
    },
    paid: [
      ["Tu patrón central en las relaciones", "La atracción puede aumentar cuando el resultado es incierto y bajar cuando parece garantizado. Tu atención se engancha de forma natural con la novedad, la conquista y el movimiento emocional."],
      ["Por qué podrías alejarte", "Cuando termina la conquista, la calma puede parecer plana. Puedes interpretar la pérdida de adrenalina como prueba de que la persona no es adecuada, en vez de verla como una transición normal hacia otra intimidad."],
      ["Qué suele activarlo", "La disponibilidad constante, la previsibilidad, el final del coqueteo y recibir mucha seguridad pueden reducir la tensión que antes amplificaba la atracción."],
      ["Cómo actúas cuando alguien te gusta de verdad", "Aportas energía, imaginación, valentía y juego. Si regresa la incertidumbre, tu atención puede dispararse; si todo se estabiliza, quizá busques otra chispa o un motivo para retirarte."],
      ["Tus fortalezas ocultas", "Sueles ser apasionado/a, curioso/a, enérgico/a y abierto/a a la novedad. Puedes aportar frescura cuando la emoción se crea de forma intencional y no mediante inestabilidad."],
      ["Tus puntos ciegos", "Puedes confundir ansiedad con química, idealizar a personas inaccesibles o salir antes de que una intimidad más lenta tenga tiempo de crecer."],
      ["Lo que necesitas de una pareja", "Te beneficia alguien constante que también valore el juego, la autonomía, el descubrimiento y las experiencias nuevas compartidas, no alguien que fabrique distancia para retener tu interés."],
      ["Qué puedes intentar ahora", "Cuando baje el interés, espera antes de convertirlo en veredicto. Creen novedad juntos y observa si siguen presentes la calidez, el respeto, la curiosidad y el deseo sin la conquista."]
    ]
  },
  overthinking: {
    name: "Quien le da demasiadas vueltas",
    free: {
      paragraphs: ["Tus sentimientos quizá no desaparecen cuando aumenta la cercanía; pueden quedar enterrados bajo análisis, dudas e intentos repetidos de alcanzar certeza.", "Cuanto más importante es el vínculo, más puede tu mente examinar la atracción, las conversaciones, los defectos y el futuro. Pensar promete control, pero puede dificultar escuchar tu experiencia directa.", "Tu patrón secundario sugiere qué suele alimentar o suavizar ese bucle mental."],
      signs: ["Repasas conversaciones buscando señales de cambio.", "Compruebas una y otra vez si tus sentimientos son suficientes.", "Los pequeños defectos pesan más cuando el compromiso es posible."],
      clarification: "Reflexionar con cuidado es una fortaleza; no se trata de dejar de pensar, sino de notar cuándo el análisis sustituye a la experiencia."
    },
    paid: [
      ["Tu patrón central en las relaciones", "Intentas comprender el amor examinándolo de cerca. Cuando un vínculo importa, analizar puede servir para evitar errores, decepciones o decisiones que parezcan irreversibles."],
      ["Por qué podrías alejarte", "La distancia alivia temporalmente preguntas sin respuesta perfecta. Puedes esperar a sentir certeza total antes de acercarte, aunque las relaciones rara vez ofrecen esa prueba."],
      ["Qué suele activarlo", "Definir la relación, tomar decisiones a largo plazo, notar imperfecciones y percibir cambios en los mensajes pueden iniciar un ciclo de interpretación y comprobación."],
      ["Cómo actúas cuando alguien te gusta de verdad", "Prestas mucha atención, recuerdas detalles y valoras las consecuencias. También puedes vigilar cada cambio emocional y convertir variaciones normales en supuestas pruebas de un problema."],
      ["Tus fortalezas ocultas", "Eres reflexivo/a, cuidadoso/a y buscas decidir de forma consciente. Estas cualidades favorecen una gran comunicación cuando la curiosidad no tiene que producir certeza."],
      ["Tus puntos ciegos", "Puedes tratar los sentimientos como hechos, perseguir una certeza imposible o comprobar repetidamente si todavía sientes atracción, convirtiendo la relación en un examen."],
      ["Lo que necesitas de una pareja", "Ayuda una comunicación clara y estable, y alguien que pueda hablar de las dudas sin convertirlas en emergencia ni ofrecer tranquilidad infinita."],
      ["Qué puedes intentar ahora", "Reserva un tiempo breve para reflexionar y vuelve a hechos observables: ¿cómo te sientes al estar juntos?, ¿qué valores coinciden?, ¿qué inquietud necesita una conversación directa en vez de otra revisión privada?"]
    ]
  },
  slow: {
    name: "Quien necesita tiempo para abrirse",
    free: {
      paragraphs: ["Tu ritmo tiene menos que ver con evitar la conexión y más con necesitar que la confianza y la seguridad emocional crezcan poco a poco.", "Puedes parecer reservado/a, pero tu interés puede ser constante y sincero. La presión por abrirte rápido puede frenarte más; la constancia permite que tus sentimientos se aclaren.", "Tu patrón secundario describe la influencia principal que moldea ese ritmo cuidadoso."],
      signs: ["Prefieres que las relaciones avancen paso a paso.", "Necesitas tiempo para que la vulnerabilidad se sienta natural.", "Muestras el compromiso con más claridad después de comprobar la confianza."],
      clarification: "Un ritmo lento no es un defecto; si lo comunicas claramente, puede ser una forma intencional y saludable de construir confianza."
    },
    paid: [
      ["Tu patrón central en las relaciones", "Necesitas que la confianza se desarrolle gradualmente. Abrirte resulta más fácil gracias a pruebas repetidas de seguridad que por intensidad instantánea o presión."],
      ["Por qué podrías alejarte", "Es más probable que tomes distancia cuando la relación avanza más rápido que tu sensación interna de preparación. La pausa suele hablar de ritmo, no de falta de cariño."],
      ["Qué suele activarlo", "La escalada rápida, exigir revelaciones tempranas, las expectativas confusas y pedirte que definas sentimientos aún no asentados pueden hacer que retrocedas."],
      ["Cómo actúas cuando alguien te gusta de verdad", "Sueles observar, crear constancia e invertir de forma deliberada. Tu afecto puede aparecer en acciones fiables antes que en grandes declaraciones emocionales."],
      ["Tus fortalezas ocultas", "Sueles ser leal, intencional, poco impulsivo/a y atento/a a la seguridad emocional. Cuando hay confianza, tu compromiso puede ser muy estable."],
      ["Tus puntos ciegos", "Otras personas pueden interpretar tu ritmo como desinterés. Quizá comuniques demasiado tarde o esperes que alguien adivine necesidades que aún no nombraste."],
      ["Lo que necesitas de una pareja", "La paciencia, la constancia, la honestidad sin presión y el respeto por la vulnerabilidad gradual te ayudan a abrirte sin sentirte dirigido/a o apurado/a."],
      ["Qué puedes intentar ahora", "Pon palabras a tu ritmo desde el principio: ‘Me interesas y me abro poco a poco’. Acompáñalo con una señal visible de interés para que la otra persona no tenga que adivinar."]
    ]
  },
  secure: {
    name: "Quien conecta con seguridad",
    free: {
      paragraphs: ["Normalmente puedes recibir cercanía emocional sin perder tu independencia. El afecto y la constancia suelen sentirse como apoyo, no como amenaza.", "Puedes mantener el interés cuando baja la novedad, expresar cariño directamente y valorar una conexión tranquila. El estrés aún puede afectarte: la seguridad es una capacidad, no perfección.", "Tu patrón secundario muestra dónde puedes volverte más cauteloso/a bajo presión."],
      signs: ["Aceptas el afecto sin dudar de inmediato.", "Sigues presente cuando termina la conquista.", "Expresas interés y conservas tu propio espacio."],
      clarification: "Este no es un resultado de ‘personalidad perfecta’; refleja flexibilidad que también necesita atención y comunicación."
    },
    paid: [
      ["Tu patrón central en las relaciones", "Sueles tolerar la cercanía y mantener tu independencia. Conectar no exige abandonarte, y el espacio personal no significa automáticamente rechazo."],
      ["Por qué podrías alejarte", "Puedes retroceder cuando la comunicación es confusa de forma persistente, no se respetan los límites o desaparece el esfuerzo mutuo, no simplemente porque la intimidad se volvió real."],
      ["Qué suele activarlo", "La inconsistencia repetida, los conflictos sin resolver, la presión que ignora tus necesidades o cargar a solas con la relación pueden reducir tu apertura."],
      ["Cómo actúas cuando alguien te gusta de verdad", "Sueles comunicar afecto, conservar la curiosidad tras la novedad y dejar espacio para la cercanía y las vidas separadas. Puedes abordar la incertidumbre sin convertirla en crisis."],
      ["Tus fortalezas ocultas", "Expresas cariño, mantienes el interés, toleras la incertidumbre común y comunicas necesidades. Tu estabilidad crea espacio para reparar con honestidad."],
      ["Tus puntos ciegos", "Como la cercanía te resulta relativamente natural, puedes subestimar lo amenazante que es para otros patrones o interpretar demasiado rápido una pausa como falta de interés."],
      ["Lo que necesitas de una pareja", "Importa la reciprocidad: alguien que comunique, respete límites, acepte el afecto y participe en la reparación ayuda a que la seguridad sea una práctica compartida."],
      ["Qué puedes intentar ahora", "Sigue preguntando en vez de asumir. Si alguien se aleja, nombra lo que observas, explica su impacto e invita a aclararlo mientras conservas tus propios límites."]
    ]
  }
};

const secondaryBody = (pattern: PatternId, language: Language) => {
  const names = language === "es" ? es : en;
  const explanations: Record<Language, Record<PatternId, string>> = {
    en: {
      guarded: "Your protective side may become more visible when closeness feels demanding. Give space a clear purpose and a clear return.",
      chase: "Novelty and uncertainty may amplify your main pattern. Build excitement through shared discovery rather than emotional distance.",
      overthinking: "Analysis may intensify your main response. Separate observable facts from predictions before making a relationship decision.",
      slow: "Your need for time may shape how the main pattern unfolds. Naming your pace can prevent a healthy pause from being misread.",
      secure: "Your secure capacity can soften the main pattern. Return to direct communication, mutuality, and the evidence of how the relationship actually feels."
    },
    es: {
      guarded: "Tu lado protector puede hacerse más visible cuando la cercanía parece exigente. Dale al espacio un propósito y un momento claro de regreso.",
      chase: "La novedad y la incertidumbre pueden amplificar tu patrón principal. Crea emoción con descubrimientos compartidos, no con distancia emocional.",
      overthinking: "El análisis puede intensificar tu respuesta principal. Separa los hechos observables de las predicciones antes de decidir sobre la relación.",
      slow: "Tu necesidad de tiempo puede moldear el patrón principal. Nombrar tu ritmo evita que una pausa saludable se interprete mal.",
      secure: "Tu capacidad segura puede suavizar el patrón principal. Vuelve a la comunicación directa, la reciprocidad y la experiencia real de la relación."
    }
  };
  return language === "es"
    ? `Tu segundo resultado es ${names[pattern].name}. ${explanations.es[pattern]}`
    : `Your secondary result is ${names[pattern].name}. ${explanations.en[pattern]}`;
};

export function getPullAwayFreeResult(answers: number[], language: Language): PullAwayFreeResult {
  const { primary, secondary } = scorePullAway(answers);
  const copy = language === "es" ? es : en;
  return { primary, secondary, label: copy[primary].name, secondaryLabel: copy[secondary].name, ...copy[primary].free };
}

export function buildPullAwayPaidResult(answers: number[], language: Language) {
  const { primary, secondary, scores } = scorePullAway(answers);
  const copy = language === "es" ? es : en;
  const heading = language === "es" ? "Tu patrón secundario" : "Your Secondary Pattern";
  return {
    quizTitle: pullAwayQuiz.title[language],
    tier: primary,
    primary,
    secondary,
    scores,
    label: copy[primary].name,
    secondaryLabel: copy[secondary].name,
    summary: copy[primary].free.paragraphs[0],
    sections: [...copy[primary].paid, [heading, secondaryBody(secondary, language)]].map(([sectionHeading, body]) => ({ heading: sectionHeading, body })) as ReportSection[]
  };
}
