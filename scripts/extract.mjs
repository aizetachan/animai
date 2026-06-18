/**
 * extract.mjs — one-shot.
 * Parte el prototipo monolítico `motion-gallery.html` en módulos limpios:
 *   - src/effects/_runtime.js      (helpers shaderPreview / canvasPreview, verbatim)
 *   - src/effects/_cat-order.js    (CAT_ORDER, verbatim)
 *   - src/effects/<cat-slug>/<id>.js  (1 archivo por efecto, OBJETO CORTADO TAL CUAL)
 *
 * No reinterpreta ningún render(): usa el AST de acorn (ecmaVersion 2022) para
 * localizar los offsets de cada nodo y CORTA el texto fuente literal. Así
 * render/prompt/code y los backticks anidados se preservan byte a byte.
 *
 * Uso:  node scripts/extract.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'acorn';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const HTML = resolve(ROOT, 'motion-gallery.html');
const EFFECTS_DIR = resolve(ROOT, 'src/effects');

const RENDER_MARK = '/* @render-start */';

function slug(cat) {
  return cat
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita diacríticos (ó -> o, í -> i)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getProp(objNode, name) {
  return objNode.properties.find(
    (p) => p.type === 'Property' && p.key && (p.key.name === name || p.key.value === name)
  );
}

function main() {
  const html = readFileSync(HTML, 'utf8');

  // El prototipo tiene un único <script> real (los <style> viven dentro de strings).
  const sOpen = html.indexOf('<script>');
  const sClose = html.lastIndexOf('</script>');
  if (sOpen < 0 || sClose < 0) throw new Error('No se encontró el bloque <script>.');
  const script = html.slice(sOpen + '<script>'.length, sClose);

  const ast = parse(script, { ecmaVersion: 2022, sourceType: 'script' });

  let catOrderNode = null;
  const helpers = {};
  let itemsNode = null;

  for (const node of ast.body) {
    if (node.type === 'FunctionDeclaration' && node.id) {
      if (node.id.name === 'shaderPreview' || node.id.name === 'canvasPreview') {
        helpers[node.id.name] = script.slice(node.start, node.end);
      }
    }
    if (node.type === 'VariableDeclaration') {
      for (const d of node.declarations) {
        if (d.id.name === 'CAT_ORDER') catOrderNode = d.init;
        if (d.id.name === 'ITEMS') itemsNode = d.init;
      }
    }
  }

  if (!helpers.shaderPreview || !helpers.canvasPreview)
    throw new Error('No se encontraron los helpers shaderPreview/canvasPreview.');
  if (!catOrderNode) throw new Error('No se encontró CAT_ORDER.');
  if (!itemsNode || itemsNode.type !== 'ArrayExpression')
    throw new Error('No se encontró el array ITEMS.');

  const catOrder = catOrderNode.elements.map((e) => e.value);

  // Limpia TODAS las subcarpetas de efectos previas (deja _runtime / index / types).
  if (existsSync(EFFECTS_DIR)) {
    for (const ent of readdirSync(EFFECTS_DIR, { withFileTypes: true })) {
      if (ent.isDirectory()) rmSync(resolve(EFFECTS_DIR, ent.name), { recursive: true, force: true });
    }
  }

  const elements = itemsNode.elements.filter(Boolean);
  const seenId = new Set();
  const seenTitle = new Set();
  const perCat = {};
  let withCode = 0;
  const manifest = [];

  for (const obj of elements) {
    if (obj.type !== 'ObjectExpression') throw new Error('Elemento de ITEMS no es objeto.');

    const idP = getProp(obj, 'id');
    const titleP = getProp(obj, 'title');
    const catP = getProp(obj, 'cat');
    const renderP = getProp(obj, 'render');
    const codeP = getProp(obj, 'code');

    if (!idP || !titleP || !catP) throw new Error('Objeto sin id/title/cat.');
    const id = idP.value.value;
    const title = titleP.value.value;
    const cat = catP.value.value;

    if (seenId.has(id)) throw new Error('ID duplicado en el prototipo: ' + id);
    if (seenTitle.has(title)) throw new Error('Título duplicado en el prototipo: ' + title);
    seenId.add(id);
    seenTitle.add(title);

    let objSrc = script.slice(obj.start, obj.end);

    // Inserta un marcador-comentario justo antes del método render (offset por AST,
    // robusto frente a 'render(' que aparezca dentro de strings prompt/code).
    if (renderP) {
      const rel = renderP.start - obj.start;
      objSrc = objSrc.slice(0, rel) + RENDER_MARK + '\n  ' + objSrc.slice(rel);
    }

    const usesShader = objSrc.includes('shaderPreview(');
    const usesCanvas = objSrc.includes('canvasPreview(');
    const imports = [];
    if (usesShader) imports.push('shaderPreview');
    if (usesCanvas) imports.push('canvasPreview');

    const header =
      (imports.length
        ? `import { ${imports.join(', ')} } from '../_runtime.js';\n`
        : '') +
      `/** @type {import('../types.js').Effect} */\n`;

    const file = `${header}const effect = ${objSrc};\nexport default effect;\n`;

    const dir = resolve(EFFECTS_DIR, slug(cat));
    mkdirSync(dir, { recursive: true });
    writeFileSync(resolve(dir, `${id}.js`), file, 'utf8');

    perCat[cat] = (perCat[cat] || 0) + 1;
    if (codeP) withCode++;
    manifest.push({ id, title, cat, slug: slug(cat) });
  }

  // _runtime.js — helpers verbatim + export.
  const runtime =
    `/**\n` +
    ` * _runtime.js — helpers compartidos por las previews. SIN dependencias.\n` +
    ` * Extraídos verbatim del prototipo (no reescribir a mano).\n` +
    ` */\n` +
    `export ${helpers.shaderPreview}\n\n` +
    `export ${helpers.canvasPreview}\n`;
  writeFileSync(resolve(EFFECTS_DIR, '_runtime.js'), runtime, 'utf8');

  // _cat-order.js — orden de categorías (verbatim).
  const catSrc = script.slice(catOrderNode.start, catOrderNode.end);
  writeFileSync(
    resolve(EFFECTS_DIR, '_cat-order.js'),
    `// Orden de aparición de categorías (verbatim del prototipo).\nexport const CAT_ORDER = ${catSrc};\n`,
    'utf8'
  );

  // Reporte.
  console.log(`\n[extract] ${elements.length} efectos extraídos.`);
  console.log(`[extract] con code: ${withCode} · derivan de render: ${elements.length - withCode}`);
  for (const c of catOrder) console.log(`  · ${c}: ${perCat[c] || 0}`);
  const extra = Object.keys(perCat).filter((c) => !catOrder.includes(c));
  if (extra.length) console.warn('[extract] categorías fuera de CAT_ORDER:', extra);
  console.log('[extract] OK\n');
}

main();
