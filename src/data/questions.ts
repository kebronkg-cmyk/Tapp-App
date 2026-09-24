import type { IconName } from '../icons';
import type { ValueKey } from './types';

export type Option = {
  t: string;
  /**
   * Position on the question's own axis. Agreement is measured as closeness of
   * two people's weights, so the number carries meaning beyond "right answer".
   */
  w: number;
};

export type Question = {
  id: string;
  tag: string;
  icon: IconName;
  /** Index of the compatibility level this question moves. */
  level: number;
  /** Werte-DNA trait this question feeds (human questions only). */
  valueKey?: ValueKey;
  q: string;
  /** Short label for this question when it shows up in the Fazit. */
  topic: string;
  opts: Option[];
  /** Shown in the Fazit when both picked the same option. */
  agree: string;
  /** Shown in the Fazit when the two answers sit far apart. */
  clash: string;
};

export const humanQuestions: Question[] = [
  {
    id: 'h1',
    tag: 'Trend-Frage',
    icon: 'flame',
    level: 0,
    valueKey: 'Humor',
    topic: 'Nachtmensch',
    q: '3 Uhr nachts, ihr habt Hunger. Was wird’s?',
    opts: [
      { t: 'Döner. Keine Diskussion.', w: 3 },
      { t: 'Selber kochen, volles Chaos', w: 1 },
      { t: 'Ich schlafe um 3 Uhr??', w: -3 },
    ],
    agree: 'Eure Nächte laufen nach demselben Drehbuch.',
    clash: 'Einer von euch ist wach, wenn der andere längst schläft. Plant früher.',
  },
  {
    id: 'h2',
    tag: 'Lifestyle',
    icon: 'bolt',
    level: 1,
    valueKey: 'Ehrgeiz',
    topic: 'Wochenende',
    q: 'Perfekter Samstag?',
    opts: [
      { t: 'Sport, Sonne, Leute — draußen', w: 3 },
      { t: 'Grind: Projekte pushen', w: 1 },
      { t: 'Bett + Serie + Handy', w: -3 },
    ],
    agree: 'Euer Wochenende sieht gleich aus — daraus wird leicht ein gemeinsames.',
    clash: 'Ihr erholt euch auf entgegengesetzte Art. Das muss kein Problem sein, aber sagt es euch.',
  },
  {
    id: 'h3',
    tag: 'Tiefen-Frage',
    icon: 'people',
    level: 3,
    valueKey: 'Loyalität',
    topic: 'Ehrlichkeit unter Freunden',
    q: 'Dein bester Freund baut ein Startup, das sicher scheitert. Sagst du’s ihm?',
    opts: [
      { t: 'Sofort und direkt. Das ist Liebe.', w: 3 },
      { t: 'Vorsichtig andeuten', w: 0 },
      { t: 'Er muss es selbst merken', w: -3 },
    ],
    agree: 'Ihr versteht unter einem guten Freund dasselbe.',
    clash: 'Der eine würde es sagen, der andere nicht. Genau daran zerbrechen Freundschaften leise.',
  },
  {
    id: 'h4',
    tag: 'Tiefen-Frage',
    icon: 'target',
    level: 3,
    valueKey: 'Direktheit',
    topic: 'Loyalität vs. Wahrheit',
    q: 'Was wiegt mehr: Loyalität oder Ehrlichkeit?',
    opts: [
      { t: 'Ehrlichkeit — auch wenn’s wehtut', w: 3 },
      { t: 'Loyalität — mein Kreis zuerst', w: 0 },
      { t: 'Kommt drauf an, wer fragt', w: -2 },
    ],
    agree: 'Ihr zieht dieselbe Grenze, wenn es unangenehm wird.',
    clash: 'Im Konflikt würdet ihr euch unterschiedlich entscheiden. Gut zu wissen, bevor es soweit ist.',
  },
  {
    id: 'h5',
    tag: 'Teach-Frage',
    icon: 'guitar',
    level: 2,
    valueKey: 'Humor',
    topic: 'Lernen',
    q: 'Neue Skills lernen — dein Style?',
    opts: [
      { t: 'YouTube + einfach machen', w: 3 },
      { t: 'Jemand muss es mir zeigen', w: 1 },
      { t: 'Ich prokrastiniere erstmal', w: -2 },
    ],
    agree: 'Ihr lernt gleich — ihr könnt euch gegenseitig was beibringen, ohne dass es zäh wird.',
    clash: 'Einer macht einfach, der andere braucht Anleitung. Als Duo kann genau das passen.',
  },
  {
    id: 'h6',
    tag: 'Mystery',
    icon: 'lock',
    level: 4,
    valueKey: 'Ehrgeiz',
    topic: 'Zukunftsbild',
    q: 'In 10 Jahren: Was MUSS wahr sein?',
    opts: [
      { t: 'Eigenes Ding aufgebaut', w: 3 },
      { t: 'Enge Leute, gutes Leben', w: 1 },
      { t: 'Einfach raus aus Deutschland lol', w: -1 },
    ],
    agree: 'Ihr wollt in zehn Jahren am selben Ort stehen.',
    clash: 'Eure Zukunftsbilder zeigen in verschiedene Richtungen.',
  },
];

