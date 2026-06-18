import { useMemo, useState } from 'react';
import type { EffectEntry } from '../effects/types';
import Preview from './Preview';
import { deriveCode } from '../lib/deriveCode';
import { highlight } from '../lib/highlight';

export default function EffectCard({ effect }: { effect: EffectEntry }) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const codeStr = useMemo(() => deriveCode(effect), [effect]);

  const copy = () => {
    const txt = showCode ? codeStr : effect.prompt;
    navigator.clipboard
      .writeText(txt)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      })
      .catch(() => {});
  };

  return (
    <article className="card">
      <Preview effect={effect} />
      <div className="body">
        <h3>{effect.title}</h3>
        <p className="desc">{effect.desc}</p>
        <div className="prompt-wrap">
          <div className="prompt-head">
            <span className="lbl">{showCode ? 'Código' : 'Prompt'}</span>
            <div className="actions">
              <button
                className={'toggle' + (showCode ? ' on' : '')}
                title={showCode ? 'Ver prompt' : 'Ver código'}
                onClick={() => setShowCode((v) => !v)}
                aria-pressed={showCode}
              >
                {showCode ? (
                  <svg viewBox="0 0 24 24">
                    <path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" />
                    <path d="M9 20h6" />
                    <path d="M12 4v16" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d="m8 6-6 6 6 6" />
                    <path d="m16 6 6 6-6 6" />
                  </svg>
                )}
              </button>
              <button className={'copy' + (copied ? ' done' : '')} onClick={copy}>
                {copied ? (
                  '✓ Copiado'
                ) : (
                  <>
                    <svg viewBox="0 0 24 24">
                      <rect x="9" y="9" width="12" height="12" rx="2" />
                      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                    </svg>
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>
          {showCode ? (
            <pre className="prompt is-code" dangerouslySetInnerHTML={{ __html: highlight(codeStr) }} />
          ) : (
            <pre className="prompt">{effect.prompt}</pre>
          )}
        </div>
      </div>
    </article>
  );
}
