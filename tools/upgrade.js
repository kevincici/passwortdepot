// Upgrade: neue App-Version, Datenblöcke (pd-vault und ggf. noch ungespeicherter pd-import) aus der alten Datei bleiben erhalten.
// Aufruf: node tools/upgrade.js <neue index.html> <bestehende Passwortdepot.html>
// Legt vorher eine Sicherung <Datei>.vor-update.bak an. Daten werden nicht ausgegeben.
const fs = require('fs');
const [appPath, filePath] = process.argv.slice(2);
if (!appPath || !filePath) { console.error('Aufruf: node tools/upgrade.js <index.html> <Passwortdepot.html>'); process.exit(1); }
const re = id => new RegExp('(<script[^>]*id="' + id + '"[^>]*>)([\\s\\S]*?)(<\\/script>)');
const grab = (s, id) => { const m = s.match(re(id)); if (!m) throw new Error('Block ' + id + ' fehlt'); return m[2]; };
const app = fs.readFileSync(appPath, 'utf8');
const old = fs.readFileSync(filePath, 'utf8');
let out = app;
for (const id of ['pd-vault', 'pd-import']) {
  const content = grab(old, id);
  out = out.replace(re(id), (_, a, __, c) => a + content + c);
  if (grab(out, id).length !== content.length) throw new Error('Prüfung fehlgeschlagen: ' + id);
}
fs.copyFileSync(filePath, filePath + '.vor-update.bak');
fs.writeFileSync(filePath, out);
const v = (out.match(/APP_VERSION = '([^']+)'/) || [])[1];
console.log('Aktualisiert auf ' + v + ' | Tresor gespeichert: ' + (grab(out, 'pd-vault').trim().length > 0) + ' | Erst-Import offen: ' + (grab(out, 'pd-import').trim().length > 0));