export const bizQuestions: Question[] = [
  {
    id: 'b1',
    tag: 'Vision',
    icon: 'trend',
    level: 0,
    topic: 'Finanzierung',
    q: 'Bootstrap oder Raise?',
    opts: [
      { t: 'Erst Umsatz, dann Raise', w: 3 },
      { t: 'Schnell Geld reinholen', w: 0 },
      { t: 'Kommt auf den Hype an', w: -2 },
    ],
    agree: 'Ihr würdet dieselbe erste Finanzierungsentscheidung treffen.',
    clash: 'Beim Geld zieht ihr in verschiedene Richtungen. Das klärt man vor, nicht nach der Gründung.',
  },
  {
    id: 'b2',
    tag: 'Arbeitsstil',
    icon: 'sliders',
    level: 1,
    topic: 'Tempo',
    q: 'Co-Founder antwortet 2 Tage nicht. Was denkst du?',
    opts: [
      { t: 'Red Flag — Tempo zählt', w: 3 },
      { t: 'Nachfragen, vielleicht Stress', w: 0 },
      { t: 'Ist doch normal', w: -3 },
    ],
    agree: 'Euer Arbeitstempo passt zusammen.',
    clash: 'Was für den einen normal ist, ist für den anderen ein Alarmzeichen.',
  },
  {
    id: 'b3',
    tag: 'Risiko',
    icon: 'coin',
    level: 3,
    topic: 'Risiko',
    q: 'Würdest du 2.000 € in einen sauberen MVP stecken?',
    opts: [
      { t: 'Ja, wenn der Plan steht', w: 3 },
      { t: 'Nur mit Partner', w: 1 },
      { t: 'Nein, zu risky', w: -3 },
    ],
    agree: 'Ihr habt dieselbe Schmerzgrenze beim eigenen Geld.',
    clash: 'Eure Risikobereitschaft liegt weit auseinander — das wird beim ersten echten Invest zum Thema.',
  },
  {
    id: 'b4',
    tag: 'Skill-Fit',
    icon: 'idea',
    level: 2,
    topic: 'Bedarf',
    q: 'Was brauchst du gerade mehr?',
    opts: [
      { t: 'Umsetzer', w: 3 },
      { t: 'Designer', w: 1 },
      { t: 'Nur Motivation', w: -2 },
    ],
    agree: 'Ihr seht dieselbe Lücke im Team.',
    clash: 'Ihr würdet die nächste Person für völlig verschiedene Rollen einstellen.',
  },
  {
    id: 'b5',
    tag: 'Ambition',
    icon: 'rocket',
    level: 4,
    topic: 'Einsatz',
    q: 'Wie hart würdest du 90 Tage pushen?',
    opts: [
      { t: 'Täglich, messbar', w: 3 },
      { t: 'An den Wochenenden', w: 0 },
      { t: 'Wenn ich Lust habe', w: -3 },
    ],
    agree: 'Ihr würdet gleich viel reinstecken. Das ist die häufigste Bruchstelle — bei euch hält sie.',
    clash: 'Einer würde Vollgas geben, der andere nebenbei. Das trägt keine Gründung.',
  },
];

export function questionsFor(kind: 'connection' | 'biz') {
  return kind === 'biz' ? bizQuestions : humanQuestions;
}

export function verdictFor(score: number) {
  if (score >= 85) return 'Electric';
  if (score >= 70) return 'Echtes Potenzial';
  if (score >= 55) return 'Slow Burn';
  return 'Plot Twist';
}
