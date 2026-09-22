import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import type { Question } from '../data/questions';
import { base, font, radius } from '../theme';
import { GhostButton, Pill, Tappable, useTheme } from './ui';
import { Icon } from '../icons';

export function QuestionModal({
  question,
  index,
  total,
  onAnswer,
  onClose,
}: {
  question: Question | null;
  index: number;
  total: number;
  onAnswer: (optIndex: number) => void;
  onClose: () => void;
}) {
  const t = useTheme();
  const a = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(a, {
      toValue: question ? 1 : 0,
      duration: question ? 340 : 200,
      easing: Easing.bezier(0.2, 0.9, 0.3, 1),
      useNativeDriver: true,
    }).start();
  }, [question, a]);

  if (!question) return null;

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 60, justifyContent: 'flex-end' }}>
      <Pressable onPress={onClose} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
        <Animated.View style={{ flex: 1, backgroundColor: 'rgba(11,6,10,0.72)', opacity: a }} />
      </Pressable>

      <Animated.View
        style={{
          backgroundColor: '#1E1019',
          borderTopLeftRadius: radius.sheet,
          borderTopRightRadius: radius.sheet,
          borderTopWidth: 1,
          borderColor: base.line,
          paddingHorizontal: 24,
          paddingTop: 26,
          paddingBottom: 40,
          opacity: a,
          transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [46, 0] }) }],
        }}
      >
        <View style={{ flexDirection: 'row', gap: 5, marginBottom: 16 }}>
          {Array.from({ length: total }, (_, i) => (
            <View key={i} style={{ flex: 1, height: 4, borderRadius: 99, overflow: 'hidden', backgroundColor: base.line }}>
              {i < index ? (
                <LinearGradient
                  colors={[t.a1, t.a2]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
              ) : null}
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 14 }}>
          <Pill tone="soft" icon={question.icon}>
            {question.tag}
          </Pill>
        </View>

        <Text
          style={{
            fontFamily: font.displayBold,
            fontSize: 19,
            lineHeight: 26,
            color: base.milk,
            marginBottom: 20,
          }}
        >
          {question.q}
        </Text>

        {question.opts.map((o, i) => (
          <Tappable key={o.t} onPress={() => onAnswer(i)} scaleTo={0.97}>
            <View
              style={{
                paddingVertical: 15,
                paddingHorizontal: 17,
                marginTop: 10,
                backgroundColor: base.card,
                borderWidth: 1,
                borderColor: base.line,
                borderRadius: radius.tile,
              }}
            >
              <Text style={{ fontFamily: font.medium, fontSize: 14.5, color: base.milk }}>{o.t}</Text>
            </View>
          </Tappable>
        ))}

        <GhostButton title="Später" onPress={onClose} style={{ marginTop: 14 }} />
      </Animated.View>
    </View>
  );
}
