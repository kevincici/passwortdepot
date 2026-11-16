// Passwortdepot – lokaler Dienst
// Liefert die App unter http://127.0.0.1:47811 aus und liest/schreibt die Tresor-Datei direkt,
// damit kein Datei-Auswahlfenster des Browsers nötig ist.
//
// Sicherheit:
//  * lauscht nur auf 127.0.0.1 (von anderen Geräten nicht erreichbar)
//  * prüft den Host-Header (Schutz gegen DNS-Rebinding) und die Herkunft (Origin)
//  * Datenzugriff nur mit eigenem Header X-Passwortdepot (fremde Webseiten können ihn nicht senden)
//  * speichert nur gültige, VERSCHLÜSSELTE Tresor-Daten; der Dienst kennt kein Passwort und entschlüsselt nichts
//  * überschreibt nie einen Tresor mit anderem Schlüssel-Salt (Schutz vor versehentlich neuem, leerem Tresor),
//    außer die App meldet ausdrücklich einen Master-Passwort-Wechsel
//  * vor dem Überschreiben automatische Sicherung im Ordner backup\ (höchstens alle 10 Minuten, die letzten 50)
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = 47811;
const ORIGIN = `http://${HOST}:${PORT}`;
const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'Passwortdepot.html');
const VAULT = path.join(ROOT, 'Passwortdepot.pwdepot');
const BACKUP = path.join(ROOT, 'backup');
const MAX_BODY = 20 * 1024 * 1024;
const BACKUP_EVERY_MS = 10 * 60 * 1000;
const BACKUP_KEEP = 50;
let lastBackup = 0;

function send(res, code, body = '', type = 'text/plain; charset=utf-8', extra = {}) {
  res.writeHead(code, {'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'X-Frame-Options': 'DENY', ...extra});
  res.end(body);
}
function readVault() { try { return JSON.parse(fs.readFileSync(VAULT, 'utf8')); } catch { return null; } }
function backup() {
  if (!fs.existsSync(VAULT) || Date.now() - lastBackup < BACKUP_EVERY_MS) return;
  fs.mkdirSync(BACKUP, {recursive: true});
  const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
  fs.copyFileSync(VAULT, path.join(BACKUP, `Passwortdepot-${stamp}.pwdepot`));
  lastBackup = Date.now();
  const files = fs.readdirSync(BACKUP).filter(f => f.endsWith('.pwdepot')).sort();
  files.slice(0, Math.max(0, files.length - BACKUP_KEEP)).forEach(f => fs.unlinkSync(path.join(BACKUP, f)));
}

const server = http.createServer((req, res) => {
  if (req.headers.host !== `${HOST}:${PORT}`) return send(res, 421, 'Falscher Host');
  const url = (req.url || '/').split('?')[0];

  if (req.method === 'GET' && (url === '/' || url === '/index.html')) {
    let html;
    try { html = fs.readFileSync(APP, 'utf8'); } catch { return send(res, 500, 'Passwortdepot.html fehlt'); }
    // Einzige Lockerung der Sicherheitsregel: Die App darf mit DIESEM Dienst sprechen (connect-src 'self').
    html = html.replace("default-src 'none';", "default-src 'none'; connect-src 'self';");
    return send(res, 200, html, 'text/html; charset=utf-8');
  }

  if (url === '/api/vault') {
    if (req.headers['x-passwortdepot'] !== '1') return send(res, 403, 'Verboten');
    if (req.headers.origin && req.headers.origin !== ORIGIN) return send(res, 403, 'Verboten');

    if (req.method === 'GET') {
      if (!fs.existsSync(VAULT)) return send(res, 404, 'Kein Tresor');
      return send(res, 200, fs.readFileSync(VAULT, 'utf8'), 'application/json; charset=utf-8');
    }

    if (req.method === 'PUT') {
      const chunks = []; let size = 0;
      req.on('data', c => { size += c.length; if (size > MAX_BODY) { send(res, 413, 'Zu groß'); req.destroy(); } else chunks.push(c); });
      req.on('end', () => {
        if (res.writableEnded) return;
        let b;
        try { b = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return send(res, 400, 'Kein gültiges JSON'); }
        if (!b || b.format !== 'passwortdepot' || !b.data || !b.iv || !b.kdf || !b.kdf.salt) return send(res, 400, 'Keine Passwortdepot-Daten');
        const cur = readVault();
        if (cur && cur.kdf && cur.kdf.salt !== b.kdf.salt && req.headers['x-replace'] !== '1') {
          return send(res, 409, 'Anderer Tresor – nicht überschrieben');
        }
        try {
          backup();
          const tmp = VAULT + '.tmp';
          fs.writeFileSync(tmp, JSON.stringify(b));
          fs.renameSync(tmp, VAULT);
          const check = readVault();
          if (!check || check.iv !== b.iv) return send(res, 500, 'Kontrolle fehlgeschlagen');
          return send(res, 200, JSON.stringify({ok: true, iv: check.iv, saved: check.saved}), 'application/json; charset=utf-8');
        } catch (e) { return send(res, 500, 'Schreibfehler: ' + e.message); }
      });
      return;
    }
    return send(res, 405, 'Methode nicht erlaubt');
  }

  send(res, 404, 'Nicht gefunden');
});

server.on('error', e => { if (e.code === 'EADDRINUSE') process.exit(0); console.error(e); process.exit(1); });
server.listen(PORT, HOST, () => console.log(`Passwortdepot-Dienst läuft auf ${ORIGIN} (Ordner: ${ROOT})`));
