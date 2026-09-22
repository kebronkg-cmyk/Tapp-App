import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Pattern, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useStore } from '../store';
import { themeFor, type Mode } from '../theme';

/**
 * Soft drifting colour fields behind the app. Each mode owns a pair of blobs and
 * the pairs cross-fade into each other, so switching Human/Biz reads as a slow
 * wash rather than a hard palette flip.
 */
export function Backdrop() {
  const { mode } = useStore();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <BlobPair mode="human" visible={mode === 'human'} />
      <BlobPair mode="business" visible={mode === 'business'} />
      <Grain />
    </View>
  );
}

function BlobPair({ mode, visible }: { mode: Mode; visible: boolean }) {
  const t = themeFor(mode);
  const fade = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: visible ? 1 : 0,
      duration: 1400,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [visible, fade]);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade }]} pointerEvents="none">
      <Blob
        color={t.blob1}
        size={420}
        style={{ top: -150, right: -140 }}
        opacity={0.5}
        drift={{ x: -30, y: 26, scale: 1.12 }}
        duration={16000}
      />
      <Blob
        color={t.blob2}
        size={360}
        style={{ bottom: -130, left: -160 }}
        opacity={0.3}
        drift={{ x: 34, y: -20, scale: 1.08 }}
        duration={19000}
      />
    </Animated.View>
  );
}

function Blob({
  color,
  size,
  style,
  opacity,
  drift,
  duration,
}: {
  color: string;
  size: number;
  style: { top?: number; bottom?: number; left?: number; right?: number };
  opacity: number;
  drift: { x: number; y: number; scale: number };
  duration: number;
}) {
  const a = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(a, { toValue: 1, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(a, { toValue: 0, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [a, duration]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        opacity,
        ...style,
        transform: [
          { translateX: a.interpolate({ inputRange: [0, 1], outputRange: [0, drift.x] }) },
          { translateY: a.interpolate({ inputRange: [0, 1], outputRange: [0, drift.y] }) },
          { scale: a.interpolate({ inputRange: [0, 1], outputRange: [1, drift.scale] }) },
        ],
      }}
    >
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={`g-${color}-${size}`} cx="42%" cy="40%" r="60%">
            <Stop offset="0" stopColor={color} stopOpacity={0.95} />
            <Stop offset="0.45" stopColor={color} stopOpacity={0.45} />
            <Stop offset="0.75" stopColor={color} stopOpacity={0.12} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#g-${color}-${size})`} />
      </Svg>
    </Animated.View>
  );
}

/** Very light dot grain so large dark surfaces don't band. */
function Grain() {
  return (
    <View style={[StyleSheet.absoluteFill, { opacity: 0.035 }]} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="grain" width="12" height="12" patternUnits="userSpaceOnUse">
            <Circle cx="1" cy="1" r="1" fill="#FFF4EC" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grain)" />
      </Svg>
    </View>
  );
}
