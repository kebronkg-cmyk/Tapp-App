import { SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { Unbounded_700Bold, Unbounded_900Black } from '@expo-google-fonts/unbounded';
import { useFonts } from 'expo-font';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Backdrop } from './src/components/Backdrop';
import { BottomNav, type ScreenName } from './src/components/BottomNav';
import { BumpOverlay } from './src/components/BumpOverlay';
import { EditModal, type EditKind } from './src/components/EditModal';
import { Header } from './src/components/Header';
import { MatchSheet, type SheetTarget } from './src/components/MatchSheet';
import { QuestionModal, type Comparison } from './src/components/QuestionModal';
import { ToastProvider, useToast } from './src/components/Toast';
import { ActivityScreen } from './src/screens/ActivityScreen';
import { CircleScreen } from './src/screens/CircleScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { VenturesScreen } from './src/screens/VenturesScreen';
import { StoreProvider, useStore } from './src/store';
import { base } from './src/theme';

export default function App() {
  const [loaded] = useFonts({
    Unbounded_700Bold,
    Unbounded_900Black,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: base.ink }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <StoreProvider>
        <PhoneFrame>
          <ToastProvider>
            <Shell />
          </ToastProvider>
        </PhoneFrame>
      </StoreProvider>
    </SafeAreaProvider>
  );
}

/**
 * On a phone the app fills the screen. On a wide surface (tablet, web preview)
 * it sits in the device bezel the design was drawn in.
 */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  const framed = width > 520;

  if (!framed) {
    return <View style={{ flex: 1, backgroundColor: base.ink2, overflow: 'hidden' }}>{children}</View>;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: base.ink }}>
      <View
        style={{
          width: 390,
          height: Math.min(820, height - 40),
          backgroundColor: base.ink2,
          borderRadius: 44,
          overflow: 'hidden',
          borderWidth: 10,
          borderColor: '#050305',
          shadowColor: '#000',
          shadowOpacity: 0.7,
          shadowRadius: 60,
          shadowOffset: { width: 0, height: 30 },
          elevation: 30,
        }}
      >
        {children}
      </View>
    </View>
  );
}

