import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from '../icons';
import { useStore } from '../store';
import { base, font, radius } from '../theme';
import {
  Avatar,
  Card,
  Eyebrow,
  GradientText,
  Headline,
  IconTile,
  Meter,
  Pill,
  Row,
  SectionLabel,
  Sparkline,
  Sub,
  styles as ui,
  useTheme,
} from '../components/ui';

export function CircleScreen({ onOpenPerson }: { onOpenPerson: (id: string) => void }) {
  const t = useTheme();
  const { db, connectorScore } = useStore();
  const list = db.connections.filter((c) => !c.blocked);
  const joined = db.activities.filter((a) => a.joined).length;

  return (
    <>
      <Eyebrow>Dein Circle</Eyebrow>
      <Headline lead="Score lebt durch " accent="Rebumps" />
      <Sub>
        Nicht einmal matchen und vergessen: Jeder echte Kontakt, jede Frage und jede Aktivität verändert euren Bond.
      </Sub>

      <Card style={{ marginTop: 14 }}>
        <Row>
          <View>
            <Text style={ui.eyebrow}>Dein Connector-Score</Text>
            <GradientText style={{ fontFamily: font.display, fontSize: 38, letterSpacing: -1 }}>
              {String(connectorScore)}
            </GradientText>
          </View>
          <View style={{ flex: 1 }} />
          <Sparkline points={[60, 66, 70, 72, 74, 79, 83]} width={90} height={34} />
        </Row>
        <Text style={[ui.cardSub, { marginTop: 8 }]}>
          {db.bumps.length} Bumps gespeichert · {joined} Aktivitäten zugesagt · {db.answered} Fragen beantwortet
        </Text>
      </Card>

      <SectionLabel>Connections · {list.length} aktive Bonds</SectionLabel>

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        list.map((c) => (
          <Card key={c.id} onPress={() => onOpenPerson(c.id)} style={{ marginTop: 10 }}>
            <Row>
              <Avatar name={c.name} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={ui.name}>
                  {c.name}, {c.age}
                </Text>
                <Text style={[ui.nameSub, { marginTop: 2 }]} numberOfLines={1}>
                  Bond Lv. {c.bond} · {c.tags.join(' · ')}
                </Text>
              </View>
              <Sparkline points={c.trend} />
              <Meter value={c.score} />
            </Row>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <Pill tone={c.bond >= 4 ? 'hot' : 'ghost'}>Bond Lv. {c.bond}</Pill>
              {c.reported ? <Pill tone="bad">Gemeldet</Pill> : null}
              {c.teach ? <Pill tone="soft">Teach: {c.teach}</Pill> : null}
            </View>
          </Card>
        ))
      )}

      <SectionLabel>Bond-Mechanik</SectionLabel>
      <Card style={{ marginTop: 8 }}>
        <Row>
          <IconTile name="repeat" />
          <View style={{ flex: 1 }}>
            <Text style={ui.cardTitle}>Rebump hält den Score warm</Text>
            <Text style={[ui.cardSub, { marginTop: 2 }]}>
              Ohne echtes Wiedersehen kühlt ein Bond ab — kein Karteileichen-Feed.
            </Text>
          </View>
        </Row>
      </Card>
    </>
  );
}

function EmptyState() {
  const t = useTheme();
  return (
    <View
      style={{
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: base.line2,
        backgroundColor: 'rgba(36,21,33,0.42)',
        borderRadius: radius.card,
        padding: 22,
        marginTop: 10,
        alignItems: 'center',
      }}
    >
      <Icon name="people" size={26} color={t.a2} />
      <Text style={[ui.cardTitle, { marginTop: 10 }]}>Noch keine sichtbaren Connections</Text>
      <Text style={[ui.cardSub, { marginTop: 6, textAlign: 'center' }]}>
        Bump jemanden in echt — danach lebt der Bond hier weiter.
      </Text>
    </View>
  );
}
