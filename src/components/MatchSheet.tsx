import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, View } from 'react-native';
import { bizQuestions, humanQuestions } from '../data/questions';
import { useStore } from '../store';
import { base, font, radius } from '../theme';
import { FazitCard } from './FazitCard';
import { InterestDepth } from './InterestDepth';
import { ScoreBreakdown } from './ScoreBreakdown';
import { useToast } from './Toast';
import {
  Avatar,
  Bar,
  Card,
  GhostButton,
  GradientText,
  IconTile,
  Pill,
  PrimaryButton,
  Row,
  SectionLabel,
  Sparkline,
  Sub,
  styles as ui,
  useTheme,
} from './ui';

export type SheetTarget = { kind: 'connection' | 'biz'; id: string };

export function MatchSheet({
  target,
  delta,
  answeredCount,
  onClose,
  onStartQuestions,
}: {
  target: SheetTarget | null;
  delta: number;
  answeredCount: number;
  onClose: () => void;
  onStartQuestions: (target: SheetTarget) => void;
}) {
  const t = useTheme();
  const { db, blockPerson, reportPerson, scoreFor, recordMeeting } = useStore();
  const { say } = useToast();
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: target ? 1 : 0,
      duration: target ? 420 : 260,
      easing: Easing.bezier(0.2, 0.9, 0.25, 1),
      useNativeDriver: true,
    }).start();
  }, [target, slide]);

  const person =
    target?.kind === 'connection'
      ? db.connections.find((c) => c.id === target.id)
      : target?.kind === 'biz'
        ? db.bizMatches.find((b) => b.id === target.id)
        : undefined;

  if (!target || !person) return null;

  const isBiz = target.kind === 'biz';
  const questions = isBiz ? bizQuestions : humanQuestions;
  const left = Math.max(0, questions.length - answeredCount);
  const scored = scoreFor(target);
  const depthUnlocked = person.score >= 70 || person.meetings >= 2;

  return (
    <>
      <Pressable
        onPress={onClose}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 50 }}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(11,6,10,0.55)',
            opacity: slide,
          }}
        />
      </Pressable>

      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '8%',
          bottom: 0,
          zIndex: 55,
          backgroundColor: '#1E1019',
          borderTopLeftRadius: radius.sheet,
          borderTopRightRadius: radius.sheet,
          borderTopWidth: 1,
          borderColor: base.line,
          shadowColor: '#000',
          shadowOpacity: 0.55,
          shadowRadius: 40,
          shadowOffset: { width: 0, height: -20 },
          elevation: 24,
          transform: [
            {
              translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [900, 0] }),
            },
          ],
        }}
      >
        <Pressable onPress={onClose} hitSlop={12}>
          <View
            style={{
              width: 44,
              height: 5,
              borderRadius: 99,
              backgroundColor: base.line2,
              alignSelf: 'center',
              marginTop: 14,
              marginBottom: 14,
            }}
          />
        </Pressable>

        <View style={{ paddingHorizontal: 22, paddingBottom: 10 }}>
          <Row>
            <Avatar name={person.name} size={64} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ fontFamily: font.displayBold, fontSize: 19, color: base.milk }}>
                {person.name}, {person.age}
              </Text>
              <Text style={[ui.cardSub, { marginTop: 2 }]} numberOfLines={1}>
                {isBiz ? (person as any).role : `Bond Lv. ${(person as any).bond} · ${(person as any).lastBump}`}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <GradientText style={{ fontFamily: font.display, fontSize: 40, letterSpacing: -1 }}>
                {String(person.score)}
              </GradientText>
              {delta !== 0 ? (
                <Text
                  style={{
                    fontFamily: font.displayBold,
                    fontSize: 15,
                    marginLeft: 6,
                    marginTop: 6,
                    color: delta > 0 ? base.good : base.bad,
                  }}
                >
                  {delta > 0 ? '+' : ''}
                  {delta}
                </Text>
              ) : null}
            </View>
          </Row>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 44 }}
          showsVerticalScrollIndicator={false}
        >
          <Card raised style={{ marginTop: 4 }}>
            <Row>
              <IconTile name={isBiz ? 'briefcase' : 'dice'} />
              <View style={{ flex: 1 }}>
                <Text style={ui.cardTitle}>{isBiz ? 'Biz-Fit kalibrieren' : 'Score verschieben'}</Text>
                <Text style={[ui.cardSub, { marginTop: 2 }]}>
                  {left > 0
                    ? isBiz
                      ? `${left} Fragen zu Ambition, Arbeitsstil und Risiko — keine Dating-Fragen.`
                      : `${left} Fragen offen — jede Antwort bewegt euren Score. Traut ihr euch?`
                    : 'Alle Fragen gespielt. Rebump schaltet die nächste Season frei.'}
                </Text>
              </View>
            </Row>
            <PrimaryButton
              title={left > 0 ? (isBiz ? 'Biz-Fragen spielen' : 'Fragen starten') : 'Fertig für heute'}
              icon={left > 0 ? 'boltFill' : 'check'}
              onPress={() => {
                if (left > 0) onStartQuestions(target);
                else say('Für heute durchgespielt — Rebump schaltet neue Fragen frei');
              }}
              style={{ marginTop: 14 }}
            />
          </Card>

          {scored ? <ScoreBreakdown parts={scored.parts} score={person.score} /> : null}

          {scored && scored.answered > 0 ? (
            <>
              <SectionLabel>Fazit</SectionLabel>
              <FazitCard fazit={scored.fazit} />
            </>
          ) : null}

          <SectionLabel>{isBiz ? 'Skill-Fit Matrix' : 'Eure Ebenen'}</SectionLabel>
          {person.levels.map((l) => (
            <Bar
              key={l.name}
              name={l.name}
              value={l.v}
              locked={l.v === null}
              hint={l.v === null ? 'Schaltet frei nach 3 beantworteten Fragen' : undefined}
            />
          ))}

          <SectionLabel>Was {person.name} antreibt</SectionLabel>
          <InterestDepth
            interests={person.interests}
            unlocked={depthUnlocked}
            requirement={`Schaltet frei ab Score 70 oder nach dem zweiten echten Treffen. Aktuell: ${person.score} · ${person.meetings} Treffen.`}
            shared={db.profile.want}
          />

          <SectionLabel>Score-Verlauf</SectionLabel>
          <Card style={{ marginTop: 8 }}>
            <Row>
              <View style={{ flex: 1 }}>
                <Text style={ui.cardTitle}>Seit dem ersten Bump</Text>
                <Text style={[ui.cardSub, { marginTop: 2 }]}>
                  {person.trend.length} Datenpunkte · jetzt {person.score}
                </Text>
              </View>
              <Sparkline points={person.trend} width={90} height={34} />
            </Row>
            <GhostButton
              title="Wir haben uns getroffen"
              icon="repeat"
              onPress={() => {
                const gained = recordMeeting(target);
                say(gained > 0 ? `Konstanz-Bonus: +${gained}` : 'Treffen gespeichert');
              }}
              style={{ marginTop: 14 }}
            />
          </Card>

          <SectionLabel>Vorschläge</SectionLabel>

          {isBiz ? (
            <>
              <SectionLabel>Warum passt es?</SectionLabel>
              <Card style={{ marginTop: 8 }}>
                <Text style={ui.cardSub}>{(person as any).why}</Text>
                <View style={{ flexDirection: 'row', gap: 7, flexWrap: 'wrap', marginTop: 12 }}>
                  {(person as any).skills.map((s: string) => (
                    <Pill key={s} tone="ghost">
                      {s}
                    </Pill>
                  ))}
                </View>
              </Card>

              <SectionLabel>Nächster sinnvoller Schritt</SectionLabel>
              <Card onPress={() => say('15-Minuten Pitch-Call vorgeschlagen')} style={{ marginTop: 8 }}>
                <Row>
                  <IconTile name="calendar" />
                  <View style={{ flex: 1 }}>
                    <Text style={ui.cardTitle}>15-Minuten Pitch-Call</Text>
                    <Text style={[ui.cardSub, { marginTop: 2 }]}>
                      Nur Agenda: Problem, MVP, nächster Test, Verantwortungen.
                    </Text>
                  </View>
                  <Pill tone="hot">Start</Pill>
                </Row>
              </Card>
            </>
          ) : (
            <>
              <SectionLabel>Teach-Match</SectionLabel>
              <Card onPress={() => say('Anfrage geschickt: „Zeigst du mir das mal?“')} style={{ marginTop: 8 }}>
                <Row>
                  <IconTile name="guitar" />
                  <View style={{ flex: 1 }}>
                    <Text style={ui.cardTitle}>
                      {person.name} kann dir {(person as any).teach ?? 'etwas'} beibringen
                    </Text>
                    <Text style={[ui.cardSub, { marginTop: 2 }]}>
                      Passt zu deiner Wunschliste — kein Chat-Spam, nur eine klare Anfrage.
                    </Text>
                  </View>
                </Row>
              </Card>

              <SectionLabel>Duo-Challenge</SectionLabel>
              <Card onPress={() => say('Challenge angenommen! Foto-Beweis gibt +4 Score')} style={{ marginTop: 8 }}>
                <Row>
                  <IconTile name="mountain" />
                  <View style={{ flex: 1 }}>
                    <Text style={ui.cardTitle}>Geht diese Woche zusammen bouldern</Text>
                    <Text style={[ui.cardSub, { marginTop: 2 }]}>Abschließen bringt +4 auf euren Score</Text>
                  </View>
                  <Pill tone="hot">+4</Pill>
                </Row>
              </Card>

              <ShareCard me={db.profile.name} other={person.name} score={person.score} />

              <SectionLabel>Sicherheit</SectionLabel>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                <GhostButton
                  title="Blockieren"
                  icon="block"
                  style={{ flex: 1 }}
                  onPress={() => {
                    blockPerson(target.id);
                    onClose();
                    say(`${person.name} blockiert`);
                  }}
                />
                <GhostButton
                  title="Melden"
                  icon="flag"
                  tone="danger"
                  style={{ flex: 1 }}
                  onPress={() => {
                    reportPerson(target.id);
                    say(`${person.name} gemeldet · Admin-Queue aktualisiert`);
                  }}
                />
              </View>
            </>
          )}
        </ScrollView>
      </Animated.View>
    </>
  );
}

function ShareCard({ me, other, score }: { me: string; other: string; score: number }) {
  const t = useTheme();
  const { say } = useToast();
  return (
    <LinearGradient
      colors={[t.a1, t.a15, t.a2]}
      locations={[0, 0.55, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ marginTop: 16, borderRadius: 24, padding: 22, alignItems: 'center' }}
    >
      <Text
        style={{
          fontFamily: font.bold,
          fontSize: 12,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: base.ink2,
          opacity: 0.75,
        }}
      >
        tapp · Match-Card
      </Text>
      <Text style={{ fontFamily: font.display, fontSize: 44, color: base.ink2, marginTop: 2 }}>{score}%</Text>
      <Text style={{ fontFamily: font.bold, fontSize: 13, color: base.ink2 }}>
        {me} × {other}
      </Text>
      <Pressable
        onPress={() => say('Match-Card als Story exportiert (Demo)')}
        style={{
          width: '100%',
          marginTop: 14,
          paddingVertical: 14,
          borderRadius: radius.inner,
          backgroundColor: base.ink2,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
        }}
      >
        <Text style={{ fontFamily: font.displayBold, fontSize: 13, color: base.milk }}>Als Story teilen</Text>
      </Pressable>
    </LinearGradient>
  );
}
