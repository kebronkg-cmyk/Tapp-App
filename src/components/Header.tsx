import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useStore } from '../store';
import { base, font, radius, type Mode } from '../theme';
import { GradientText, useTheme } from './ui';

export function Header() {
  const t = useTheme();
  const { mode, setMode } = useStore();

  return (
    <View>
      <StatusStrip />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 22,
          paddingTop: 14,
          paddingBottom: 6,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={{ fontFamily: font.display, fontSize: 22, letterSpacing: -0.5, color: base.milk }}>ta</Text>
          <GradientText style={{ fontFamily: font.display, fontSize: 22, letterSpacing: -0.5 }}>pp</GradientText>
        </View>
        <ModeSwitch mode={mode} onChange={setMode} />
      </View>
    </View>
  );
}

function StatusStrip() {
  const t = useTheme();
  const [now, setNow] = useState(() => clockLabel());

  useEffect(() => {
    const id = setInterval(() => setNow(clockLabel()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 26,
        paddingTop: 16,
      }}
    >
      <Text style={{ fontFamily: font.bold, fontSize: 13, color: base.dim }}>{now}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: t.a2 }} />
        <Text style={{ fontFamily: font.bold, fontSize: 13, color: base.dim }}>live</Text>
      </View>
    </View>
  );
}

function clockLabel() {
  return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const t = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: base.card,
        borderWidth: 1,
        borderColor: base.line,
        borderRadius: radius.pill,
        padding: 3,
        gap: 2,
      }}
    >
      <ModeButton label="Human" on={mode === 'human'} onPress={() => onChange('human')} />
      <ModeButton label="Biz" on={mode === 'business'} onPress={() => onChange('business')} />
    </View>
  );
}

function ModeButton({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  const t = useTheme();
  const inner = (
    <Text
      style={{
        fontFamily: font.bold,
        fontSize: 11,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        color: on ? base.ink2 : 'rgba(255,244,236,0.42)',
      }}
    >
      {label}
    </Text>
  );

  return (
    <Pressable onPress={onPress} hitSlop={4}>
      {on ? (
        <LinearGradient
          colors={[t.a1, t.a2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingVertical: 7, paddingHorizontal: 14, borderRadius: radius.pill }}
        >
          {inner}
        </LinearGradient>
      ) : (
        <View style={{ paddingVertical: 7, paddingHorizontal: 14, borderRadius: radius.pill }}>{inner}</View>
      )}
    </Pressable>
  );
}
