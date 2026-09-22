import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { Icon } from '../icons';
import { useStore } from '../store';
import { base, font, radius } from '../theme';
import { useToast } from '../components/Toast';
import {
  Card,
  Eyebrow,
  GradientText,
  Headline,
  IconTile,
  Meter,
  Pill,
  PrimaryButton,
  Row,
  SectionLabel,
  Sub,
  Tappable,
  styles as ui,
  useTheme,
} from '../components/ui';

export function HomeScreen({ onBump }: { onBump: () => void }) {
  const t = useTheme();
  const { db, mode } = useStore();
  const { say } = useToast();
  const human = mode === 'human';

  const liveCount = db.nearby.filter((n) => n.status === 'live' || n.status === 'rebump').length;
  const feed = db.feed.filter((f) => f.mode === 'both' || f.mode === mode);

  return (
    <>
      <Eyebrow>
        {human ? `Freitagabend · ${liveCount} Bump-Chancen in deiner Nähe` : 'Biz-Modus · 2 Ambition-Matches in der Nähe'}
      </Eyebrow>

      {human ? (
        <Headline lead="Nicht suchen. " accent="Echt treffen." />
      ) : (
        <Headline lead="Wer baut mit dir was " accent="Großes" tail="?" />
      )}

      <Sub>
        {human
          ? '„Leute in der Nähe“ ist kein Feed, sondern ein Live-Hinweis: Hier lohnt sich Handy an Handy, weil echte Bumps gerade wahrscheinlich sind.'
          : 'Gleiche Vision treffen, Skills abgleichen, Ideen funden — der Bump bleibt derselbe, bewertet aber Ambition und Arbeitsstil.'}
      </Sub>

      <Card raised style={{ marginTop: 16 }}>
        <Row>
          <Heartbeat>
            <LinearGradient
              colors={[t.a1, t.a2]}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={{ width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name={human ? 'boltFill' : 'briefcase'} size={human ? 30 : 28} color={base.ink2} strokeWidth={2} />
            </LinearGradient>
          </Heartbeat>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: font.displayBold, fontSize: 16, color: base.milk }}>
              {human ? `${liveCount} echte Bump-Chancen` : 'Biz-Bump bereit'}
            </Text>
            <Text style={[ui.cardSub, { marginTop: 2 }]}>
              {human
                ? 'Keine Profile stalken. Erst bumpen, dann sichtbar.'
                : 'Pitch bleibt privat bis Biz-Match ab 70.'}
            </Text>
          </View>
        </Row>
        <PrimaryButton
          title={human ? 'Jetzt bumpen' : 'Biz-Bump starten'}
          icon="boltFill"
          onPress={onBump}
          style={{ marginTop: 16 }}
        />
      </Card>

      <SectionLabel>Live in deiner Nähe</SectionLabel>
      {db.nearby.map((n) => (
        <Card
          key={n.id}
          onPress={() => say(`Erst ein echter Bump schaltet ${n.name} frei`)}
          style={{ marginTop: 10 }}
        >
          <Row>
            <IconTile name={n.status === 'rebump' ? 'repeat' : 'pin'} />
            <View style={{ flex: 1 }}>
              <Text style={ui.cardTitle}>{n.status === 'rebump' ? 'Rebump möglich' : 'Bump-Chance'}</Text>
              <Text style={[ui.cardSub, { marginTop: 2 }]}>
                {n.dist} · {n.why}
              </Text>
              <Text style={[ui.nameSub, { marginTop: 3 }]}>{n.mutual}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 8 }}>
              <Pill tone={n.status === 'rebump' ? 'hot' : n.status === 'weak' ? 'ghost' : 'soft'}>
                {n.status === 'weak' ? 'schwach' : 'live'}
              </Pill>
              <Icon name="lock" size={15} color={base.faint} strokeWidth={2} />
            </View>
          </Row>
        </Card>
      ))}

      <SectionLabel>Gerade passiert</SectionLabel>
      <View
        style={{
          backgroundColor: base.card,
          borderWidth: 1,
          borderColor: base.line,
          borderRadius: radius.card,
          paddingHorizontal: 18,
          paddingVertical: 6,
          marginTop: 8,
        }}
      >
        {feed.map((f, i) => (
          <View
            key={f.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingVertical: 12,
              borderBottomWidth: i === feed.length - 1 ? 0 : 1,
              borderBottomColor: 'rgba(255,244,236,0.07)',
            }}
          >
            <LinearGradient
              colors={[t.a1, t.a2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 8, height: 8, borderRadius: 4 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: font.bold, fontSize: 13.5, color: base.milk }}>{f.title}</Text>
              <Text style={{ fontFamily: font.body, fontSize: 12, color: base.mute, marginTop: 1 }}>{f.sub}</Text>
            </View>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: 11,
                color: f.tone === 'good' ? base.good : base.faint,
              }}
            >
              {f.meta}
            </Text>
          </View>
        ))}
      </View>

      <SectionLabel>Diese Woche</SectionLabel>
      <Card onPress={() => say('Fragen-Seasons rotieren wöchentlich')} style={{ marginTop: 8 }}>
        <Row>
          <IconTile name={human ? 'flame' : 'trend'} />
          <View style={{ flex: 1 }}>
            <Text style={ui.cardTitle}>
              {human ? 'Neue Fragen-Season: „Locked In“' : 'Pitch-Season: „Bootstrap oder Raise?“'}
            </Text>
            <Text style={[ui.cardSub, { marginTop: 2 }]}>
              {human ? 'Gym, Ziele, Humor — 12 frische Fragen' : 'Neue Founder-Fragen · Ambition kalibrieren'}
            </Text>
          </View>
          <Pill tone="hot">NEU</Pill>
        </Row>
      </Card>

      <Card
        onPress={() => say('Rebump: Euer Score lebt weiter, wenn ihr euch wiederseht')}
        style={{ marginTop: 12 }}
      >
        <Row>
          <IconTile name="repeat" />
          <View style={{ flex: 1 }}>
            <Text style={ui.cardTitle}>Rebump mit Jonas fällig</Text>
            <Text style={[ui.cardSub, { marginTop: 2 }]}>Euer Bond-Level steigt bei jedem echten Treffen</Text>
          </View>
          <Pill tone="ghost">Tag 6</Pill>
        </Row>
      </Card>

      <SectionLabel>{human ? 'Warum „Nähe“ hier anders ist' : 'Warum Biz-Bump statt Netzwerk-Feed'}</SectionLabel>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
        <Card style={{ flex: 1, marginTop: 0 }}>
          <Icon name="clock" size={20} color={t.a2} />
          <Text style={[ui.cardTitle, { marginTop: 10 }]}>{human ? 'Timing' : 'Proof'}</Text>
          <Text style={[ui.cardSub, { marginTop: 6 }]}>
            {human
              ? 'Die App zeigt, wann echte Begegnungen wahrscheinlich sind.'
              : 'Ambition zeigt sich an dem, was jemand schon gebaut hat.'}
          </Text>
        </Card>
        <Card style={{ flex: 1, marginTop: 0 }}>
          <Icon name="shield" size={20} color={t.a2} />
          <Text style={[ui.cardTitle, { marginTop: 10 }]}>Sicherheit</Text>
          <Text style={[ui.cardSub, { marginTop: 6 }]}>
            {human
              ? 'Keine exakten Orte, keine Swipe-Jagd, Details erst nach dem Bump.'
              : 'Dein Pitch bleibt im Vault, bis der Score stimmt.'}
          </Text>
        </Card>
      </View>
    </>
  );
}

/** Slow double-beat, like the prototype's pulsing bump tile. */
function Heartbeat({ children }: { children: React.ReactNode }) {
  const a = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(a, { toValue: 1, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(a, { toValue: 0, duration: 260, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(a, { toValue: 0.7, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(a, { toValue: 0, duration: 260, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.delay(1400),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [a]);

  return (
    <Animated.View
      style={{ transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }] }}
    >
      {children}
    </Animated.View>
  );
}
