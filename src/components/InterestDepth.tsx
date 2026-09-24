import React, { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, Text, UIManager, View } from 'react-native';
import { Icon } from '../icons';
import type { Interest } from '../data/types';
import { base, font, radius } from '../theme';
import { useTheme } from './ui';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Interests are labels until you can see what the person actually does with
 * them. That layer is earned by meeting, not by tapping around in the app.
 */
export function InterestDepth({
  interests,
  unlocked,
  requirement,
  shared,
}: {
  interests: Interest[];
  unlocked: boolean;
  requirement: string;
  shared: string[];
}) {
  const [openName, setOpenName] = useState<string | null>(null);
  const t = useTheme();

  const toggle = (name: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.create(220, 'easeInEaseOut', 'opacity'));
    setOpenName((v) => (v === name ? null : name));
  };

  return (
    <View style={{ marginTop: 8 }}>
      {interests.map((i) => {
        const isShared = shared.some((s) => s.toLowerCase() === i.name.toLowerCase());
        const open = openName === i.name;
        return (
          <View
            key={i.name}
            style={{
              backgroundColor: base.card,
              borderWidth: 1,
              borderColor: open ? t.a1 : base.line,
              borderRadius: radius.card,
              marginTop: 10,
              overflow: 'hidden',
            }}
          >
            <Pressable
              onPress={() => unlocked && toggle(i.name)}
              style={{ padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12 }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: font.bold, fontSize: 15, color: base.milk }}>{i.name}</Text>
                <Text style={{ fontFamily: font.body, fontSize: 12.5, color: base.mute, marginTop: 2 }}>
                  {isShared ? 'Wollt ihr beide' : unlocked ? 'Tauche tiefer ein' : 'Noch verschlossen'}
                </Text>
              </View>
              <Icon
                name={unlocked ? 'target' : 'lock'}
                size={17}
                color={unlocked ? t.a2 : base.faint}
                strokeWidth={2}
              />
            </Pressable>

            {open ? (
              <View
                style={{
                  paddingHorizontal: 18,
                  paddingBottom: 18,
                  paddingTop: 2,
                }}
              >
                <View
                  style={{
                    borderLeftWidth: 2,
                    borderLeftColor: t.a1,
                    paddingLeft: 12,
                  }}
                >
                  <Text style={{ fontFamily: font.body, fontSize: 14, lineHeight: 20, color: base.dim }}>
                    {i.depth}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        );
      })}

      {!unlocked ? (
        <Text style={{ fontFamily: font.body, fontSize: 12, color: base.mute, marginTop: 10 }}>
          {requirement}
        </Text>
      ) : null}
    </View>
  );
}
