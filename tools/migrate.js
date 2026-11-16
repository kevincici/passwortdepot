// Umzug von Version 1.x (Tresor in der HTML-Datei) auf 2.x (eigene Tresor-Datei *.pwdepot).
// Aufruf: node tools/migrate.js <alte Passwortdepot.html> <Ziel.pwdepot>
// Der Tresor wird nur kopiert, nicht entschlüsselt. Das Master-Passwort ist nicht nötig.
const fs = require('fs');
const [src, dst] = process.argv.slice(2);
if (!src || !dst) { console.error('Aufruf: node tools/migrate.js <Passwortdepot.html> <Passwortdepot.pwdepot>'); process.exit(1); }
const m = fs.readFileSync(src, 'utf8').match(/<script[^>]*id="pd-vault"[^>]*>([\s\S]*?)<\/script>/);
if (!m || !m[1].trim()) { console.error('In ' + src + ' steht kein gespeicherter Tresor.'); process.exit(1); }
const blob = JSON.parse(m[1]);
if (blob.format !== 'passwortdepot' || !blob.data) { console.error('Unbekanntes Format.'); process.exit(1); }
if (fs.existsSync(dst)) { console.error(dst + ' existiert bereits, nichts überschrieben.'); process.exit(1); }
fs.writeFileSync(dst, JSON.stringify(blob));
console.log('Tresor (gespeichert ' + blob.saved + ') nach ' + dst + ' übertragen.');
