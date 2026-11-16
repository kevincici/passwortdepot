// node build.js <template> <import.json|-> <output>
const fs = require('fs');
const [t, imp, out] = process.argv.slice(2);
let s = fs.readFileSync(t, 'utf8');
const BS = String.fromCharCode(92);
const data = imp === '-' ? '' : JSON.stringify(JSON.parse(fs.readFileSync(imp, 'utf8'))).replace(/</g, BS + 'u003c');
const tag = '<script type="application/json" id="pd-import"></script>';
if (!s.includes(tag)) throw new Error('import tag missing');
s = s.replace(tag, () => '<script type="application/json" id="pd-import">' + data + '</script>');
fs.writeFileSync(out, s);
console.log('ok', out, s.length, 'script-closes:', (s.match(/<\/script>/g) || []).length);