function Shell() {
  const { db, mode, setMode, answerQuestion, questionsFor } = useStore();
  const { say } = useToast();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const framed = width > 520;

  const [screen, setScreen] = useState<ScreenName>('home');
  const [bumpOpen, setBumpOpen] = useState(false);
  const [sheet, setSheet] = useState<SheetTarget | null>(null);
  const [edit, setEdit] = useState<EditKind | null>(null);
  const [qTarget, setQTarget] = useState<SheetTarget | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [qOpen, setQOpen] = useState(false);
  const [comparison, setComparison] = useState<Comparison | null>(null);
  const [delta, setDelta] = useState(0);

  const dbRef = useRef(db);
  dbRef.current = db;

  const deltaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (deltaTimer.current) clearTimeout(deltaTimer.current);
      if (nextTimer.current) clearTimeout(nextTimer.current);
    },
    [],
  );

  // Mode switch keeps you on the equivalent page instead of dumping you home.
  useEffect(() => {
    if (mode === 'business' && screen === 'activity') setScreen('ventures');
    if (mode === 'human' && screen === 'ventures') setScreen('activity');
  }, [mode, screen]);

  const openSheet = useCallback((target: SheetTarget) => {
    setSheet(target);
    setQTarget(target);
    setQIndex(0);
    setDelta(0);
  }, []);

  const startQuestions = useCallback((target: SheetTarget) => {
    setQTarget(target);
    setQOpen(true);
  }, []);

  const questions = questionsFor(qTarget?.kind === 'biz' ? 'biz' : 'connection');

  const onAnswer = useCallback(
    (optIndex: number) => {
      if (!qTarget) return;
      const q = questions[qIndex];
      const person =
        qTarget.kind === 'biz'
          ? db.bizMatches.find((b) => b.id === qTarget.id)
          : db.connections.find((c) => c.id === qTarget.id);
      const before = person?.score ?? 0;

      answerQuestion(qTarget, qIndex, optIndex);
      const next = qIndex + 1;
      setQIndex(next);

      // Hold on the two answers side by side before moving on — that comparison
      // is the point of the question, not the number it moves.
      const theirs = person?.answers[q.id];
      if (person && theirs != null) {
        setComparison({ question: q, mine: optIndex, theirs, them: person.name });
        Haptics.impactAsync(
          optIndex === theirs ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light,
        ).catch(() => {});
      } else {
        setQOpen(false);
      }

      if (deltaTimer.current) clearTimeout(deltaTimer.current);
      deltaTimer.current = setTimeout(() => {
        const after =
          qTarget.kind === 'biz'
            ? dbRef.current.bizMatches.find((b) => b.id === qTarget.id)?.score
            : dbRef.current.connections.find((c) => c.id === qTarget.id)?.score;
        if (after != null) setDelta(after - before);
        setTimeout(() => setDelta(0), 1800);
      }, 100);

      if (nextTimer.current) clearTimeout(nextTimer.current);
      nextTimer.current = setTimeout(() => {
        setComparison(null);
        if (next < questions.length) setQOpen(true);
        else {
          setQOpen(false);
          say('Fragen durch — euer Fazit steht');
        }
      }, 2600);
    },
    [answerQuestion, db.bizMatches, db.connections, qIndex, qTarget, questions, say],
  );

  return (
    <View style={{ flex: 1, backgroundColor: base.ink2 }}>
      <Backdrop />

      <View style={{ flex: 1, paddingTop: framed ? 0 : insets.top }}>
        <Header />

        <View style={{ flex: 1, overflow: 'hidden' }}>
          <ScreenHost screen={screen}>
            <ScrollView
              key={screen}
              contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 8, paddingBottom: 130 + insets.bottom }}
              showsVerticalScrollIndicator={false}
            >
              {screen === 'home' ? (
                <HomeScreen onBump={() => setBumpOpen(true)} />
              ) : screen === 'circle' ? (
                <CircleScreen onOpenPerson={(id) => openSheet({ kind: 'connection', id })} />
              ) : screen === 'activity' ? (
                <ActivityScreen onCreate={() => setEdit({ kind: 'activity' })} />
              ) : screen === 'ventures' ? (
                <VenturesScreen
                  onOpenBiz={(id) => openSheet({ kind: 'biz', id })}
                  onCreate={() => setEdit({ kind: 'activity' })}
                />
              ) : (
                <ProfileScreen
                  onEditList={(field) => setEdit({ kind: 'list', field })}
                  onOpenPrivacy={() => setEdit({ kind: 'privacy' })}
                />
              )}
            </ScrollView>
          </ScreenHost>
        </View>

        <BottomNav screen={screen} onNavigate={setScreen} onBump={() => setBumpOpen(true)} />
      </View>

      <MatchSheet
        target={sheet}
        delta={delta}
        answeredCount={qIndex}
        onClose={() => setSheet(null)}
        onStartQuestions={startQuestions}
      />

      <QuestionModal
        question={qOpen ? (questions[qIndex] ?? null) : null}
        index={qIndex}
        total={questions.length}
        comparison={comparison}
        onAnswer={onAnswer}
        onClose={() => setQOpen(false)}
      />

      <EditModal edit={edit} onClose={() => setEdit(null)} />

      <BumpOverlay visible={bumpOpen} onClose={() => setBumpOpen(false)} onOpenDetail={openSheet} />
    </View>
  );
}

/** Soft cross-fade between pages, so tab switches feel like one surface. */
function ScreenHost({ screen, children }: { screen: ScreenName; children: React.ReactNode }) {
  const a = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    a.setValue(0);
    Animated.timing(a, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [screen, a]);

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: a,
        transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
      }}
    >
      {children}
    </Animated.View>
  );
}
