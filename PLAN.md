# tapp — Plan bis zum Campus-Test

**Stand:** 24. September 2026
**Ziel:** Gültiger Campus-Test am **Donnerstag, 19. November 2026**
**Arbeitszeit:** mindestens 1 h/Tag, besser zwei längere Blöcke am Wochenende

---

## Die These

> **tapp sorgt dafür, dass gute Begegnungen nicht versanden.**
> Der Bump fängt den Moment ein. Das Fazit gibt euch sofort etwas zum Reden.
> Der Circle ist der Grund, nächste Woche wiederzukommen.

Nicht „neue Leute finden" — das macht das Leben. Nicht „matchen" — das ist Tinder.
Sondern: **nicht verlieren.**

---

## Der entscheidende Ablauf

Diese Reihenfolge ist das Herz des Produkts. Alles andere richtet sich danach:

1. **Zu Hause, allein:** Du beantwortest Fragen über dich. In Ruhe, ohne Publikum.
   Je mehr du beantwortest, desto schärfer wird jeder künftige Bump.
2. **Beim Treffen:** Bump. **Sofort** ein fertiges Fazit — keine Wartezeit,
   keine Fragerunde zu zweit. Ihr lest zusammen, worin ihr euch gleicht und
   worin nicht.
3. **Danach:** Der Circle erinnert euch an das, was ihr gemeinsam vorhattet.

**Warum das wichtig ist:** Niemand beantwortet sechs Fragen, während jemand
danebensteht und wartet. Das Fazit muss im Moment der Begegnung da sein, sonst
ist der Moment vorbei.

---

## Technische Grundentscheidung

**Phase 1 läuft ohne Server.** Ein Profil ist winzig — ein paar Ziffern für die
Antworten, dazu Name und Interessen. Das passt vollständig in einen QR-Code.
Zwei Handys tauschen ihre Profile direkt aus, wenn sie sich gegenüberstehen.

Das hat drei Vorteile:
- Wir sind Wochen schneller am ersten gültigen Test.
- Der Satz „der Abgleich passiert beim Bump, nicht auf einem Server" wird wahr,
  statt nur auf dem Screen zu stehen.
- Kein Login, keine Registrierung, keine Hürde für Tester.

Ein Server kommt erst in Phase 2 — und nur für das, was ohne ihn nicht geht:
Profile über Geräte hinweg behalten, Rebump-Verlauf, Benachrichtigungen.

---

## Nicht in Version 1

Gute Ideen, alle nach dem 19. November:

- Kalender-Anbindung und Terminabgleich
- Bot, der Aktivitäten im Netz sucht
- Aktivitäten posten mit Sichtbarkeitsregeln
- Bluetooth statt Code (kostet sechs Wochen, bringt vor dem Test nichts)
- Chat jeder Art

**Regel:** Fällt dir etwas ein, kommt es auf die Liste am Ende dieser Datei.
Nicht in den Code.

---

## Woche 1 · Do 24.9. – Mi 1.10.
### Der neue Ablauf

**Ich baue:**
- Fragen-Sektion im eigenen Profil: zu Hause beantworten, jederzeit erweitern
- Profil als QR-Code darstellen und einen fremden Code einlesen
- Bump liefert **sofort** das Fazit aus beiden echten Profilen
- Fortschrittsanzeige: „12 von 20 Fragen beantwortet — dein Fazit wird schärfer"

**Du machst:**
- Beantworte die Fragen selbst und sag mir, welche sich blöd anfühlen
- Schreib **fünf eigene Fragen** in deiner Sprache. Du kennst deine Leute besser
  als ich — die Fragen entscheiden, ob das Fazit trifft
- Entscheide: Android zuerst oder iPhone? (Zähl in deinem Kurs durch.
  Android spart 99 € und zwei Wochen)

**Checkpoint Mi 1.10.:** Zwei Handys tauschen Profile aus und zeigen ein
gemeinsames Fazit. Ohne Server.

---

## Woche 2 · Do 2.10. – Mi 8.10.
### Der Moment muss sitzen

**Ich baue:**
- Das Fazit so, dass zwei Leute es nebeneinander lesen können — Schriftgrößen,
  Reihenfolge, Länge
- Deine fünf Fragen einbauen
- Den Bump-Ablauf straffen: von Antippen bis Fazit unter 10 Sekunden

**Du machst:**
- **Erster gültiger Test mit 3 Personen.** Bedingung: Alle haben vorher zu Hause
  geantwortet. Sonst zählt der Test nicht
- Schau ihnen beim Lesen ins Gesicht. Lesen sie zu Ende? Reden sie danach?
- Eine Frage an jeden: *„Würdest du das nächste Woche nochmal aufmachen? Wofür?"*
- Antworten wörtlich aufschreiben

