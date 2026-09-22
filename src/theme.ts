export type Mode = 'human' | 'business';

export const base = {
  ink: '#0B060A',
  ink2: '#140A12',
  card: '#241521',
  card2: '#2E1B29',
  milk: '#FFF4EC',
  dim: 'rgba(255,244,236,0.62)',
  faint: 'rgba(255,244,236,0.34)',
  mute: 'rgba(255,244,236,0.50)',
  line: 'rgba(255,244,236,0.09)',
  line2: 'rgba(255,244,236,0.14)',
  good: '#5CE8A4',
  bad: '#FF6B6B',
  warn: '#FFD166',
};

const accents = {
  human: {
    a1: '#FF3D7F',
    a15: '#FF7550',
    a2: '#FFB03A',
    soft: 'rgba(255,61,127,0.14)',
    glow: 'rgba(255,61,127,0.38)',
    blob1: '#FF3D7F',
    blob2: '#FFB03A',
  },
  business: {
    a1: '#5B6CFF',
    a15: '#45B4FF',
    a2: '#3DE8FF',
    soft: 'rgba(91,108,255,0.16)',
    glow: 'rgba(91,108,255,0.42)',
    blob1: '#5B6CFF',
    blob2: '#3DE8FF',
  },
};

export const radius = {
  card: 26,
  inner: 18,
  tile: 16,
  avatar: 16,
  avatarLg: 24,
  sheet: 34,
  pill: 999,
};

export const font = {
  display: 'Unbounded_900Black',
  displayBold: 'Unbounded_700Bold',
  body: 'SpaceGrotesk_400Regular',
  medium: 'SpaceGrotesk_500Medium',
  bold: 'SpaceGrotesk_700Bold',
};

export type Theme = typeof base & (typeof accents)['human'] & { mode: Mode };

export function themeFor(mode: Mode): Theme {
  return { ...base, ...accents[mode], mode };
}

/** Gradient stops used for accent text, buttons and rings. */
export function accentGradient(t: Theme) {
  return [t.a1, t.a15, t.a2];
}

/** Deterministic avatar gradient per person, so each face reads as its own. */
const avatarGradients: [string, string][] = [
  ['#FF8A5C', '#FFB03A'],
  ['#B08CFF', '#7EA0FF'],
  ['#4FC3E8', '#7EE8C9'],
  ['#9BA3B5', '#6E7685'],
  ['#FF7BAC', '#FF9E6E'],
  ['#7EE8A2', '#3DCF8E'],
  ['#FFD98A', '#FFB03A'],
  ['#8FD8FF', '#5B6CFF'],
];

export function avatarGradient(key: string): [string, string] {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return avatarGradients[h % avatarGradients.length];
}
