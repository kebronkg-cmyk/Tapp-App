# tapp — Übergabe für eine neue Sitzung

Diese Datei ist das Gedächtnis des Projekts. Wer sie und `PLAN.md` gelesen hat,
kann sofort weiterarbeiten, ohne den alten Chat zu kennen.

**Stand:** 24. September 2026

---

## 1. Worum es geht

tapp ist eine Mobile-App (Expo / React Native). Man hält sein Handy an das einer
anderen Person, und beide sehen sofort ein gemeinsames **Fazit**: worin sie sich
gleichen, worin nicht, und was sie zusammen machen könnten.

**Die These, auf die alles ausgerichtet ist:**

> tapp sorgt dafür, dass gute Begegnungen nicht versanden.
> Der Bump fängt den Moment ein. Das Fazit gibt sofort etwas zum Reden.
> Der Circle ist der Grund, nächste Woche wiederzukommen.

Es ist ausdrücklich **keine** App zum Leutefinden — der Bump verlangt
körperliche Nähe, man hat sich also schon getroffen. Der Wert liegt darin, die
Begegnung nicht wieder zu verlieren.

Die App hat zwei Modi: **Human** (Freundschaft, warme Pink/Orange-Palette) und
**Biz** (Co-Founder-Suche, Blau/Cyan).

---

## 2. Wie man mit dem Nutzer arbeitet

- **Sprache: Deutsch.** Immer.
- Er ist **kein Entwickler**. Begriffe wie Terminal, Branch oder Build müssen
  erklärt werden, und zwar beim ersten Mal in einfachen Worten.
- Er arbeitet über **GitHub Codespaces im Browser**, nicht mit lokal
  installierten Werkzeugen. Befehle immer als fertige Zeile zum Kopieren geben.
- Er testet auf einem **iPhone über Expo Go**. Ablauf: im Codespace
  `npm run tunnel`, dann QR-Code mit der Kamera scannen.
- Er ist bei Expo als **kg1177** angemeldet. Wenn der Server anonym läuft,
  verweigert Expo Go den Start — dann im Codespace `npx expo login` ausführen.
- Er will **ehrliche Einschätzungen**, keine Bestätigung. Widerspruch ist
  ausdrücklich erwünscht, wenn etwas eine schlechte Idee ist.
- Wenn etwas nicht klappt, ist ein **Screenshot** der schnellste Weg. Danach
  fragen statt raten.

---

## 3. Produktentscheidungen und ihre Begründung

Diese Entscheidungen sind gefallen. Nicht ohne Anlass wieder aufmachen.

**Kein NFC, kein „NameDrop".**
iPhone-zu-iPhone-NFC hat Apple nie geöffnet, Android Beam ist seit Android 10
entfernt, NameDrop ist eine Systemfunktion, die keine fremde App nutzen kann.
Der Bump läuft deshalb über einen QR-Code. Bluetooth LE wäre die richtige
Langfristlösung, kostet aber einen eigenen Build und etwa sechs Wochen — deshalb
erst nach dem Campus-Test.

**Fragen zu Hause, Fazit sofort.**
Niemand beantwortet sechs Fragen, während jemand danebensteht. Man beantwortet
sie allein zu Hause; beim Bump ist das Fazit sofort da. Das ist die wichtigste
Ablaufentscheidung des Produkts.

**Phase 1 ohne Server.**
Ein Profil ist klein genug, um vollständig in einen QR-Code zu passen. Zwei
Handys tauschen direkt aus. Damit wird auch das Versprechen „der Abgleich
passiert beim Bump, nicht auf einem Server" endlich wahr.

**Keine durchsuchbaren Profile.**
Widerspricht dem Kern der App. Tiefe wird nach dem Bump freigeschaltet, nicht
vorher angeboten.

**Keine Emojis in der Oberfläche.**
Ausdrücklicher Wunsch. Alle Symbole sind eigene SVG-Icons in `src/icons.tsx`.
Personen bekommen Initialen-Avatare mit individuellem Farbverlauf.

**Der Score muss herleitbar sein.**
Eine Zahl, die man nicht hinterfragen kann, ist ein Horoskop. Jeder Bestandteil
wird mit Beitrag und Begründung angezeigt.

**Nicht in Version 1:** Kalenderabgleich, Aktivitäten-Bot, Aktivitäten mit
Sichtbarkeitsregeln, Bluetooth, Chat. Siehe Ideen-Parkplatz in `PLAN.md`.

---

## 4. Technischer Stand

**Stack:** Expo SDK 57, React Native 0.86, TypeScript, react-native-svg,
expo-linear-gradient, expo-haptics, AsyncStorage, masked-view,
@expo-google-fonts (Unbounded für Überschriften, Space Grotesk für Fließtext).

**Navigation:** bewusst **kein** Expo Router. Die Screens werden in `App.tsx`
per Zustand gewechselt, weil der vierte Tab vom Modus abhängt und die Übergänge
überblenden. Die generische `AGENTS.md` empfiehlt Expo Router — das gilt hier
nicht.

