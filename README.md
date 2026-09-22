# tapp

Treffen. Tappen. Matchen. — Expo / React Native App (TypeScript).

## Auf dem Handy starten

In beiden Fällen brauchst du **Expo Go** auf dem Handy (kostenlos im App Store /
Play Store).

### Ohne Installation: GitHub Codespaces

1. Oben auf **Code** → Reiter **Codespaces** → **Create codespace on main**
2. Warten, bis unten im Terminal `npm install` durchgelaufen ist
3. `npm run tunnel` eingeben
4. QR-Code scannen — **iPhone:** mit der Kamera-App, **Android:** in Expo Go über
   „Scan QR code"

Über den Tunnel muss das Handy nicht im selben Netz sein; mobiles Internet reicht.

### Lokal

Dafür brauchst du **Node.js** auf dem Rechner.

```bash
npm install
npm start
```

QR-Code scannen wie oben. Hier müssen Handy und Rechner im **gleichen WLAN** sein —
sonst `npm run tunnel` benutzen.

Ab da bleibt die Verbindung: Du speicherst eine Datei, das Handy aktualisiert sich
in unter einer Sekunde (Fast Refresh). Neu scannen musst du nur, wenn du den
Dev-Server neu startest.

Im Browser ansehen geht auch mit `npm run web` — dort fehlen aber Haptik und das
native Animationsgefühl.

## Weitere Befehle

```bash
npm run typecheck   # Typen prüfen
npm run tunnel      # Dev-Server über Tunnel (anderes Netz / Codespaces)
npx expo start -c   # mit geleertem Cache starten
```

## Aufbau

```
App.tsx              App-Shell: Screen-Wechsel, Overlays, Modals
src/theme.ts         Farben beider Modi (Human / Biz), Radien, Schriften
src/icons.tsx        Alle Icons als SVG — bewusst keine Emojis
src/store.tsx        Zustand + Persistenz (AsyncStorage)
src/data/            Seed-Daten, Fragenkatalog, Typen
src/components/      Bausteine, Bump-Overlay, Match-Sheet, Modals
src/screens/         Bump, Circle, Über 1 Ecke, Ventures, Du
```

## Was echt ist und was nicht

**Echt:** die komplette Oberfläche, die Score-Mechanik (Fragen verschieben Match-Score
und Werte-DNA, Mystery-Ebene schaltet nach 3 Antworten frei), Aktivitäten beitreten
und ausrufen, Profil bearbeiten, Blockieren/Melden, Datenexport, Reset. Alles wird
lokal auf dem Gerät gespeichert und überlebt den App-Neustart.

**Simuliert:** der Bump selbst. Der Näherungs-Screen ist Optik — es gibt keinen echten
Datenaustausch zwischen zwei Geräten, und Lena, Jonas und David sind Seed-Daten.
Es gibt kein Backend, keine Accounts, keine Benachrichtigungen.

Der Satz „Dein Profil bleibt auf dem Gerät, der Abgleich passiert beim Bump" steht
im Privacy-Screen als Absichtserklärung — implementiert ist er noch nicht.

## Nächster Schritt

Den Bump real machen über **Bluetooth LE**: Beide Geräte funken im Hintergrund, und
bei sehr hoher Signalstärke (Handys berühren sich) löst der Bump aus. Das funktioniert
iPhone ↔ Android und tauscht Daten direkt zwischen den Geräten aus.

NFC geht dafür ausdrücklich **nicht**: iPhone-zu-iPhone-NFC hat Apple nie geöffnet,
Android Beam ist seit Android 10 entfernt, und NameDrop ist eine Systemfunktion, die
keine fremde App nutzen kann.

Bluetooth braucht nativen Code, also reicht Expo Go dann nicht mehr — einmalig
`npx expo run:ios` / `run:android` oder ein EAS-Development-Build.
