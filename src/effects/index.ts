import type { Effect, EffectEntry } from './types';
import { CAT_ORDER } from './_cat-order.js';

/**
 * Carga automática de los 219 efectos.
 * - Patrón `./*​/*.js` = solo archivos dentro de subcarpetas de categoría
 *   (excluye _runtime.js / _cat-order.js del nivel superior).
 * - `modules`: el objeto ejecutable (default export).
 * - `sources`: el texto fuente del archivo vía ?raw (inmune a la minificación
 *   del build) → es lo que muestra el toggle de código de los efectos sin `code:`.
 * Añadir un efecto = crear un archivo nuevo; el glob lo recoge solo.
 */
const modules = import.meta.glob<{ default: Effect }>('./*/*.js', { eager: true });
const sources = import.meta.glob('./*/*.js', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

export const ITEMS: EffectEntry[] = Object.entries(modules)
  .map(([path, mod]) => ({ ...mod.default, source: sources[path] ?? '' }))
  .sort((a, b) => a.title.localeCompare(b.title, 'es'));

export { CAT_ORDER };

/** Categorías realmente presentes en ITEMS, ordenadas según CAT_ORDER. */
const present = [...new Set(ITEMS.map((it) => it.cat))];
export const CATS: string[] = [
  'Todos',
  ...present.slice().sort((a, b) => {
    const ia = CAT_ORDER.indexOf(a);
    const ib = CAT_ORDER.indexOf(b);
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
  }),
];

export function catCount(c: string): number {
  return c === 'Todos' ? ITEMS.length : ITEMS.filter((it) => it.cat === c).length;
}
