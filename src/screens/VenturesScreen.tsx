import React from 'react';
import { Text, View } from 'react-native';
import { useStore } from '../store';
import { base, font } from '../theme';
import { useToast } from '../components/Toast';
import {
  Avatar,
  Card,
  Eyebrow,
  GhostButton,
  Headline,
  IconTile,
  Meter,
  Pill,
  Row,
  SectionLabel,
  Sub,
  styles as ui,
} from '../components/ui';

export function VenturesScreen({
  onOpenBiz,
  onCreate,
}: {
  onOpenBiz: (id: string) => void;
  onCreate: () => void;
}) {
  const { db, joinActivity } = useStore();
  const { say } = useToast();
  const bizActs = db.activities.filter((a) => a.type === 'business');

  return (
    <>
      <Eyebrow>Ventures</Eyebrow>
      <Headline lead="Co-Founder statt " accent="Smalltalk" />
      <Sub>
        Kein LinkedIn-Klon: erst echter Bump, dann Skill-Fit, Pitch-Vault und ein konkreter nächster Schritt.
      </Sub>

      <SectionLabel>Idea Vault</SectionLabel>
      {db.ideas.map((i) => (
        <Card key={i.id} raised style={{ marginTop: 10 }}>
          <Row>
            <IconTile name={i.icon} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: font.displayBold, fontSize: 15, color: base.milk }}>{i.title}</Text>
              <Text style={[ui.cardSub, { marginTop: 2 }]}>
                {i.stage} · {i.private ? 'privat bis Match ab 70' : 'öffentlich'}
              </Text>
            </View>
          </Row>
          <Text style={[ui.cardSub, { marginTop: 10 }]}>{i.pitch}</Text>
          <View style={{ flexDirection: 'row', gap: 7, flexWrap: 'wrap', marginTop: 11 }}>
            {i.needs.map((n) => (
              <Pill key={n} tone="ghost">
                sucht {n}
              </Pill>
            ))}
            <Pill tone="good">{i.signals} Interessenten</Pill>
            <Pill tone="soft">{i.funding} Funding-Signale</Pill>
          </View>
          <GhostButton
            title="Pitch bearbeiten"
            icon="sliders"
            onPress={() => say('Idea Vault: Pitch sichtbar nur für Biz-Matches ab 70')}
            style={{ marginTop: 14 }}
          />
        </Card>
      ))}

      <SectionLabel>Biz-Matches in deiner Nähe</SectionLabel>
      {db.bizMatches.map((b) => (
        <Card key={b.id} onPress={() => onOpenBiz(b.id)} style={{ marginTop: 10 }}>
          <Row>
            <Avatar name={b.name} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={ui.name}>
                {b.name}, {b.age}
              </Text>
              <Text style={[ui.nameSub, { marginTop: 2 }]}>{b.role}</Text>
              <Text style={[ui.nameSub, { marginTop: 2 }]} numberOfLines={2}>
                {b.why}
              </Text>
            </View>
            <Meter value={b.score} />
          </Row>
          <View style={{ flexDirection: 'row', gap: 7, flexWrap: 'wrap', marginTop: 10 }}>
            {b.skills.map((s) => (
              <Pill key={s} tone="ghost">
                {s}
              </Pill>
            ))}
          </View>
        </Card>
      ))}

      <SectionLabel>Biz-Aktivitäten über 1 Ecke</SectionLabel>
      {bizActs.map((a) => (
        <Card
          key={a.id}
          onPress={() => {
            const joined = joinActivity(a.id);
            say(joined ? `Du bist dabei: ${a.title}` : 'Zusage entfernt');
          }}
          style={{ marginTop: 10 }}
        >
          <Row>
            <IconTile name={a.icon} />
            <View style={{ flex: 1 }}>
              <Text style={ui.cardTitle}>{a.title}</Text>
              <Text style={[ui.cardSub, { marginTop: 2 }]}>
                {a.time} · {a.via}
              </Text>
            </View>
            <Pill tone={a.joined ? 'good' : 'hot'} icon={a.joined ? 'check' : undefined}>
              {a.joined ? 'Dabei' : `${a.spots} frei`}
            </Pill>
          </Row>
        </Card>
      ))}

      <GhostButton
        title="Eigenes Biz-Event ausrufen"
        icon="megaphone"
        onPress={onCreate}
        style={{ marginTop: 14 }}
      />
    </>
  );
}
