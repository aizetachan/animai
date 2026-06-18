import { useEffect, useRef, useState } from 'react';
import type { Effect, PreviewHandle } from '../effects/types';
import { observePreview } from '../lib/previewObserver';
import { prefersReducedMotion, onReducedMotionChange } from '../lib/reducedMotion';
import { useLanguage } from '../contexts/LanguageContext';
import { logEffectView, logEffectInteraction } from '../lib/analytics';

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
  const { t } = useLanguage();

  useEffect(() => onReducedMotionChange(setReduced), []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const start = () => {
      if (handleRef.current || paused) return;
      try {
        handleRef.current = effect.render(host);
        logEffectView(effect.id, effect.title);
      } catch (err) {
        console.warn('[animai] preview ' + effect.id + ' falló:', err);
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
    logEffectInteraction(effect.id, effect.title, 'play_manual');
  };

  return (
    <div className={'preview ' + className}>
      {badge && <div className="badge">{t('cat.' + effect.cat)}</div>}
      <div ref={hostRef} className="preview-host" />
      {failed && <div className="preview-msg">{t('preview.unavailable')}</div>}
      {paused && !failed && (
        <button className="preview-play" onClick={playOnce} aria-label={t('preview.play_animation')}>
          <span>▶</span> {t('preview.reduced_motion')}
        </button>
      )}
    </div>
  );
}
