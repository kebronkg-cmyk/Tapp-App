import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from '../icons';
import { useStore } from '../store';
import { base, font } from '../theme';
import { useToast } from '../components/Toast';
import {
  Card,
  Eyebrow,
  GhostButton,
  Headline,
  IconTile,
  Pill,
  Row,
  SectionLabel,
  Sub,
  styles as ui,
  useTheme,
} from '../components/ui';

export function ActivityScreen({ onCreate }: { onCreate: () => void }) {
  const t = useTheme();
  const { db, joinActivity } = useStore();
  const { say } = useToast();
  const acts = db.activities.filter((a) => a.type === 'human');

  const toggle = (id: string, title: string) => {
    const joined = joinActivity(id);
    say(joined ? `Du bist dabei: ${title}` : 'Zusage entfernt');
  };

  return (
    <>
      <Eyebrow>Über 1 Ecke</Eyebrow>
      <Headline lead="Aktivitäten statt " accent="Randoms" />
      <Sub>
        Stärker als reines „in der Nähe“: Einladungen von Freunden, deren Freunden und Teach-Matches — ohne offene
        Stalking-Profile.
      </Sub>

      <SectionLabel>Diese Woche in deinem Umfeld</SectionLabel>
      {acts.map((a) => (
        <Card key={a.id} onPress={() => toggle(a.id, a.title)} style={{ marginTop: 10 }}>
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
          <View style={{ flexDirection: 'row', gap: 7, flexWrap: 'wrap', marginTop: 11 }}>
            <Pill tone="ghost">Host: {a.host}</Pill>
            <Pill tone="ghost">{a.reward}</Pill>
            <Pill tone="ghost">{a.people.join(' + ')}</Pill>
          </View>
        </Card>
      ))}

      <GhostButton title="Eigene Aktivität ausrufen" icon="megaphone" onPress={onCreate} style={{ marginTop: 14 }} />

      <SectionLabel>Warum über 1 Ecke?</SectionLabel>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
        <Card style={{ flex: 1, marginTop: 0 }}>
          <Icon name="link" size={20} color={t.a2} />
          <Text style={[ui.cardTitle, { marginTop: 10 }]}>Vertrauen</Text>
          <Text style={[ui.cardSub, { marginTop: 6 }]}>
            Jede Einladung kommt über jemanden, den du schon gebumpt hast.
          </Text>
        </Card>
        <Card style={{ flex: 1, marginTop: 0 }}>
          <Icon name="target" size={20} color={t.a2} />
          <Text style={[ui.cardTitle, { marginTop: 10 }]}>Anlass</Text>
          <Text style={[ui.cardSub, { marginTop: 6 }]}>
            Ein Grund zu kommen schlägt jede Chat-Eröffnung.
          </Text>
        </Card>
      </View>
    </>
  );
}
