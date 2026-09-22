import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { Icon, type IconName } from '../icons';
import { useStore } from '../store';
import { base, font } from '../theme';
import { useTheme } from './ui';

export type ScreenName = 'home' | 'circle' | 'activity' | 'ventures' | 'me';

export function BottomNav({
  screen,
  onNavigate,
  onBump,
}: {
  screen: ScreenName;
  onNavigate: (s: ScreenName) => void;
  onBump: () => void;
}) {
  const t = useTheme();
  const { mode } = useStore();
  const midScreen: ScreenName = mode === 'human' ? 'activity' : 'ventures';

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20 }}>
      <LinearGradient
        colors={['transparent', 'rgba(11,6,10,0.97)']}
        locations={[0, 0.45]}
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          paddingTop: 14,
          paddingHorizontal: 12,
          paddingBottom: 18,
        }}
      >
        <Tab icon="bolt" label="Bump" on={screen === 'home'} onPress={() => onNavigate('home')} />
        <Tab icon="people" label="Circle" on={screen === 'circle'} onPress={() => onNavigate('circle')} />
        <BumpButton onPress={onBump} />
        <Tab
          icon={mode === 'human' ? 'megaphone' : 'briefcase'}
          label={mode === 'human' ? '1 Ecke' : 'Ventures'}
          on={screen === midScreen}
          onPress={() => onNavigate(midScreen)}
        />
        <Tab icon="user" label="Du" on={screen === 'me'} onPress={() => onNavigate('me')} />
      </LinearGradient>
    </View>
  );
}

function Tab({
  icon,
  label,
  on,
  onPress,
}: {
  icon: IconName;
  label: string;
  on: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ width: 60, alignItems: 'center', gap: 4 }} hitSlop={8}>
      <View style={{ opacity: on ? 1 : 0.55 }}>
        <Icon name={icon} size={22} color={on ? base.milk : 'rgba(255,244,236,0.38)'} />
      </View>
      <Text
        style={{
          fontFamily: font.bold,
          fontSize: 10,
          letterSpacing: 0.4,
          color: on ? base.milk : 'rgba(255,244,236,0.38)',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** The raised centre action — breathing halo, gradient fill, bolt mark. */
function BumpButton({ onPress }: { onPress: () => void }) {
  const t = useTheme();
  const breathe = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 1300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 1300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breathe]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => Animated.spring(press, { toValue: 0.92, useNativeDriver: true, speed: 40 }).start()}
      onPressOut={() => Animated.spring(press, { toValue: 1, useNativeDriver: true, speed: 40 }).start()}
      style={{ width: 66, height: 66, alignItems: 'center', justifyContent: 'center', transform: [{ translateY: 6 }] }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          width: 66,
          height: 66,
          borderRadius: 33,
          backgroundColor: t.soft,
          opacity: breathe.interpolate({ inputRange: [0, 1], outputRange: [0.9, 0.45] }),
          transform: [{ scale: breathe.interpolate({ inputRange: [0, 1], outputRange: [1.1, 1.38] }) }],
        }}
      />
      <Animated.View style={{ transform: [{ scale: press }] }}>
        <LinearGradient
          colors={[t.a1, t.a15, t.a2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: t.a1,
            shadowOpacity: 0.5,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 10 },
            elevation: 12,
          }}
        >
          <Icon name="boltFill" size={28} color={base.ink2} />
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}
