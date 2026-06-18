/**
 * validate.mjs — red de seguridad del catálogo. Falla (exit 1) si algo se cuela.
 * Comprueba, sobre src/effects/<cat>/<id>.js:
 *   - parseo con acorn (ecmaVersion 2022, módulos)
 *   - 0 ids / 0 títulos duplicados
 *   - backticks balanceados
 *   - 0 ocurrencias de `<script src=`
 *   - cada `cat` ∈ CAT_ORDER
 *   - total esperado de efectos
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'acorn';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const EFFECTS_DIR = resolve(ROOT, 'src/effects');
const EXPECTED = 219;

function walk(dir) {
  const out = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = resolve(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.name.endsWith('.js') && !ent.name.startsWith('_')) out.push(p);
  }
  return out;
}

function literalProp(objNode, name) {
  const p = objNode.properties.find(
    (n) => n.type === 'Property' && n.key && (n.key.name === name || n.key.value === name)
  );
  return p && p.value && p.value.type === 'Literal' ? p.value.value : undefined;
}

function main() {
  // CAT_ORDER desde _cat-order.js
  const catSrc = readFileSync(resolve(EFFECTS_DIR, '_cat-order.js'), 'utf8');
  const catAst = parse(catSrc, { ecmaVersion: 2022, sourceType: 'module' });
  let CAT_ORDER = [];
  for (const n of catAst.body) {
    if (n.type === 'ExportNamedDeclaration' && n.declaration) {
      const d = n.declaration.declarations?.[0];
      if (d && d.id.name === 'CAT_ORDER') CAT_ORDER = d.init.elements.map((e) => e.value);
    }
  }
  if (!CAT_ORDER.length) fail('CAT_ORDER vacío o no encontrado.');

  // _runtime.js debe parsear
  const rt = readFileSync(resolve(EFFECTS_DIR, '_runtime.js'), 'utf8');
  try {
    parse(rt, { ecmaVersion: 2022, sourceType: 'module' });
  } catch (e) {
    fail('_runtime.js no parsea: ' + e.message);
  }

  const files = walk(EFFECTS_DIR).filter((f) => statSync(f).isFile());
  const errors = [];
  const ids = new Map();
  const titles = new Map();
  const perCat = {};

  for (const f of files) {
    const rel = f.replace(ROOT + '/', '');
    const src = readFileSync(f, 'utf8');

    // <script src=
    if (/<script\s+src=/i.test(src)) errors.push(`${rel}: contiene <script src=`);

    // backticks balanceados
    const ticks = (src.match(/`/g) || []).length;
    if (ticks % 2 !== 0) errors.push(`${rel}: backticks desbalanceados (${ticks})`);

    // parseo acorn
    let ast;
    try {
      ast = parse(src, { ecmaVersion: 2022, sourceType: 'module' });
    } catch (e) {
      errors.push(`${rel}: no parsea — ${e.message}`);
      continue;
    }

    // localiza el objeto exportado por defecto (const effect = {...}; export default effect)
    let objNode = null;
    for (const n of ast.body) {
      if (n.type === 'VariableDeclaration') {
        const d = n.declarations.find((x) => x.id.name === 'effect');
        if (d && d.init && d.init.type === 'ObjectExpression') objNode = d.init;
      }
    }
    if (!objNode) {
      errors.push(`${rel}: no expone 'const effect = {…}'`);
      continue;
    }

    const id = literalProp(objNode, 'id');
    const title = literalProp(objNode, 'title');
    const cat = literalProp(objNode, 'cat');
    const hasRender = objNode.properties.some(
      (p) => p.type === 'Property' && p.key && p.key.name === 'render'
    );

    if (!id) errors.push(`${rel}: sin id`);
    if (!title) errors.push(`${rel}: sin title`);
    if (!cat) errors.push(`${rel}: sin cat`);
    if (!hasRender) errors.push(`${rel}: sin render()`);

    if (id) {
      if (ids.has(id)) errors.push(`ID duplicado '${id}': ${rel} y ${ids.get(id)}`);
      else ids.set(id, rel);
    }
    if (title) {
      if (titles.has(title)) errors.push(`Título duplicado '${title}': ${rel} y ${titles.get(title)}`);
      else titles.set(title, rel);
    }
    if (cat && !CAT_ORDER.includes(cat)) errors.push(`${rel}: cat '${cat}' no está en CAT_ORDER`);
    if (cat) perCat[cat] = (perCat[cat] || 0) + 1;
  }

  if (files.length !== EXPECTED)
    errors.push(`Se esperaban ${EXPECTED} efectos, hay ${files.length}.`);

  if (errors.length) {
    console.error('\n[validate] ❌ ' + errors.length + ' problema(s):');
    for (const e of errors) console.error('  · ' + e);
    process.exit(1);
  }

  console.log(`\n[validate] ✅ ${files.length} efectos · ${ids.size} ids únicos · ${titles.size} títulos únicos`);
  for (const c of CAT_ORDER) console.log(`  · ${c}: ${perCat[c] || 0}`);
  console.log('[validate] sin duplicados · backticks OK · 0 <script src= · acorn 2022 OK\n');
}

function fail(msg) {
  console.error('[validate] ❌ ' + msg);
  process.exit(1);
}

main();
