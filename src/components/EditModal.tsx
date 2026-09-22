import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, TextInput, View } from 'react-native';
import { useStore } from '../store';
import { base, font, radius } from '../theme';
import { useToast } from './Toast';
import { Card, Eyebrow, GhostButton, GradientText, PrimaryButton, Sub, styles as ui, useTheme } from './ui';

export type EditKind =
  | { kind: 'activity' }
  | { kind: 'list'; field: 'want' | 'teach' }
  | { kind: 'privacy' };

export function EditModal({ edit, onClose }: { edit: EditKind | null; onClose: () => void }) {
  const a = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(a, {
      toValue: edit ? 1 : 0,
      duration: edit ? 340 : 200,
      easing: Easing.bezier(0.2, 0.9, 0.3, 1),
      useNativeDriver: true,
    }).start();
  }, [edit, a]);

  if (!edit) return null;

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 65, justifyContent: 'flex-end' }}>
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
          paddingBottom: 38,
          opacity: a,
          transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [46, 0] }) }],
        }}
      >
        {edit.kind === 'activity' ? (
          <ActivityForm onClose={onClose} />
        ) : edit.kind === 'list' ? (
          <ListForm field={edit.field} onClose={onClose} />
        ) : (
          <PrivacyPanel onClose={onClose} />
        )}
      </Animated.View>
    </View>
  );
}

function Title({ lead, accent }: { lead: string; accent: string }) {
  return (
    <Text style={{ fontFamily: font.display, fontSize: 26, lineHeight: 30, letterSpacing: -0.5, color: base.milk }}>
      {lead}
      <GradientText style={{ fontFamily: font.display, fontSize: 26, letterSpacing: -0.5 }}>{accent}</GradientText>
    </Text>
  );
}

function Input({
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={base.faint}
      multiline={multiline}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        borderWidth: 1,
        borderColor: focused ? t.a1 : base.line,
        backgroundColor: 'rgba(36,21,33,0.85)',
        borderRadius: radius.tile,
        paddingHorizontal: 14,
        paddingVertical: 13,
        marginTop: 9,
        color: base.milk,
        fontFamily: font.body,
        fontSize: 14.5,
        minHeight: multiline ? 86 : undefined,
        textAlignVertical: multiline ? 'top' : 'center',
      }}
    />
  );
}

function ActivityForm({ onClose }: { onClose: () => void }) {
  const { createActivity, mode } = useStore();
  const { say } = useToast();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [via, setVia] = useState('');

  return (
    <>
      <Eyebrow>Aktivität ausrufen</Eyebrow>
      <Title lead="Über 1 Ecke " accent="starten" />
      <Sub style={{ marginTop: 8 }}>
        Geht an deinen Circle und deren Freunde — nicht an Fremde in der Nähe.
      </Sub>
      <Input value={title} onChangeText={setTitle} placeholder={mode === 'business' ? 'z. B. Founder-Frühstück' : 'z. B. Bouldern morgen'} />
      <Input value={time} onChangeText={setTime} placeholder="z. B. Morgen 18:00" />
      <Input value={via} onChangeText={setVia} placeholder="Wieso sollen Leute aus deinem Circle mitkommen?" multiline />
      <PrimaryButton
        title="Ausrufen"
        icon="megaphone"
        onPress={() => {
          createActivity({ title, time, via });
          onClose();
          say('Aktivität ausgerufen');
        }}
        style={{ marginTop: 14 }}
      />
      <GhostButton title="Abbrechen" onPress={onClose} style={{ marginTop: 10 }} />
    </>
  );
}

function ListForm({ field, onClose }: { field: 'want' | 'teach'; onClose: () => void }) {
  const { db, updateProfileList } = useStore();
  const { say } = useToast();
  const [text, setText] = useState(db.profile[field].join(', '));

  return (
    <>
      <Eyebrow>Profil bearbeiten</Eyebrow>
      <Title
        lead={field === 'want' ? 'Will ich mehr ' : 'Kann ich '}
        accent={field === 'want' ? 'machen' : 'beibringen'}
      />
      <Input value={text} onChangeText={setText} placeholder="Kommagetrennt" multiline />
      <Sub style={{ marginTop: 8, fontSize: 12.5 }}>
        Kommagetrennt, z. B. Bouldern, Gitarre lernen. Steuert deine Teach- und Aktivitäts-Vorschläge.
      </Sub>
      <PrimaryButton
        title="Speichern"
        icon="check"
        onPress={() => {
          updateProfileList(
            field,
            text
              .split(',')
              .map((x) => x.trim())
              .filter(Boolean),
          );
          onClose();
          say('Profil aktualisiert');
        }}
        style={{ marginTop: 14 }}
      />
      <GhostButton title="Abbrechen" onPress={onClose} style={{ marginTop: 10 }} />
    </>
  );
}

function PrivacyPanel({ onClose }: { onClose: () => void }) {
  const { db, resetDemo } = useStore();
  const { say } = useToast();

  const exportData = async () => {
    try {
      const file = new File(Paths.cache, 'tapp-demo-data.json');
      if (file.exists) file.delete();
      file.create();
      file.write(JSON.stringify(db, null, 2));
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: 'tapp Demo-Daten' });
      } else {
        say('Export gespeichert: ' + file.uri);
      }
    } catch {
      say('Export fehlgeschlagen');
    }
  };

  return (
    <>
      <Eyebrow>Privacy</Eyebrow>
      <Title lead="Privat by " accent="Design" />
      <Card style={{ marginTop: 14 }}>
        <Text style={ui.cardTitle}>Was im echten Produkt dazugehört</Text>
        <Text style={[ui.cardSub, { marginTop: 7 }]}>
          Auth, verschlüsselte Antwort-Vektoren, Blockieren, Melden, Account löschen, Datenexport, DSGVO und eine
          klare Altersgrenze.
        </Text>
      </Card>
      <GhostButton title="Daten exportieren" icon="export" onPress={exportData} style={{ marginTop: 12 }} />
      <GhostButton
        title="Lokale Daten löschen"
        icon="reset"
        tone="danger"
        onPress={() => {
          resetDemo();
          onClose();
          say('Lokale Demo-Daten gelöscht');
        }}
        style={{ marginTop: 10 }}
      />
      <PrimaryButton title="Fertig" icon="check" onPress={onClose} style={{ marginTop: 12 }} />
    </>
  );
}
