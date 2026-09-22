import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { base, font, radius } from '../theme';

type ToastCtx = { say: (msg: string) => void };
const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState('');
  const anim = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const say = useCallback(
    (m: string) => {
      setMsg(m);
      if (timer.current) clearTimeout(timer.current);
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 8 }).start();
      timer.current = setTimeout(() => {
        Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setMsg(''));
      }, 2300);
    },
    [anim],
  );

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <Ctx.Provider value={{ say }}>
      {children}
      {msg ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 120,
            alignItems: 'center',
            zIndex: 90,
            opacity: anim,
            transform: [
              { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
              { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) },
            ],
          }}
        >
          <View
            style={{
              backgroundColor: base.card2,
              borderWidth: 1,
              borderColor: 'rgba(255,244,236,0.12)',
              borderRadius: radius.pill,
              paddingVertical: 11,
              paddingHorizontal: 20,
              maxWidth: '100%',
              shadowColor: '#000',
              shadowOpacity: 0.45,
              shadowRadius: 26,
              shadowOffset: { width: 0, height: 14 },
              elevation: 14,
            }}
          >
            <Text style={{ fontFamily: font.bold, fontSize: 13, color: base.milk }} numberOfLines={2}>
              {msg}
            </Text>
          </View>
        </Animated.View>
      ) : null}
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
