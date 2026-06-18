# Animai

Catálogo/galería web de animaciones y efectos para landing pages, de **Nakama Studio**.
219 efectos en 12 categorías, cada uno con **preview en vivo real** y un toggle que alterna
entre **prompt** y **código fuente**. **Cero dependencias de runtime en las previews**
(WebGL/Canvas/CSS nativos); React es solo el shell.

## Arrancar

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite). |
| `npm run build` | Valida el catálogo y compila a `dist/`. |
| `npm run preview` | Sirve el build de producción. |
| `npm run validate` | Valida el catálogo (acorn 2022, ids/títulos únicos, backticks, `<script src=`). |
| `npm run extract` | **One-shot.** Re-genera los efectos desde `motion-gallery.html`. |
| `npm run typecheck` | `tsc --noEmit`. |

## Dos vistas

- **`/`** — Landing (marketing): hero con efectos reales como demo viva, categorías destacadas, CTAs.
- **`/gallery`** — Galería: buscador, filtros por categoría con contador, 219 previews en vivo y
  toggle prompt/código.

## Arquitectura

```
motion-gallery.html        # prototipo monolítico original (fuente de extracción, referencia)
scripts/
  extract.mjs              # corta el monolito en módulos vía AST acorn (verbatim, no reescribe render)
  validate.mjs             # red de seguridad del catálogo (CI / pre-build)
src/
  main.tsx                 # router + validateCatalog runtime + guards globales
  routes/   Landing.tsx · Gallery.tsx
  components/  Nav · SearchBar · CatChips · EffectCard · Preview
  lib/
    previewObserver.ts     # 1 IntersectionObserver compartido (rootMargin 140px) → lazy-start
    deriveCode.ts          # código a mostrar (code: explícito, o render via ?raw)
    highlight.ts · reducedMotion.ts
  effects/
    _runtime.js            # helpers shaderPreview / canvasPreview (verbatim, 0 deps)
    _cat-order.js          # orden de categorías
    types.ts               # interface Effect
    index.ts               # glob: junta efectos + fuentes ?raw → ITEMS, CATS, catCount
    <categoria>/<id>.js    # 1 archivo por efecto (objeto + render() vanilla)
```

### Decisiones clave

- **Previews vanilla envueltas por `<Preview>`.** Cada efecto exporta `{ id, title, cat, tags,
  desc, meta?, prompt, code?, render(el) → { stop() } }`. `<Preview>` monta/desmonta `render`
  imperativamente; se reutiliza idéntico en landing y galería.
- **Lazy-start por visibilidad.** Un único `IntersectionObserver` (`rootMargin:140px`) arranca
  solo las previews visibles — imprescindible con 219 a la vez.
- **Código del toggle vía `?raw`.** Los 166 efectos con `code:` muestran ese texto. Los 53 sin
  `code:` muestran su `render()` real importado con `?raw` (inmune a la minificación del build,
  a diferencia de `render.toString()`). `extract.mjs` inserta un marcador `/* @render-start */`.
- **Accesibilidad.** `prefers-reduced-motion`: las previews **no auto-arrancan**; cada card
  ofrece "pulsa para reproducir" (movimiento iniciado por el usuario).

## Añadir un efecto

Crea `src/effects/<categoria>/<id>.js`:

```js
import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id: 'mi-efecto',            // único, kebab-case
  title: 'Mi Efecto',         // único
  cat: 'Partículas',          // debe existir en _cat-order.js (CAT_ORDER)
  tags: ['...'],
  desc: '...',
  prompt: `...`,
  // code: `...`,             // opcional; si falta, el toggle muestra render()
  /* @render-start */
  render(el) {
    const o = canvasPreview(el), x = o.x;
    /* ... */
    return { stop() { /* limpieza */ } };
  },
};
export default effect;
```

El glob lo recoge solo. Si la categoría es nueva, añádela a `CAT_ORDER` en `_cat-order.js`.
Luego `npm run validate`.

> Nota: `npm run build` deja un bundle ~1 MB (las 219 previews + sus fuentes `?raw` van eager).
> Funciona para testear; si más adelante interesa, las fuentes `?raw` pueden hacerse lazy
> (solo al abrir el toggle) y/o code-split por categoría.
