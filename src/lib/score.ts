import { questionsFor, type Question } from '../data/questions';
import type { Interest } from '../data/types';

export type ScorePart = {
  label: string;
  detail: string;
  /** Contribution to the final score, already weighted. */
  points: number;
  max: number;
};

export type Fazit = {
  headline: string;
  verdict: string;
  connects?: { topic: string; answer: string; note: string };
  contrast?: { topic: string; you: string; them: string; note: string };
  /** Something concrete to talk about, derived from the answers. */
  opener?: string;
};

export type Scored = {
  score: number;
  parts: ScorePart[];
  answered: number;
  total: number;
  fazit: Fazit;
};

type Input = {
  kind: 'connection' | 'biz';
  /** questionId -> chosen option index, from the user. */
  mine: Record<string, number>;
  /** questionId -> chosen option index, from the other person. */
  theirs: Record<string, number>;
  /** Seed used until any question is answered together. */
  baseAffinity: number;
  myInterests: string[];
  theirInterests: Interest[];
  myTeach: string[];
  /** What the other person can teach. */
  theirTeach?: string;
  /** Real meetings so far — consistency is earned outside the app. */
  meetings: number;
};

const clamp = (n: number) => Math.max(5, Math.min(99, Math.round(n)));

const norm = (s: string) => s.toLowerCase().trim();

/** How close two answers to the same question are, 0..1. */
function similarity(q: Question, a: number, b: number) {
  const ws = q.opts.map((o) => o.w);
  const spread = Math.max(...ws) - Math.min(...ws) || 1;
  return 1 - Math.min(1, Math.abs(q.opts[a].w - q.opts[b].w) / spread);
}

export function computeScore(input: Input): Scored {
  const questions = questionsFor(input.kind);
  const shared = questions.filter((q) => input.mine[q.id] != null && input.theirs[q.id] != null);

  // --- answers -------------------------------------------------------------
  // One matching answer is not evidence of much, so observed agreement only
  // displaces the starting estimate as fast as questions actually get answered.
  const sims = shared.map((q) => similarity(q, input.mine[q.id], input.theirs[q.id]));
  const observed = sims.length ? (sims.reduce((a, b) => a + b, 0) / sims.length) * 100 : 0;
  const confidence = questions.length ? shared.length / questions.length : 0;
  const agreementPct = input.baseAffinity * (1 - confidence) + observed * confidence;
  const sameCount = shared.filter((q) => input.mine[q.id] === input.theirs[q.id]).length;

  // --- interests -----------------------------------------------------------
  const mineSet = input.myInterests.map(norm);
  const overlap = input.theirInterests.filter((i) => mineSet.includes(norm(i.name)));
  const union = new Set([...mineSet, ...input.theirInterests.map((i) => norm(i.name))]).size || 1;
  const interestPct = (overlap.length / union) * 100 * 2; // overlap of 50% already reads as a strong match

  // --- teach fit -----------------------------------------------------------
  const theyTeachWhatIWant = input.theirTeach
    ? mineSet.some((w) => norm(input.theirTeach!).includes(w) || w.includes(norm(input.theirTeach!)))
    : false;
  const teachPct = theyTeachWhatIWant ? 100 : input.theirTeach ? 45 : 0;

  // --- consistency ---------------------------------------------------------
  const consistency = Math.min(12, input.meetings * 4);

  const parts: ScorePart[] = [
    {
      label: 'Antworten',
      detail: shared.length
        ? `${sameCount} von ${shared.length} identisch` +
          (shared.length < questions.length ? ` · ${questions.length - shared.length} offen, Startwert wirkt noch mit` : '')
        : 'Noch keine gemeinsamen Fragen — Startwert',
      points: (agreementPct / 100) * 55,
      max: 55,
    },
    {
      label: 'Interessen',
      detail: overlap.length ? overlap.map((o) => o.name).join(', ') : 'Keine Überschneidung bisher',
      points: (Math.min(100, interestPct) / 100) * 25,
      max: 25,
    },
    {
      label: 'Teach-Fit',
      detail: theyTeachWhatIWant
        ? `Kann dir ${input.theirTeach} beibringen`
        : input.theirTeach
          ? `Bietet ${input.theirTeach} an`
          : 'Kein Angebot hinterlegt',
      points: (teachPct / 100) * 20,
      max: 20,
    },
    {
      label: 'Konstanz',
      detail: input.meetings
        ? `${input.meetings} echte Treffen`
        : 'Noch kein Wiedersehen — Rebump bringt Punkte',
      points: consistency,
      max: 12,
    },
  ];

  const score = clamp(parts.reduce((sum, p) => sum + p.points, 0));

  return {
    score,
    parts,
    answered: shared.length,
    total: questions.length,
    fazit: buildFazit({ questions, shared, input, score, sameCount }),
  };
}

