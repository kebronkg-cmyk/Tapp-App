import React from 'react';
import { Text, View } from 'react-native';
import { useStore } from '../store';
import { base, font } from '../theme';
import { useToast } from '../components/Toast';
import {
  Avatar,
  Bar,
  Card,
  Eyebrow,
  GhostButton,
  IconTile,
  Pill,
  Row,
  SectionLabel,
  styles as ui,
} from '../components/ui';
import type { ValueKey } from '../data/types';

export function ProfileScreen({
  onEditList,
  onOpenPrivacy,
}: {
  onEditList: (field: 'want' | 'teach') => void;
  onOpenPrivacy: () => void;
}) {
  const { db, mode, resetDemo } = useStore();
  const { say } = useToast();
  const p = db.profile;

  return (
    <>
      <Eyebrow>Du</Eyebrow>
      <Row style={{ marginTop: 4, gap: 14 }}>
        <Avatar name={p.name} size={72} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: font.display, fontSize: 24, letterSpacing: -0.5, color: base.milk }}>
            {p.name}
          </Text>
          <Text style={[ui.cardSub, { marginTop: 2 }]}>
            {p.city} · {p.age} · {mode === 'human' ? 'Human' : 'Biz'}-Modus
          </Text>
        </View>
      </Row>

      <SectionLabel>Will ich mehr machen</SectionLabel>
      <Card style={{ marginTop: 8 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {p.want.map((x) => (
            <Pill key={x} tone="soft">
              {x}
            </Pill>
          ))}
          <Pill tone="ghost" icon="plus" onPress={() => onEditList('want')}>
            ändern
          </Pill>
        </View>
        <Text style={[ui.cardSub, { marginTop: 12 }]}>
          Steuert Teach-Matches und die Aktivitäten, die dir über 1 Ecke vorgeschlagen werden.
        </Text>
      </Card>

      <SectionLabel>Kann ich beibringen</SectionLabel>
      <Card style={{ marginTop: 8 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {p.teach.map((x) => (
            <Pill key={x} tone="soft">
              {x}
            </Pill>
          ))}
          <Pill tone="ghost" icon="plus" onPress={() => onEditList('teach')}>
            ändern
          </Pill>
        </View>
      </Card>

      <SectionLabel>Deine Werte-DNA</SectionLabel>
      <Card style={{ marginTop: 8 }}>
        <Text style={ui.cardSub}>
          Aus deinen tiefen Fragen. Nur du siehst das Detail — Matches sehen nur die Übereinstimmung.
        </Text>
        {(Object.keys(p.values) as ValueKey[]).map((k) => (
          <Bar key={k} name={k} value={p.values[k]} />
        ))}
      </Card>

      <SectionLabel>Privacy & Sicherheit</SectionLabel>
      <Card style={{ marginTop: 8 }}>
        <Row style={{ alignItems: 'flex-start' }}>
          <IconTile name="lock" />
          <View style={{ flex: 1 }}>
            <Text style={ui.cardTitle}>Privat by Design</Text>
            <Text style={[ui.cardSub, { marginTop: 3 }]}>
              Sichtbarkeit: {p.privacy}. Dein Profil bleibt auf dem Gerät — der Abgleich passiert beim Bump.
            </Text>
          </View>
        </Row>
        <GhostButton title="Einstellungen öffnen" icon="sliders" onPress={onOpenPrivacy} style={{ marginTop: 14 }} />
      </Card>

      <SectionLabel>Demo-Daten</SectionLabel>
      <Card style={{ marginTop: 8 }}>
        <Row>
          <View style={{ flex: 1 }}>
            <Text style={ui.cardTitle}>Moderation & Speicher</Text>
            <Text style={[ui.cardSub, { marginTop: 3 }]}>
              {db.flags.length} Reports · {db.bumps.length} Bumps · {db.answered} Antworten lokal gespeichert
            </Text>
          </View>
          <Pill
            tone="ghost"
            icon="reset"
            onPress={() => {
              resetDemo();
              say('Demo zurückgesetzt');
            }}
          >
            Reset
          </Pill>
        </Row>
      </Card>
    </>
  );
}
