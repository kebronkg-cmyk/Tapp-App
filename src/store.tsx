import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Mode } from './theme';
import { seed } from './data/seed';
import { bizQuestions, humanQuestions, type Question } from './data/questions';
import type { Activity, BizMatch, Connection, DB, Level, ValueKey } from './data/types';

const KEY = 'tapp.db.v1';

type Ctx = {
  db: DB;
  ready: boolean;
  mode: Mode;
  setMode: (m: Mode) => void;
  connectorScore: number;
  recordBump: (person: string, score: number) => void;
  answerQuestion: (target: { kind: 'connection' | 'biz'; id: string }, qIndex: number, optIndex: number) => number;
  joinActivity: (id: string) => boolean;
  createActivity: (input: { title: string; time: string; via: string }) => void;
  updateProfileList: (field: 'want' | 'teach', items: string[]) => void;
  updateProfileName: (name: string) => void;
  blockPerson: (id: string) => void;
  reportPerson: (id: string) => void;
  resetDemo: () => void;
  questionsFor: (kind: 'connection' | 'biz') => Question[];
};

const StoreContext = createContext<Ctx | null>(null);

const clamp = (n: number) => Math.max(5, Math.min(99, n));

function hydrate(raw: string | null): DB {
  if (!raw) return structuredClone(seed);
  try {
    const parsed = JSON.parse(raw) as DB;
    // Merge over the seed so new fields survive an older stored payload.
    return { ...structuredClone(seed), ...parsed };
  } catch {
    return structuredClone(seed);
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>(() => structuredClone(seed));
  const [ready, setReady] = useState(false);
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => setDb(hydrate(raw)))
      .catch(() => setDb(structuredClone(seed)))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => {
      AsyncStorage.setItem(KEY, JSON.stringify(db)).catch(() => {});
    }, 200);
    return () => {
      if (writeTimer.current) clearTimeout(writeTimer.current);
    };
  }, [db, ready]);

  const setMode = useCallback((mode: Mode) => setDb((d) => ({ ...d, mode })), []);

  const recordBump = useCallback((person: string, score: number) => {
    setDb((d) => ({
      ...d,
      bumps: [...d.bumps, { id: 'bp' + Date.now(), mode: d.mode, person, score, at: new Date().toISOString() }],
    }));
  }, []);

  const questionsFor = useCallback(
    (kind: 'connection' | 'biz') => (kind === 'biz' ? bizQuestions : humanQuestions),
    [],
  );

  const answerQuestion = useCallback<Ctx['answerQuestion']>((target, qIndex, optIndex) => {
    const list = target.kind === 'biz' ? bizQuestions : humanQuestions;
    const q = list[qIndex];
    if (!q) return 0;
    const delta = q.opts[optIndex].d;

    setDb((d) => {
      const answered = d.answered + 1;
      const mysteryOpen = d.mysteryOpen || answered >= 3;

      const bumpLevels = (levels: Level[]): Level[] =>
        levels.map((l, i) => {
          if (i === q.level && l.v !== null) return { ...l, v: clamp(l.v + delta * 2) };
          // Unlocking the mystery level gives it a real starting value.
          if (l.v === null && mysteryOpen && !d.mysteryOpen) return { ...l, v: 64 };
          return l;
        });

      const connections =
        target.kind === 'connection'
          ? d.connections.map((c) =>
              c.id === target.id
                ? {
                    ...c,
                    score: clamp(c.score + delta),
                    trend: [...c.trend, clamp(c.score + delta)],
                    levels: bumpLevels(c.levels),
                  }
                : c,
            )
          : d.connections;

      const bizMatches =
        target.kind === 'biz'
          ? d.bizMatches.map((b) =>
              b.id === target.id
                ? {
                    ...b,
                    score: clamp(b.score + delta),
                    trend: [...b.trend, clamp(b.score + delta)],
                    levels: bumpLevels(b.levels),
                  }
                : b,
            )
          : d.bizMatches;

      const values = { ...d.profile.values };
      if (q.valueKey) values[q.valueKey as ValueKey] = clamp(values[q.valueKey as ValueKey] + delta);

      return {
        ...d,
        connections,
        bizMatches,
        answered,
        mysteryOpen,
        answers: { ...d.answers, [q.q]: q.opts[optIndex].t },
        profile: { ...d.profile, values },
      };
    });

    return delta;
  }, []);

  const joinActivity = useCallback((id: string) => {
    let joined = false;
    setDb((d) => ({
      ...d,
      activities: d.activities.map((a) => {
        if (a.id !== id) return a;
        joined = !a.joined;
        return { ...a, joined, spots: Math.max(0, a.spots + (joined ? -1 : 1)) };
      }),
    }));
    return joined;
  }, []);

  const createActivity = useCallback((input: { title: string; time: string; via: string }) => {
    setDb((d) => {
      const activity: Activity = {
        id: 'a' + Date.now(),
        icon: d.mode === 'business' ? 'rocket' : 'target',
        title: input.title.trim() || 'Neue Aktivität',
        host: d.profile.name,
        via: input.via.trim() || 'Über deinen Circle',
        time: input.time.trim() || 'Demnächst',
        spots: 3,
        joined: true,
        reward: d.mode === 'business' ? '+4 Biz-Signal' : '+3 Circle-Bond',
        people: [d.profile.name],
        type: d.mode,
      };
      return { ...d, activities: [activity, ...d.activities] };
    });
  }, []);

  const updateProfileList = useCallback((field: 'want' | 'teach', items: string[]) => {
    setDb((d) => ({ ...d, profile: { ...d.profile, [field]: items } }));
  }, []);

  const updateProfileName = useCallback((name: string) => {
    setDb((d) => ({ ...d, profile: { ...d.profile, name: name.trim() || d.profile.name } }));
  }, []);

  const blockPerson = useCallback((id: string) => {
    setDb((d) => ({
      ...d,
      connections: d.connections.map((c) => (c.id === id ? { ...c, blocked: true } : c)),
    }));
  }, []);

  const reportPerson = useCallback((id: string) => {
    setDb((d) => {
      const person = d.connections.find((c) => c.id === id);
      return {
        ...d,
        connections: d.connections.map((c) => (c.id === id ? { ...c, reported: true } : c)),
        flags: [
          ...d.flags,
          { id, person: person?.name ?? id, reason: 'Gemeldet aus dem Match-Detail', at: new Date().toISOString() },
        ],
      };
    });
  }, []);

  const resetDemo = useCallback(() => {
    const fresh = structuredClone(seed);
    setDb(fresh);
    AsyncStorage.setItem(KEY, JSON.stringify(fresh)).catch(() => {});
  }, []);

  const connectorScore = 742 + db.bumps.length * 6 + db.answered * 2;

  const value = useMemo<Ctx>(
    () => ({
      db,
      ready,
      mode: db.mode,
      setMode,
      connectorScore,
      recordBump,
      answerQuestion,
      joinActivity,
      createActivity,
      updateProfileList,
      updateProfileName,
      blockPerson,
      reportPerson,
      resetDemo,
      questionsFor,
    }),
    [
      db,
      ready,
      connectorScore,
      setMode,
      recordBump,
      answerQuestion,
      joinActivity,
      createActivity,
      updateProfileList,
      updateProfileName,
      blockPerson,
      reportPerson,
      resetDemo,
      questionsFor,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

export function useConnection(id: string | null): Connection | undefined {
  const { db } = useStore();
  return db.connections.find((c) => c.id === id);
}

export function useBizMatch(id: string | null): BizMatch | undefined {
  const { db } = useStore();
  return db.bizMatches.find((b) => b.id === id);
}
