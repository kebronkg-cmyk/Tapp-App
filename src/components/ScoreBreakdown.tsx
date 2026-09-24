import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '../icons';
import type { ScorePart } from '../lib/score';
import { base, font, radius } from '../theme';
import { useTheme } from './ui';

/**
 * A score nobody can interrogate is a horoscope. This shows what the number is
 * made of, so it reads as an argument for seeing someone again.
 */
export function ScoreBreakdown({ parts, score }: { parts: ScorePart[]; score: number }) {
  const t = useTheme();
  const [open, setOpen] = useState(false);

  const headline = parts
    .filter((p) => p.points >= p.max * 0.5)
    .map((p) => p.label.toLowerCase())
    .slice(0, 2);

  return (
    <View
      style={{
        backgroundColor: base.card,
        borderWidth: 1,
        borderColor: base.line,
        borderRadius: radius.card,
        marginTop: 8,
        overflow: 'hidden',
      }}
    >
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={{ paddingHorizontal: 18, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', gap: 10 }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: font.bold,
              fontSize: 10.5,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: base.faint,
            }}
          >
            Woher die {score} kommt
          </Text>
          <Text style={{ fontFamily: font.medium, fontSize: 13.5, color: base.dim, marginTop: 3 }}>
            {headline.length ? `Stark bei ${headline.join(' und ')}` : 'Noch wenig Datenpunkte'}
          </Text>
        </View>
        <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
          <Icon name="trend" size={18} color={t.a2} />
        </View>
      </Pressable>

      {open
        ? parts.map((p) => (
            <View
              key={p.label}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 12,
                borderTopWidth: 1,
                borderTopColor: 'rgba(255,244,236,0.07)',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontFamily: font.bold, fontSize: 13.5, color: base.milk }}>{p.label}</Text>
                <View style={{ flex: 1 }} />
                <Text style={{ fontFamily: font.displayBold, fontSize: 12, color: base.dim }}>
                  +{Math.round(p.points)}
                  <Text style={{ color: base.faint }}> / {p.max}</Text>
                </Text>
              </View>

              <View
                style={{
                  height: 6,
                  borderRadius: 99,
                  backgroundColor: base.line,
                  overflow: 'hidden',
                  marginTop: 7,
                }}
              >
                <View style={{ width: `${Math.min(100, (p.points / p.max) * 100)}%`, height: '100%' }}>
                  <LinearGradient
                    colors={[t.a1, t.a2]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1, borderRadius: 99 }}
                  />
                </View>
              </View>

              <Text style={{ fontFamily: font.body, fontSize: 12, color: base.mute, marginTop: 6 }}>{p.detail}</Text>
            </View>
          ))
        : null}
    </View>
  );
}