**Checkpoint Mi 8.10.:** Wir gehen die Antworten durch.
**Wenn niemand einen Grund für nächste Woche nennt, ändern wir die Richtung —
bevor wir einen Server bauen.**

---

## Woche 3 · Do 9.10. – Mi 15.10.
### Erste echte Testrunde

**Du machst:**
- **8 bis 10 Personen**, alle mit vorher beantworteten Fragen
- Verschiedene Konstellationen: enge Freunde, Bekannte, Fremde
- Notieren, an welcher Stelle Leute stocken

**Ich baue:**
- Was aus Runde 1 hervorgeht
- Den Circle: wen du gebumpt hast, was ihr gemeinsam vorhattet
- Rebump mit Konstanz-Bonus

**Checkpoint Mi 15.10.:** Entscheidung, ob wir zum Server gehen.
Kriterium: Mindestens die Hälfte sagt, sie würden es wieder benutzen — und
nennt einen konkreten Grund.

---

## Woche 4–5 · Do 16.10. – Mi 29.10.
### Server und Beständigkeit

**Ich baue:**
- Supabase: Konten, Profile, Bump-Verlauf, Zugriffsregeln
- Anmelden per E-Mail
- Profile überleben Geräte- und App-Wechsel
- Circle wird echt statt Demo-Daten

**Du machst:**
- Supabase-Konto anlegen, Zugangsdaten an mich
- Falls iPhone: **Apple Developer Program jetzt beantragen** — dauert bis zu
  einer Woche
- Täglich gegentesten
- **Die Texte für Onboarding und Fazit selbst schreiben.** Deine Stimme
  entscheidet, ob sich die App echt anfühlt, nicht meine

**Checkpoint Mi 29.10.:** Zwei Konten auf zwei Geräten, Bump bleibt gespeichert.

---

## Woche 6 · Do 30.10. – Mi 5.11.
### Sicherheit und Recht

**Ich baue:**
- Blockieren, Melden, Account löschen — mit echter Wirkung auf dem Server
- Altersgrenze
- Datenexport

**Du machst:**
- Datenschutzerklärung besorgen und lesen. **Du haftest dafür, nicht ich**
- Entscheiden, ab welchem Alter

---

## Woche 7 · Do 6.11. – Mi 12.11.
### Verteilen

**Ich baue:**
- Development Build für dein Zielsystem
- Letzte Fehler aus deinen Tests

**Du machst:**
- **10 bis 15 Tester anwerben.** Namen aufschreiben, vorher fragen, Termin setzen
- App auf mindestens drei fremde Geräte bekommen und prüfen, dass es läuft
- Kurze Anleitung schreiben: „Vorher Fragen beantworten, dann treffen wir uns"

---

## Woche 8 · Do 13.11. – Mi 19.11.
### Campus-Test

**Du machst:**
- Verteilen, dabei sein, zuschauen, nicht erklären
- Mitschreiben, wo Leute hängen

**Ich mache:**
- Fehler beheben, während der Test läuft

**Am 19.11. zählen wir:**
1. Wie viele haben mindestens einmal gebumpt?
2. Wie viele haben **in Woche zwei** nochmal gebumpt?
3. Wie viele haben sich wegen der App wiedergetroffen?

**Frage 2 entscheidet alles.** Der Rest ist Neugier.

---

## Wie wir zusammenarbeiten

**Du bringst:** Entscheidungen, Texte in deiner Sprache, echte Menschen, Konten
und Zahlungen, und alles, was du bei Tests siehst.

**Ich bringe:** Code, Architektur, Datenbank — und Widerspruch, wenn ich glaube,
dass etwas eine schlechte Idee ist.

**Pro Sitzung:** Du sagst in zwei Sätzen, was passiert ist und was du gelernt
hast. Ich sage, was gebaut ist und was ansteht. Dann arbeiten wir an genau einer
Sache.

**Zwei feste Regeln:**
1. **Kein neues Feature vor dem 19.11.** Diese Regel entscheidet, ob wir fertig
   werden.
2. **Bei jedem Checkpoint darf „wir stoppen" herauskommen.** Das ist kein
   Scheitern, das ist der Sinn von Checkpoints.

---

## Ideen-Parkplatz

Alles, was uns einfällt und warten muss:

- Kalenderabgleich: nur vorschlagen, wenn beide frei sind
- Bot, der passende Aktivitäten sucht, mit „Link" und „Assemble"
- Aktivitäten posten, gezielt sichtbar für Einzelne oder alle
- Bluetooth statt QR-Code
- Tiefere Kategorien mit mehr Ebenen
- Squad-Bumps mit mehr als zwei Personen
