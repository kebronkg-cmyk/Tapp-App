import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { Icon } from '../icons';
import { useStore } from '../store';
import { verdictFor } from '../data/questions';
import { avatarGradient, base, font, radius } from '../theme';
import { Eyebrow, GhostButton, GradientText, PrimaryButton, Sub, useTheme } from './ui';

type Stage = 'search' | 'collide' | 'count' | 'reveal';

export function BumpOverlay({
  visible,
  onClose,
  onOpenDetail,
}: {
  visible: boolean;
  onClose: () => void;
  onOpenDetail: (target: { kind: 'connection' | 'biz'; id: string }) => void;
}) {
  const t = useTheme();
  const { db, mode, recordBump } = useStore();
  const [stage, setStage] = useState<Stage>('search');
  const [count, setCount] = useState(3);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const fade = useRef(new Animated.Value(0)).current;

  const partner = useMemo(() => {
    if (mode === 'business') {
      const b = db.bizMatches[0];
      return { name: b.name, score: b.score, target: { kind: 'biz' as const, id: b.id } };
    }
    const c = db.connections.find((x) => x.id === 'c3') ?? db.connections[0];
    return { name: c.name, score: c.score, target: { kind: 'connection' as const, id: c.id } };
  }, [db.bizMatches, db.connections, mode]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const runSearch = useCallback(() => {
    setStage('search');
    later(2400, () => {
      setStage('collide');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      later(1250, () => {
        setStage('count');
        setCount(3);
        later(750, () => setCount(2));
        later(1500, () => setCount(1));
        later(2250, () => {
          setStage('reveal');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          recordBump(partner.name, partner.score);
        });
      });
    });
  }, [later, partner.name, partner.score, recordBump]);

  useEffect(() => {
    if (visible) {
      setCount(3);
      Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: true }).start();
      runSearch();
    } else {
      clearTimers();
      Animated.timing(fade, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
    return clearTimers;
    // runSearch is stable for a given partner; re-running it on every change would restart the bump.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        backgroundColor: base.ink2,
        opacity: fade,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={['#1C0D14', base.ink2]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />

      {stage === 'reveal' ? <Confetti /> : null}

      <Pressable
        onPress={onClose}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: base.card,
          borderWidth: 1,
          borderColor: 'rgba(255,244,236,0.12)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
        }}
        hitSlop={8}
      >
        <Icon name="close" size={14} color="rgba(255,244,236,0.7)" />
      </Pressable>

      <View style={{ width: '100%', alignItems: 'center', paddingHorizontal: 24 }}>
        {stage === 'search' ? (
          <SearchStage initial={db.profile.name.charAt(0).toUpperCase()} mode={mode} />
        ) : stage === 'collide' ? (
          <CollideStage me={db.profile.name} other={partner.name} />
        ) : stage === 'count' ? (
          <CountStage n={count} />
        ) : (
          <RevealStage
            me={db.profile.name}
            other={partner.name}
            score={partner.score}
            onDetail={() => {
              onClose();
              onOpenDetail(partner.target);
            }}
            onClose={onClose}
          />
        )}
      </View>
    </Animated.View>
  );
}

/* -------------------------------------------------------------- search --- */

/**
 * Proximity search. Framed the way the real thing will work: the phones find
 * each other by being held together, no code and nothing to scan.
 */
function SearchStage({ initial, mode }: { initial: string; mode: string }) {
  const t = useTheme();
  return (
    <View style={{ alignItems: 'center' }}>
      <Eyebrow>{mode === 'human' ? 'Bump' : 'Biz-Bump'}</Eyebrow>
      <View style={{ width: 230, height: 230, alignItems: 'center', justifyContent: 'center' }}>
        <Wave delay={0} color={t.a1} />
        <Wave delay={600} color={t.a1} />
        <Wave delay={1200} color={t.a1} />
        <LinearGradient
          colors={[t.a1, t.a2]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={{ width: 86, height: 86, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontFamily: font.display, fontSize: 34, color: base.ink2 }}>{initial}</Text>
        </LinearGradient>
      </View>

      <Text
        style={{
          fontFamily: font.display,
          fontSize: 27,
          lineHeight: 31,
          letterSpacing: -0.5,
          color: base.milk,
          textAlign: 'center',
          marginTop: 24,
        }}
      >
        Handy an Handy
      </Text>
      <GradientText style={{ fontFamily: font.display, fontSize: 27, letterSpacing: -0.5, textAlign: 'center' }}>
        halten.
      </GradientText>

      <Sub style={{ marginTop: 10, textAlign: 'center', paddingHorizontal: 20 }}>
        Kein Code, nichts zu scannen. tapp erkennt, wenn zwei Handys sich berühren.
      </Sub>

      <SearchPulse />
    </View>
  );
}

/** Live status line while the two devices look for each other. */
function SearchPulse() {
  const t = useTheme();
  const a = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(a, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(a, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [a]);

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 22,
        opacity: a.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] }),
      }}
    >
      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: t.a2 }} />
      <Text
        style={{
          fontFamily: font.bold,
          fontSize: 12.5,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          color: base.dim,
        }}
      >
        Suche Gegenüber
      </Text>
    </Animated.View>
  );
}

function Wave({ delay, color }: { delay: number; color: string }) {
  const a = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(a, { toValue: 1, duration: 1800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(a, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [a, delay]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: 230,
        height: 230,
        borderRadius: 115,
        borderWidth: 2,
        borderColor: color,
        opacity: a.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] }),
        transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1.15] }) }],
      }}
    />
  );
}

/* ------------------------------------------------------------- collide --- */

