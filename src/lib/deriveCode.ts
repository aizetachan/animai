import type { EffectEntry } from '../effects/types';

const RENDER_MARK = '/* @render-start */';

/**
 * Devuelve el código a mostrar en el toggle.
 * - Si el efecto trae `code` (los 166 React/R3F reales), se usa tal cual.
 * - Si no, se extrae el cuerpo de render() desde la fuente ?raw del módulo,
 *   usando el marcador insertado por extract.mjs. Es el código EXACTO que corre
 *   (no se ofusca con la minificación, a diferencia de render.toString()).
 */
export function deriveCode(it: EffectEntry): string {
  if (it.code) return it.code;

  const src = it.source || '';
  const mark = src.indexOf(RENDER_MARK);
  if (mark < 0) return src.trim();

  let body = src.slice(mark + RENDER_MARK.length);
  // Recorta el cierre del objeto + el export del final del archivo.
  body = body.replace(/\n\};\s*export default effect;?\s*$/, '');
  body = body.trim().replace(/^render\s*\(el\)\s*\{/, 'function effect(el){');

  const head =
    src.includes('shaderPreview(')
      ? '// Mini-runner WebGL (quad fullscreen, uniforms u_res/u_t).\n// Pega shaderPreview() de _runtime.js y llama:\n'
      : src.includes('canvasPreview(')
        ? '// Helper canvasPreview() de _runtime.js (canvas 2D con DPR). Luego:\n'
        : '// Efecto autocontenido (CSS/SVG/DOM). Monta dentro de un contenedor:\n';

  return head + body;
}
