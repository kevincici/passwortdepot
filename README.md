# 🔐 Passwortdepot

Ein persönlicher, portabler Passwort-Tresor: **eine HTML-Datei als Programm** und **eine verschlüsselte Tresor-Datei** (`.pwdepot`) für die Daten. Er läuft komplett lokal im Browser: ohne Installation, ohne Server und ohne Konto.

**Web-Version (ohne Daten):** https://kevincici.github.io/passwortdepot/
Dort öffnest du deine eigene Tresor-Datei `Passwortdepot.pwdepot`, zum Beispiel am Handy aus OneDrive, iCloud oder Google Drive.

> Dieses Repository enthält **nur die App, keine Daten**. Tresor-Dateien und Exporte sind per `.gitignore` ausgeschlossen.

## Sicherheit

| | |
|---|---|
| Verschlüsselung | AES-256-GCM (mit Manipulationsschutz) |
| Schlüsselableitung | PBKDF2-SHA256, 600.000 Runden, zufälliges Salt (16 Byte) |
| Umsetzung | Web Crypto API des Browsers, keine fremden Bibliotheken |
| Netzwerk | per Content-Security-Policy `default-src 'none'` vollständig gesperrt |
| Speicherort | eigene Tresor-Datei `*.pwdepot` (JSON mit Salt, IV und Geheimtext); der Browser merkt sich nur den Verweis auf die Datei |
| Sicherheitsnetz | jede Änderung zusätzlich verschlüsselt im Browser (localStorage) zwischengespeichert, bis sie in der Datei steht |

Wer das Master-Passwort vergisst, verliert die Daten. Es gibt keine Hintertür.

## Funktionen

- Frei wählbare Bereiche (z. B. Privat, Arbeit, Familie, Kinder, Schule) mit eigenem Symbol und eigener Farbe
- Einträge mit Benutzer, Passwort, Webseite, weiteren (geheimen) Feldern und Notizen
- Suche, Favoriten, Filter „Zu prüfen“
- Passwort-Generator und Stärke-Anzeige
- Sicherheitscheck: schwache, mehrfach verwendete und alte Passwörter
- Automatisches Sperren, Zwischenablage wird nach einer einstellbaren Zeit geleert
- Verschlüsseltes Backup (`.pwdepot`), CSV-Import und -Export
- Dunkel, hell oder wie das System; für Desktop und Handy angepasst

## Benutzung

1. `index.html` herunterladen und z. B. als `Passwortdepot.html` speichern.
2. Mit Edge oder Chrome öffnen, ein Master-Passwort festlegen und die Tresor-Datei `Passwortdepot.pwdepot` speichern.
3. Ab dann öffnet die App diese Datei beim Start von selbst und speichert jede Änderung automatisch hinein. Nachgeprüft wird das, indem die Datei nach dem Schreiben wieder eingelesen wird.

In Firefox, Safari und am Handy gibt es keinen direkten Dateizugriff: Dort wird die Tresor-Datei ausgewählt und gelesen; „Speichern“ lädt eine neue `.pwdepot` herunter.

## Werkzeuge

| Skript | Zweck |
|---|---|
| `tools/build.js` | Baut eine App-Datei mit einmaligem Erst-Import (JSON), der beim ersten Speichern verschlüsselt wird |
| `tools/migrate.js` | Umzug von 1.x: holt den verschlüsselten Tresor aus einer alten HTML-Datei in eine `.pwdepot`-Datei (ohne Entschlüsselung) |

```bash
node tools/migrate.js alt/Passwortdepot.html Passwortdepot.pwdepot
```

## Versionen

- **2.0.0** (2026-11-16): Programm und Daten getrennt. Der Tresor liegt in einer eigenen `.pwdepot`-Datei, die der Browser zuverlässig speichern kann (das Überschreiben der HTML-Datei schlug in Chrome fehl). Die App merkt sich die Datei und öffnet sie beim Start; ungespeicherte Änderungen werden beim Entsperren automatisch übernommen.
- **1.2.1** (2026-11-16): Hinweis mit Download-Ersatzweg, wenn das Speichern-Fenster ohne Speichern zurückkehrt
- **1.2.0** (2026-11-16): Speichern wird nachgeprüft (Datei wird wieder eingelesen); Fehler werden angezeigt, statt still ignoriert zu werden, mit Ersatzweg über Download; jede Änderung wird verschlüsselt im Browser zwischengespeichert und beim nächsten Öffnen zur Wiederherstellung angeboten; Leiste „Noch nicht gespeichert“
- **1.1.1** (2026-11-16): klare Meldung, wenn eine Tresor-Datei geöffnet wird, die noch nie verschlüsselt gespeichert wurde
- **1.1.0** (2026-11-16): Liste und Details scrollen getrennt (geöffneter Eintrag immer sichtbar, mit Einblend-Animation); Generator-Anzeige kompakter
- **1.0.1** (2026-11-16): Web-Version zeigt zuerst „Meine Tresor-Datei öffnen“ (für das Handy)
- **1.0.0** (2026-11-16): erste Version