function CollideStage({ me, other }: { me: string; other: string }) {
  const t = useTheme();
  const slide = useRef(new Animated.Value(0)).current;
  const shock = useRef(new Animated.Value(0)).current;
  const label = useRef(new Animated.Value(0)).current;
  const [meC1, meC2] = [t.a1, t.a2];
  const [oC1, oC2] = avatarGradient(other);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(slide, {
        toValue: 1,
        duration: 550,
        easing: Easing.bezier(0.6, -0.2, 0.3, 1.3),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(shock, { toValue: 1, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.spring(label, { toValue: 1, useNativeDriver: true, speed: 12, bounciness: 14 }),
      ]),
    ]).start();
  }, [slide, shock, label]);

  const avatar = (colors: [string, string], name: string, from: number) => (
    <Animated.View
      style={{
        position: 'absolute',
        transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [from, from > 0 ? 46 : -46] }) }],
      }}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={{ width: 86, height: 86, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ fontFamily: font.display, fontSize: 34, color: base.ink2 }}>
          {name.charAt(0).toUpperCase()}
        </Text>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <View style={{ height: 150, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        {avatar([meC1, meC2], me, -190)}
        {avatar([oC1, oC2], other, 190)}
        <Animated.View
          style={{
            position: 'absolute',
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 3,
            borderColor: t.a2,
            opacity: shock.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
            transform: [{ scale: shock.interpolate({ inputRange: [0, 1], outputRange: [0.5, 9] }) }],
          }}
        />
      </View>
      <Animated.Text
        style={{
          fontFamily: font.displayBold,
          fontSize: 17,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: base.milk,
          marginTop: 20,
          opacity: label,
          transform: [{ scale: label.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }],
        }}
      >
        {other} gefunden!
      </Animated.Text>
    </View>
  );
}

/* --------------------------------------------------------------- count --- */

function CountStage({ n }: { n: number }) {
  const a = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    a.setValue(0);
    Animated.spring(a, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 16 }).start();
  }, [n, a]);

  return (
    <View style={{ alignItems: 'center' }}>
      <Animated.View
        style={{
          opacity: a,
          transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }],
        }}
      >
        <GradientText style={{ fontFamily: font.display, fontSize: 88, lineHeight: 100 }}>{String(n)}</GradientText>
      </Animated.View>
      <Sub style={{ marginTop: 8 }}>Wie gut passt ihr…?</Sub>
    </View>
  );
}

/* -------------------------------------------------------------- reveal --- */

function RevealStage({
  me,
  other,
  score,
  onDetail,
  onClose,
}: {
  me: string;
  other: string;
  score: number;
  onDetail: () => void;
  onClose: () => void;
}) {
  const slam = useRef(new Animated.Value(0)).current;
  const rest = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slam, { toValue: 1, useNativeDriver: true, speed: 10, bounciness: 16 }),
      Animated.sequence([
        Animated.delay(260),
        Animated.timing(rest, { toValue: 1, duration: 420, useNativeDriver: true }),
      ]),
    ]).start();
  }, [slam, rest]);

  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <Sub style={{ marginBottom: 6 }}>
        {me} × {other}
      </Sub>
      <Animated.View
        style={{
          opacity: slam,
          transform: [{ scale: slam.interpolate({ inputRange: [0, 1], outputRange: [2.4, 1] }) }],
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <GradientText style={{ fontFamily: font.display, fontSize: 100, lineHeight: 112, letterSpacing: -3 }}>
            {String(score)}
          </GradientText>
          <GradientText style={{ fontFamily: font.display, fontSize: 40, lineHeight: 70 }}>%</GradientText>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: rest, alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: font.displayBold,
            fontSize: 17,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: base.milk,
            marginTop: 12,
          }}
        >
          {verdictFor(score)}
        </Text>
        <Sub style={{ marginTop: 8, textAlign: 'center', paddingHorizontal: 20 }}>
          Das ist erst der Start-Score. Fragen, Rebumps und echte Aktivitäten verschieben ihn.
        </Sub>
      </Animated.View>

      <Animated.View style={{ opacity: rest, width: '100%', marginTop: 30 }}>
        <PrimaryButton title="Kompatibilität ansehen" icon="target" onPress={onDetail} />
        <GhostButton title="Später" onPress={onClose} style={{ marginTop: 10 }} />
      </Animated.View>
    </View>
  );
}

/* ------------------------------------------------------------ confetti --- */

function Confetti() {
  const t = useTheme();
  const pieces = useMemo(
    () =>
      Array.from({ length: 38 }, (_, i) => ({
        key: i,
        left: Math.random() * 100,
        color: [t.a1, t.a2, base.milk][i % 3],
        round: Math.random() > 0.5,
        duration: 1400 + Math.random() * 1400,
        delay: Math.random() * 400,
        spin: Math.random() > 0.5 ? 1 : -1,
      })),
    [t.a1, t.a2],
  );

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} pointerEvents="none">
      {pieces.map(({ key, ...p }) => (
        <Piece key={key} {...p} />
      ))}
    </View>
  );
}

function Piece({
  left,
  color,
  round,
  duration,
  delay,
  spin,
}: {
  left: number;
  color: string;
  round: boolean;
  duration: number;
  delay: number;
  spin: number;
}) {
  const a = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(a, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true }),
    ]).start();
  }, [a, duration, delay]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: -20,
        left: `${left}%`,
        width: 10,
        height: 14,
        borderRadius: round ? 7 : 3,
        backgroundColor: color,
        opacity: a.interpolate({ inputRange: [0, 0.85, 1], outputRange: [0.95, 0.95, 0.6] }),
        transform: [
          { translateY: a.interpolate({ inputRange: [0, 1], outputRange: [0, 900] }) },
          {
            rotate: a.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', `${spin * 800}deg`],
            }),
          },
        ],
      }}
    />
  );
}
