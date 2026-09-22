import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Polyline, Stop } from 'react-native-svg';
import { Icon, type IconName } from '../icons';
import { useStore } from '../store';
import { accentGradient, avatarGradient, base, font, radius, themeFor, type Theme } from '../theme';

export function useTheme(): Theme {
  const { mode } = useStore();
  return themeFor(mode);
}

/* ---------------------------------------------------------------- text --- */

export function Eyebrow({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.eyebrow, style]}>{children}</Text>;
}

export function SectionLabel({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ marginTop: 22, marginBottom: 4 }, style]}>
      <Text style={styles.section}>{children}</Text>
    </View>
  );
}

export function Sub({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.sub, style]}>{children}</Text>;
}

export function GradientText({
  children,
  style,
  colors,
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  colors?: string[];
}) {
  const t = useTheme();
  const stops = colors ?? accentGradient(t);

  // react-native-web can clip a CSS gradient to the glyphs directly; native
  // needs the gradient masked by a copy of the text.
  if (Platform.OS === 'web') {
    return (
      <Text
        style={[
          style,
          {
            backgroundImage: `linear-gradient(100deg, ${stops.join(', ')})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          } as unknown as TextStyle,
        ]}
      >
        {children}
      </Text>
    );
  }

  return (
    <MaskedView maskElement={<Text style={[style, { backgroundColor: 'transparent' }]}>{children}</Text>}>
      <LinearGradient
        colors={stops as unknown as readonly [string, string, ...string[]]}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 1, y: 0.8 }}
      >
        <Text style={[style, { opacity: 0 }]}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

/**
 * Display headline where the accent part carries the mode gradient. Words are
 * laid out individually because the gradient span is a view on native and
 * cannot be nested inside a Text node.
 */
export function Headline({ lead, accent, tail }: { lead: string; accent?: string; tail?: string }) {
  const parts: { text: string; accent: boolean }[] = [];
  lead
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .forEach((w) => parts.push({ text: w, accent: false }));

  if (accent) {
    const words = accent.trim().split(/\s+/).filter(Boolean);
    words.forEach((w, i) => parts.push({ text: i === words.length - 1 ? w + (tail ?? '') : w, accent: true }));
  } else if (tail) {
    parts.push({ text: tail, accent: false });
  }

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 6 }}>
      {parts.map((p, i) =>
        p.accent ? (
          <GradientText key={`${p.text}-${i}`} style={[styles.big, { marginRight: 8 }]}>
            {p.text}
          </GradientText>
        ) : (
          <Text key={`${p.text}-${i}`} style={[styles.big, { marginRight: 8 }]}>
            {p.text}
          </Text>
        ),
      )}
    </View>
  );
}

/* --------------------------------------------------------------- press --- */

export function Tappable({
  children,
  onPress,
  scaleTo = 0.975,
  style,
  disabled,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) =>
    Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => to(scaleTo)}
      onPressOut={() => to(1)}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>
    </Pressable>
  );
}

/* --------------------------------------------------------------- cards --- */

export function Card({
  children,
  style,
  raised,
  onPress,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  raised?: boolean;
  onPress?: () => void;
}) {
  const t = useTheme();
  const body = raised ? (
    <LinearGradient
      colors={[t.card, t.card2]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.card, style]}
    >
      {children}
    </LinearGradient>
  ) : (
    <View style={[styles.card, { backgroundColor: t.card }, style]}>{children}</View>
  );

  if (!onPress) return body;
  return <Tappable onPress={onPress}>{body}</Tappable>;
}

export function Row({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12 }, style]}>{children}</View>;
}

export function IconTile({ name, size = 46, icon = 22 }: { name: IconName; size?: number; icon?: number }) {
  const t = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius.tile,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: t.soft,
        borderWidth: 1,
        borderColor: base.line,
      }}
    >
      <Icon name={name} size={icon} color={t.a2} />
    </View>
  );
}

export function Avatar({ name, size = 46, radiusOverride }: { name: string; size?: number; radiusOverride?: number }) {
  const [c1, c2] = avatarGradient(name);
  const r = radiusOverride ?? (size >= 64 ? radius.avatarLg : radius.avatar);
  return (
    <LinearGradient
      colors={[c1, c2]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={{ width: size, height: size, borderRadius: r, alignItems: 'center', justifyContent: 'center' }}
    >
      <Text style={{ fontFamily: font.displayBold, fontSize: size * 0.36, color: base.ink2 }}>
        {name.charAt(0).toUpperCase()}
      </Text>
    </LinearGradient>
  );
}

/* --------------------------------------------------------------- pills --- */

type PillTone = 'soft' | 'ghost' | 'hot' | 'good' | 'bad';

export function Pill({
  children,
  tone = 'soft',
  icon,
  onPress,
}: {
  children: React.ReactNode;
  tone?: PillTone;
  icon?: IconName;
  onPress?: () => void;
}) {
  const t = useTheme();
  const label = (color: string) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      {icon ? <Icon name={icon} size={12} color={color} strokeWidth={2} /> : null}
      <Text style={[styles.pillText, { color }]}>{children}</Text>
    </View>
  );

  let content: React.ReactNode;
  if (tone === 'hot') {
    content = (
      <LinearGradient
        colors={[t.a1, t.a2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.pill}
      >
        {label(base.ink2)}
      </LinearGradient>
    );
  } else {
    const map: Record<Exclude<PillTone, 'hot'>, { bg: string; border: string; color: string }> = {
      soft: { bg: t.soft, border: 'transparent', color: base.milk },
      ghost: { bg: 'transparent', border: base.line2, color: base.dim },
      good: { bg: 'rgba(92,232,164,0.14)', border: 'rgba(92,232,164,0.22)', color: base.good },
      bad: { bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.2)', color: base.bad },
    };
    const v = map[tone];
    content = (
      <View style={[styles.pill, { backgroundColor: v.bg, borderWidth: 1, borderColor: v.border }]}>
        {label(v.color)}
      </View>
    );
  }

  if (!onPress) return content;
  return (
    <Tappable onPress={onPress} scaleTo={0.94}>
      {content}
    </Tappable>
  );
}

/* ------------------------------------------------------------- buttons --- */

export function PrimaryButton({
  title,
  onPress,
  icon,
  style,
}: {
  title: string;
  onPress?: () => void;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  return (
    <Tappable onPress={onPress} scaleTo={0.97} style={style}>
      <LinearGradient
        colors={[t.a1, t.a15, t.a2]}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.6 }}
        style={[
          styles.btn,
          { shadowColor: t.a1, shadowOpacity: 0.45, shadowRadius: 22, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
        ]}
      >
        {icon ? <Icon name={icon} size={18} color={base.ink2} strokeWidth={2.1} /> : null}
        <Text style={[styles.btnText, { color: base.ink2 }]}>{title}</Text>
      </LinearGradient>
    </Tappable>
  );
}

export function GhostButton({
  title,
  onPress,
  icon,
  tone,
  style,
}: {
  title: string;
  onPress?: () => void;
  icon?: IconName;
  tone?: 'danger';
  style?: StyleProp<ViewStyle>;
}) {
  const color = tone === 'danger' ? base.bad : base.milk;
  return (
    <Tappable onPress={onPress} scaleTo={0.97} style={style}>
      <View style={[styles.btn, styles.btnGhost]}>
        {icon ? <Icon name={icon} size={17} color={color} strokeWidth={2} /> : null}
        <Text style={[styles.btnText, { fontSize: 13, color }]}>{title}</Text>
      </View>
    </Tappable>
  );
}

/* --------------------------------------------------------------- meter --- */

/** Animated horizontal value bar. */
export function Bar({ name, value, locked, hint }: { name: string; value: number | null; locked?: boolean; hint?: string }) {
  const t = useTheme();
  const w = useRef(new Animated.Value(value ?? 100)).current;

  useEffect(() => {
    Animated.timing(w, {
      toValue: value ?? 100,
      duration: 900,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [value, w]);

  const width = w.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={{ marginTop: 13 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        {locked ? <Icon name="lock" size={13} color={base.mute} strokeWidth={2} /> : null}
        <Text style={{ fontFamily: font.bold, fontSize: 13.5, color: base.milk }}>{name}</Text>
        <View style={{ flex: 1 }} />
        <Text style={{ fontFamily: font.displayBold, fontSize: 12, color: base.dim }}>
          {value === null ? '???' : value}
        </Text>
      </View>
      <View style={{ height: 8, borderRadius: 99, backgroundColor: base.line, overflow: 'hidden' }}>
        <Animated.View style={{ width, height: '100%' }}>
          {value === null ? (
            <View style={{ flex: 1, backgroundColor: 'rgba(255,244,236,0.12)', borderRadius: 99 }} />
          ) : (
            <LinearGradient
              colors={[t.a1, t.a2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1, borderRadius: 99 }}
            />
          )}
        </Animated.View>
      </View>
      {hint ? <Text style={{ color: base.mute, fontSize: 11.5, marginTop: 5 }}>{hint}</Text> : null}
    </View>
  );
}

/** Circular score ring with the mode gradient. */
export function Meter({ value, size = 52 }: { value: number; size?: number }) {
  const t = useTheme();
  const stroke = 4;
  const r = size / 2 - stroke / 2 - 2;
  const c = 2 * Math.PI * r;
  const id = `meter-${t.mode}`;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Defs>
          <SvgGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={t.a1} />
            <Stop offset="1" stopColor={t.a2} />
          </SvgGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={base.line} strokeWidth={stroke} />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.max(0, Math.min(100, value)) / 100)}
        />
      </Svg>
      <Text
        style={{
          position: 'absolute',
          fontFamily: font.displayBold,
          fontSize: size * 0.25,
          color: base.milk,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

export function Sparkline({ points, width = 64, height = 26 }: { points: number[]; width?: number; height?: number }) {
  const t = useTheme();
  const data = points.length > 1 ? points : [points[0] ?? 0, points[0] ?? 0];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const rng = max - min || 1;
  const d = data
    .map((v, i) => `${((i / (data.length - 1)) * 64).toFixed(1)},${(24 - ((v - min) / rng) * 20).toFixed(1)}`)
    .join(' ');
  return (
    <Svg width={width} height={height} viewBox="0 0 64 26">
      <Polyline points={d} fill="none" stroke={t.a2} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/* --------------------------------------------------------------- misc --- */

export function Divider() {
  return <View style={{ height: 1, backgroundColor: 'rgba(255,244,236,0.07)' }} />;
}

export const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: font.bold,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: base.faint,
    marginBottom: 8,
  },
  section: {
    fontFamily: font.bold,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: base.faint,
  },
  big: {
    fontFamily: font.display,
    fontSize: 29,
    lineHeight: 33,
    letterSpacing: -0.5,
    color: base.milk,
  },
  sub: {
    fontFamily: font.body,
    fontSize: 14.5,
    lineHeight: 21,
    color: base.dim,
  },
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: base.line,
    padding: 18,
    marginTop: 12,
  },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontFamily: font.bold,
    fontSize: 11.5,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: radius.inner,
  },
  btnGhost: {
    backgroundColor: base.card,
    borderWidth: 1,
    borderColor: 'rgba(255,244,236,0.12)',
    paddingVertical: 14,
  },
  btnText: {
    fontFamily: font.displayBold,
    fontSize: 14,
    color: base.milk,
  },
  cardTitle: {
    fontFamily: font.bold,
    fontSize: 14.5,
    color: base.milk,
  },
  cardSub: {
    fontFamily: font.body,
    fontSize: 12.5,
    lineHeight: 17,
    color: base.dim,
  },
  name: {
    fontFamily: font.bold,
    fontSize: 15,
    color: base.milk,
  },
  nameSub: {
    fontFamily: font.body,
    fontSize: 12,
    color: base.mute,
  },
});