```
App.tsx                    Shell: Screenwechsel, Overlays, Modals
src/theme.ts               Farben beider Modi, Radien, Schriften
src/icons.tsx              alle Icons als SVG
src/store.tsx              Zustand + Persistenz (AsyncStorage)
src/lib/score.ts           Score-Modell und Fazit-Herleitung
src/data/                  Seed-Daten, Fragenkatalog, Typen
src/components/            Bausteine, BumpOverlay, MatchSheet, FazitCard,
                           ScoreBreakdown, InterestDepth, QuestionModal
src/screens/               Bump, Circle, Über 1 Ecke, Ventures, Du
```

**Score-Modell** (`src/lib/score.ts`): Antworten 55 %, Interessen 25 %,
Teach-Fit 20 %, dazu bis zu 12 Punkte Konstanz für echte Treffen.
Wichtig: Die gemessene Übereinstimmung verdrängt den Startwert nur so schnell,
wie Fragen tatsächlich beantwortet werden — sonst springt der Score nach einer
einzigen passenden Antwort auf 99.

**Speicher-Versionierung:** Der Schlüssel in `src/store.tsx` heißt aktuell
`tapp.db.v2`. **Bei jeder Änderung am Datenformat hochzählen**, sonst stürzt die
App bei Nutzern mit altem Stand ab.

---

## 5. Was echt ist und was nicht

**Echt:** die komplette Oberfläche, beide Modi, das Score-Modell, das Fazit,
zweiseitige Fragen gegen hinterlegte Antworten, Ebenen, Interessen-Tiefe,
Konstanz-Bonus, Aktivitäten beitreten und ausrufen, Profil bearbeiten,
Blockieren und Melden lokal, Datenexport, Reset. Alles bleibt über Neustarts
erhalten.

**Simuliert:** Der Bump selbst — der Näherungs-Screen ist Optik, es gibt keinen
Datenaustausch zwischen Geräten. Lena, Jonas, Aylin, David, Sofia und Timo sind
Seed-Daten mit hinterlegten Antworten. Kein Server, keine Konten, keine
Benachrichtigungen. Blockieren und Melden schreiben nur lokal.

---

## 6. Arbeitsweise

**Prüfen vor dem Abschließen:**
```bash
npx tsc --noEmit        # Typen
npm run tunnel          # Dev-Server für das Handy
```

Für eine echte Prüfung im Browser: `npx expo start --web` starten und die App
mit Playwright durchklicken (Chromium liegt unter `/opt/pw-browsers`). Bisher
wurden so mehrere echte Fehler gefunden, die im Code nicht sichtbar waren —
Gradient-Text war im Web schwarz, die Scrollposition blieb beim Tabwechsel
hängen, der Score sprang nach einer Antwort auf 99. **Nicht auf Typecheck
allein verlassen.**

**Git:** Branch `main`, direkt pushen. Repo ist
`github.com/kebronkg-cmyk/Tapp-App`. Der Klon liegt unter `/home/claude/tapp-app`.
Falls eine neue Sitzung keinen Zugriff hat: `add_repo` mit `access: "push"`
aufrufen, dann klonen.

**Commit-Nachrichten** auf Englisch, erklären das Warum, nicht das Was.

---

## 7. Offene Fragen

**Die Dienstag-Frage — die wichtigste ungelöste Frage.**
Warum öffnet jemand die App an einem Tag, an dem er niemanden Neues trifft?
Die Neugier trägt genau einen Bump, vielleicht fünf. Danach ist die Zahl nicht
mehr aufregend. Genau daran sterben Apps dieser Art — nicht am Start, sondern in
Woche drei.

Die Arbeitshypothese: Der Circle erinnert an Leute, die man schon kennt, und an
das, was man zusammen vorhatte. Muss im Test überprüft werden, nicht angenommen.

**Nutzerabhängigkeit.** Die App braucht nicht „genug Leute in München", sondern
genau die Person, die gerade gegenübersteht. Deshalb kein Stadtstart, sondern
ein geschlossener Raum: ein Kurs, ein Verein, ein Campus.

**Android oder iPhone zuerst?** Steht noch aus. Android spart 99 € im Jahr und
etwa zwei Wochen Papierkram.

---

## 8. Realistische Einschätzung

Als Interaktionsprototyp ist die App weit. Als Produkt fehlt das Meiste:
kein Backend, kein echter Bump, keine zweiten Nutzer.

Bis zum gültigen Campus-Test: etwa 80 Stunden Arbeit. Bis zu einer App, die
Fremde installieren können, nochmal 80 bis 100 Stunden obendrauf.
Softwareschätzungen liegen fast immer zu niedrig — das Doppelte ist realistisch.

**Eine Sache, die ausdrücklich klargestellt wurde:** Eine App ohne Nutzer hat
praktisch keinen Verkaufswert. Gekauft werden Nutzer, Umsatz oder Teams, nicht
Code. Der echte Gegenwert eines Scheiterns ist das Gelernte und der Nachweis,
etwas fertiggemacht zu haben.