function buildFazit({
  questions,
  shared,
  input,
  sameCount,
}: {
  questions: Question[];
  shared: Question[];
  input: Input;
  score: number;
  sameCount: number;
}): Fazit {
  if (!shared.length) {
    return {
      headline: 'Noch kein Fazit',
      verdict:
        'Ihr habt noch keine Frage gemeinsam beantwortet. Der Wert oben ist nur ein Startwert aus Interessen und Nähe.',
    };
  }

  // Strongest common ground: same option, highest conviction.
  const agreements = shared
    .filter((q) => input.mine[q.id] === input.theirs[q.id])
    .sort((a, b) => Math.abs(b.opts[input.mine[b.id]].w) - Math.abs(a.opts[input.mine[a.id]].w));

  // Sharpest split, only counted when the answers genuinely sit apart.
  const clashes = shared
    .map((q) => ({ q, d: 1 - similarity(q, input.mine[q.id], input.theirs[q.id]) }))
    .filter((x) => x.d >= 0.5)
    .sort((a, b) => b.d - a.d);

  const top = agreements[0];
  const clash = clashes[0]?.q;

  const connects = top
    ? {
        topic: top.topic,
        answer: top.opts[input.mine[top.id]].t,
        note: top.agree,
      }
    : undefined;

  const contrast = clash
    ? {
        topic: clash.topic,
        you: clash.opts[input.mine[clash.id]].t,
        them: clash.opts[input.theirs[clash.id]].t,
        note: clash.clash,
      }
    : undefined;

  const ratio = sameCount / shared.length;
  const early = shared.length < Math.ceil(questions.length / 2);
  const tally = `${sameCount} von ${shared.length} Antworten identisch`;
  const open = questions.length - shared.length;
  const caveat = open > 0 ? ` Noch ${open} Fragen offen — das Bild kann sich drehen.` : '';

  let headline: string;
  let verdict: string;

  if (early) {
    headline = 'Erster Eindruck';
    verdict = `${tally}. Für ein Urteil ist das zu früh, aber ihr habt einen Anfang.${caveat}`;
  } else if (ratio >= 0.75) {
    headline = 'Ihr tickt gleich';
    verdict = `${tally}. Bei euch muss niemand Umwege gehen — ihr könnt direkt sein, ohne euch zu erklären.${caveat}`;
  } else if (ratio >= 0.4) {
    headline = 'Gleiche Basis, andere Kanten';
    verdict = `${tally}. Im Grundsätzlichen seid ihr euch einig, im Alltag nicht immer. Aus dieser Mischung werden die interessanten Freundschaften.${caveat}`;
  } else if (clash) {
    headline = 'Reibung';
    verdict = `${tally}. Ihr seht vieles verschieden — das kann anstrengend werden, oder genau der Grund sein, warum ihr euch gegenseitig aus der Blase holt.${caveat}`;
  } else {
    headline = 'Noch unscharf';
    verdict = `${tally}. Zu wenig Übereinstimmung für ein klares Bild.${caveat}`;
  }

  const opener = contrast
    ? `Fragt euch: „${contrast.topic}" — warum eigentlich so unterschiedlich?`
    : connects
      ? `Fragt euch: seit wann läuft das mit „${connects.topic}" bei euch so?`
      : undefined;

  return { headline, verdict, connects, contrast, opener };
}
