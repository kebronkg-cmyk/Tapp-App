import type { IconName } from '../icons';
import type { ValueKey } from './types';

export type Question = {
  tag: string;
  icon: IconName;
  /** Index of the compatibility level this question moves. */
  level: number;
  /** Werte-DNA trait this question feeds (human questions only). */
  valueKey?: ValueKey;
  q: string;
  opts: { t: string; d: number }[];
};

export const humanQuestions: Question[] = [
  {
    tag: 'Trend-Frage',
    icon: 'flame',
    level: 0,
    valueKey: 'Humor',
    q: '3 Uhr nachts, ihr habt Hunger. Was wird’s?',
    opts: [
      { t: 'Döner. Keine Diskussion.', d: 3 },
      { t: 'Selber kochen, volles Chaos', d: 2 },
      { t: 'Ich schlafe um 3 Uhr??', d: -2 },
    ],
  },
  {
    tag: 'Lifestyle',
    icon: 'bolt',
    level: 1,
    valueKey: 'Ehrgeiz',
    q: 'Perfekter Samstag?',
    opts: [
      { t: 'Sport, Sonne, Leute — draußen', d: 3 },
      { t: 'Grind: Projekte pushen', d: 2 },
      { t: 'Bett + Serie + Handy', d: -2 },
    ],
  },
  {
    tag: 'Tiefen-Frage',
    icon: 'people',
    level: 3,
    valueKey: 'Loyalität',
    q: 'Dein bester Freund baut ein Startup, das sicher scheitert. Sagst du’s ihm?',
    opts: [
      { t: 'Sofort und direkt. Das ist Liebe.', d: 4 },
      { t: 'Vorsichtig andeuten', d: 1 },
      { t: 'Er muss es selbst merken', d: -3 },
    ],
  },
  {
    tag: 'Tiefen-Frage',
    icon: 'target',
    level: 3,
    valueKey: 'Direktheit',
    q: 'Was wiegt mehr: Loyalität oder Ehrlichkeit?',
    opts: [
      { t: 'Ehrlichkeit — auch wenn’s wehtut', d: 4 },
      { t: 'Loyalität — mein Kreis zuerst', d: 2 },
      { t: 'Kommt drauf an, wer fragt', d: -2 },
    ],
  },
  {
    tag: 'Teach-Frage',
    icon: 'guitar',
    level: 2,
    valueKey: 'Humor',
    q: 'Neue Skills lernen — dein Style?',
    opts: [
      { t: 'YouTube + einfach machen', d: 3 },
      { t: 'Jemand muss es mir zeigen', d: 2 },
      { t: 'Ich prokrastiniere erstmal', d: -2 },
    ],
  },
  {
    tag: 'Mystery',
    icon: 'lock',
    level: 4,
    valueKey: 'Ehrgeiz',
    q: 'In 10 Jahren: Was MUSS wahr sein?',
    opts: [
      { t: 'Eigenes Ding aufgebaut', d: 4 },
      { t: 'Enge Leute, gutes Leben', d: 3 },
      { t: 'Einfach raus aus Deutschland lol', d: -1 },
    ],
  },
];

export const bizQuestions: Question[] = [
  {
    tag: 'Vision',
    icon: 'trend',
    level: 0,
    q: 'Bootstrap oder Raise?',
    opts: [
      { t: 'Erst Umsatz, dann Raise', d: 4 },
      { t: 'Schnell Geld reinholen', d: 1 },
      { t: 'Kommt auf den Hype an', d: -2 },
    ],
  },
  {
    tag: 'Arbeitsstil',
    icon: 'sliders',
    level: 1,
    q: 'Co-Founder antwortet 2 Tage nicht. Was denkst du?',
    opts: [
      { t: 'Red Flag — Tempo zählt', d: 3 },
      { t: 'Nachfragen, vielleicht Stress', d: 1 },
      { t: 'Ist doch normal', d: -3 },
    ],
  },
  {
    tag: 'Risiko',
    icon: 'coin',
    level: 3,
    q: 'Würdest du 2.000 € in einen sauberen MVP stecken?',
    opts: [
      { t: 'Ja, wenn der Plan steht', d: 4 },
      { t: 'Nur mit Partner', d: 2 },
      { t: 'Nein, zu risky', d: -3 },
    ],
  },
  {
    tag: 'Skill-Fit',
    icon: 'idea',
    level: 2,
    q: 'Was brauchst du gerade mehr?',
    opts: [
      { t: 'Umsetzer', d: 3 },
      { t: 'Designer', d: 2 },
      { t: 'Nur Motivation', d: -2 },
    ],
  },
  {
    tag: 'Ambition',
    icon: 'rocket',
    level: 4,
    q: 'Wie hart würdest du 90 Tage pushen?',
    opts: [
      { t: 'Täglich, messbar', d: 4 },
      { t: 'An den Wochenenden', d: 1 },
      { t: 'Wenn ich Lust habe', d: -4 },
    ],
  },
];

export function verdictFor(score: number) {
  if (score >= 85) return 'Electric';
  if (score >= 70) return 'Echtes Potenzial';
  if (score >= 55) return 'Slow Burn';
  return 'Plot Twist';
}
