import { useEffect, useRef, useState } from 'react';
import type { Effect, PreviewHandle } from '../effects/types';
import { observePreview } from '../lib/previewObserver';
import { prefersReducedMotion, onReducedMotionChange } from '../lib/reducedMotion';

interface Props {
  effect: Effect;
  /** badge de categoría arriba a la izquierda */
  badge?: boolean;
  className?: string;
}

/**
 * Envoltura imperativa de una preview vanilla (0 deps de runtime).
 * - Lazy-start por visibilidad vía el IntersectionObserver compartido.
 * - Respeta prefers-reduced-motion: no auto-arranca; ofrece reproducir al pulsar.
 * - try/catch por preview: un fallo no tumba la página.
 */
export default function Preview({ effect, badge = true, className = '' }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<PreviewHandle | null>(null);
  const [reduced, setReduced] = useState(prefersReducedMotion());
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(reduced); // pausado manualmente (reduced-motion)
  const visibleRef = useRef(false);

  useEffect(() => onReducedMotionChange(setReduced), []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const start = () => {
      if (handleRef.current || paused) return;
      try {
        handleRef.current = effect.render(host);
      } catch (err) {
        console.warn('[motion-lab] preview ' + effect.id + ' falló:', err);
        setFailed(true);
      }
    };
    const stop = () => {
      if (handleRef.current) {
        try {
          handleRef.current.stop();
        } catch {
          /* noop */
        }
        handleRef.current = null;
      }
    };

    const unobserve = observePreview(host, {
      onEnter: () => {
        visibleRef.current = true;
        start();
      },
      onLeave: () => {
        visibleRef.current = false;
        stop();
      },
    });

    return () => {
      unobserve();
      stop();
    };
    // paused entra como dep para re-evaluar el arranque al reproducir manualmente.
  }, [effect, paused]);

  const playOnce = () => {
    setPaused(false);
    // el efecto arrancará en el siguiente render si está visible.
  };

  return (
    <div className={'preview ' + className}>
      {badge && <div className="badge">{effect.cat}</div>}
      <div ref={hostRef} className="preview-host" />
      {failed && <div className="preview-msg">preview no disponible</div>}
      {paused && !failed && (
        <button className="preview-play" onClick={playOnce} aria-label="Reproducir animación">
          <span>▶</span> Movimiento reducido · pulsa para reproducir
        </button>
      )}
    </div>
  );
}
