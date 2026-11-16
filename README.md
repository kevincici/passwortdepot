# 🔐 Passwortdepot

Ein persönlicher, portabler Passwort-Tresor in **einer einzigen HTML-Datei**. Er läuft komplett lokal im Browser: ohne Installation, ohne Server und ohne Konto.

**Web-Version (ohne Daten):** https://kevincici.github.io/passwortdepot/
Dort öffnest du deine eigene, verschlüsselte Tresor-Datei, zum Beispiel am Handy aus OneDrive, iCloud oder Google Drive.

> Dieses Repository enthält **nur die App, keine Daten**. Tresor-Dateien und Exporte sind per `.gitignore` ausgeschlossen.

## Sicherheit

| | |
|---|---|
| Verschlüsselung | AES-256-GCM (mit Manipulationsschutz) |
| Schlüsselableitung | PBKDF2-SHA256, 600.000 Runden, zufälliges Salt (16 Byte) |
| Umsetzung | Web Crypto API des Browsers, keine fremden Bibliotheken |
| Netzwerk | per Content-Security-Policy `default-src 'none'` vollständig gesperrt |
| Speicherort | verschlüsselter JSON-Block `pd-vault` direkt in der HTML-Datei |

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
2. Mit Edge oder Chrome öffnen und ein Master-Passwort festlegen.
3. Speichern (Strg+S) und dabei dieselbe Datei auswählen, um sie zu überschreiben. Danach speichert die App automatisch.

In Firefox und Safari lädt „Speichern“ stattdessen eine neue Datei herunter.

## Werkzeuge

| Skript | Zweck |
|---|---|
| `tools/build.js` | Baut eine App-Datei mit einmaligem Erst-Import (JSON), der beim ersten Speichern verschlüsselt wird |
| `tools/upgrade.js` | Bringt eine bestehende Tresor-Datei auf die neue App-Version; der verschlüsselte Tresor bleibt unverändert, das Master-Passwort ist nicht nötig |

```bash
node tools/upgrade.js index.html "C:/Passwortdepot/Passwortdepot.html"
```

## Versionen

- **1.2.1** (2026-11-16): Hinweis mit Download-Ersatzweg, wenn das Speichern-Fenster ohne Speichern zurückkehrt
- **1.2.0** (2026-11-16): Speichern wird nachgeprüft (Datei wird wieder eingelesen); Fehler werden angezeigt, statt still ignoriert zu werden, mit Ersatzweg über Download; jede Änderung wird verschlüsselt im Browser zwischengespeichert und beim nächsten Öffnen zur Wiederherstellung angeboten; Leiste „Noch nicht gespeichert“
- **1.1.1** (2026-11-16): klare Meldung, wenn eine Tresor-Datei geöffnet wird, die noch nie verschlüsselt gespeichert wurde
- **1.1.0** (2026-11-16): Liste und Details scrollen getrennt (geöffneter Eintrag immer sichtbar, mit Einblend-Animation); Generator-Anzeige kompakter
- **1.0.1** (2026-11-16): Web-Version zeigt zuerst „Meine Tresor-Datei öffnen“ (für das Handy)
- **1.0.0** (2026-11-16): erste Version
