import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from '../icons';
import type { Fazit } from '../lib/score';
import { base, font, radius } from '../theme';
import { useTheme } from './ui';

/**
 * Meant to be held between two people and read together, so it carries no
 * buttons and nothing to act on — suggestions live in their own section.
 */
export function FazitCard({ fazit }: { fazit: Fazit }) {
  const t = useTheme();

  return (
    <View
      style={{
        borderRadius: radius.card,
        borderWidth: 1,
        borderColor: 'rgba(255,244,236,0.14)',
        backgroundColor: '#1A0E17',
        overflow: 'hidden',
        marginTop: 8,
      }}
    >
      <LinearGradient
        colors={[t.soft, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 14 }}
      >
        <Text
          style={{
            fontFamily: font.bold,
            fontSize: 10.5,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: base.faint,
          }}
        >
          Euer Fazit · zu zweit lesen
        </Text>
        <Text
          style={{
            fontFamily: font.display,
            fontSize: 24,
            lineHeight: 28,
            letterSpacing: -0.5,
            color: base.milk,
            marginTop: 6,
          }}
        >
          {fazit.headline}
        </Text>
        <Text style={{ fontFamily: font.body, fontSize: 14, lineHeight: 20, color: base.dim, marginTop: 8 }}>
          {fazit.verdict}
        </Text>
      </LinearGradient>

      {fazit.connects ? (
        <Block
          icon="link"
          color={t.a2}
          label="Das verbindet euch"
          topic={fazit.connects.topic}
          lines={[{ text: `Beide: „${fazit.connects.answer}"`, strong: true }]}
          note={fazit.connects.note}
        />
      ) : null}

      {fazit.contrast ? (
        <Block
          icon="block"
          color={base.warn}
          label="Größter Kontrast"
          topic={fazit.contrast.topic}
          lines={[
            { text: `Du: „${fazit.contrast.you}"`, strong: false },
            { text: `Sie: „${fazit.contrast.them}"`, strong: false },
          ]}
          note={fazit.contrast.note}
        />
      ) : null}

      {fazit.opener ? (
        <View
          style={{
            paddingHorizontal: 18,
            paddingVertical: 14,
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,244,236,0.07)',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <Icon name="people" size={17} color={base.faint} />
          <Text style={{ flex: 1, fontFamily: font.medium, fontSize: 13.5, lineHeight: 19, color: base.dim }}>
            {fazit.opener}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function Block({
  icon,
  color,
  label,
  topic,
  lines,
  note,
}: {
  icon: 'link' | 'block';
  color: string;
  label: string;
  topic: string;
  lines: { text: string; strong: boolean }[];
  note: string;
}) {
  return (
    <View
      style={{
        paddingHorizontal: 18,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,244,236,0.07)',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name={icon} size={15} color={color} strokeWidth={2} />
        <Text
          style={{
            fontFamily: font.bold,
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color,
          }}
        >
          {label}
        </Text>
        <View style={{ flex: 1 }} />
        <Text style={{ fontFamily: font.body, fontSize: 11.5, color: base.faint }}>{topic}</Text>
      </View>

      {lines.map((l) => (
        <Text
          key={l.text}
          style={{
            fontFamily: l.strong ? font.bold : font.medium,
            fontSize: 15,
            lineHeight: 21,
            color: base.milk,
            marginTop: 8,
          }}
        >
          {l.text}
        </Text>
      ))}

      <Text style={{ fontFamily: font.body, fontSize: 13, lineHeight: 18.5, color: base.dim, marginTop: 9 }}>
        {note}
      </Text>
    </View>
  );
}
