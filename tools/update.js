// App-Update: übernimmt den verschlüsselten Tresor aus einer bestehenden Datei in eine neue App-Version.
// Aufruf: node tools/update.js <neue index.html> <bestehende Passwortdepot.html> <Ausgabe.html>
// Der Tresor bleibt dabei verschlüsselt; das Master-Passwort wird nicht benötigt.
const fs = require('fs');
const [app, vault, out] = process.argv.slice(2);
if (!app || !vault || !out) { console.error('Aufruf: node tools/update.js <index.html> <Passwortdepot.html> <Ausgabe.html>'); process.exit(1); }
const re = /(<script[^>]*id="pd-vault"[^>]*>)([\s\S]*?)(<\/script>)/;
const v = fs.readFileSync(vault, 'utf8').match(re);
if (!v || !v[2].trim()) { console.error('Kein gespeicherter Tresor in ' + vault + ' gefunden.'); process.exit(1); }
const blob = JSON.parse(v[2]);
if (blob.format !== 'passwortdepot') { console.error('Unbekanntes Format.'); process.exit(1); }
let s = fs.readFileSync(app, 'utf8');
if (!re.test(s)) { console.error('Neue App hat keinen pd-vault-Block.'); process.exit(1); }
s = s.replace(re, (_, a, __, c) => a + JSON.stringify(blob) + c);
fs.writeFileSync(out, s);
console.log('Fertig: ' + out + ' (Tresor vom ' + blob.saved + ')');
