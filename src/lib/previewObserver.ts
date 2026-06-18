/**
 * Un único IntersectionObserver para TODAS las previews (igual que el prototipo,
 * rootMargin 140px). Las previews fuera de viewport no se animan: con 219 a la vez
 * el rendimiento depende de esto. Cada elemento registra sus callbacks de entrada/salida.
 */
type Cbs = { onEnter: () => void; onLeave: () => void };

const registry = new WeakMap<Element, Cbs>();
let observer: IntersectionObserver | null = null;

function ensure(): IntersectionObserver | null {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const cbs = registry.get(e.target);
          if (!cbs) continue;
          if (e.isIntersecting) cbs.onEnter();
          else cbs.onLeave();
        }
      },
      { rootMargin: '140px', threshold: 0.01 }
    );
  }
  return observer;
}

export function observePreview(el: Element, cbs: Cbs): () => void {
  const io = ensure();
  if (!io) {
    // Sin IO disponible: arranca directamente (fallback degradado).
    cbs.onEnter();
    return () => cbs.onLeave();
  }
  registry.set(el, cbs);
  io.observe(el);
  return () => {
    io.unobserve(el);
    registry.delete(el);
  };
}
