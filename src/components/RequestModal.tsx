import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { submitFeedback, FeedbackType } from '../lib/feedback';

interface RequestModalProps {
  open: boolean;
  onClose: () => void;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

const TYPES: FeedbackType[] = ['animation', 'bug', 'other'];

export default function RequestModal({ open, onClose }: RequestModalProps) {
  const { t } = useLanguage();

  const [type, setType] = useState<FeedbackType>('animation');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [touchedError, setTouchedError] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLButtonElement>(null);

  // Reset the form whenever the modal is (re)opened.
  useEffect(() => {
    if (open) {
      setType('animation');
      setMessage('');
      setEmail('');
      setStatus('idle');
      setTouchedError(false);
      // Focus the first field after the entrance frame.
      const frame = requestAnimationFrame(() => firstFieldRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
  }, [open]);

  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setTouchedError(true);
      return;
    }
    setStatus('sending');
    try {
      await submitFeedback({ type, message: message.trim(), email: email.trim() || undefined });
      setStatus('success');
    } catch (err) {
      console.error('[Animai] Error al enviar feedback:', err);
      setStatus('error');
    }
  };

  const sending = status === 'sending';

  return (
    <div
      className="request-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="request-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-title"
        ref={dialogRef}
      >
        <div className="request-spark-container">
          <div className="request-spark"></div>
        </div>

        <button
          type="button"
          className="request-close"
          onClick={onClose}
          aria-label={t('request.close')}
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {status === 'success' ? (
          <div className="request-success">
            <div className="request-success-icon">
              <svg viewBox="0 0 24 24" width="28" height="28">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 id="request-title">{t('request.success.title')}</h3>
            <p>{t('request.success.text')}</p>
            <button type="button" className="btn-primary request-done-btn" onClick={onClose}>
              {t('request.close')}
            </button>
          </div>
        ) : (
          <form className="request-form" onSubmit={handleSubmit}>
            <div className="request-header">
              <h3 id="request-title">{t('request.title')}</h3>
              <p>{t('request.subtitle')}</p>
            </div>

            <div className="request-body">
            <fieldset className="request-field">
              <legend>{t('request.type.label')}</legend>
              <div className="request-type-group" role="radiogroup">
                {TYPES.map((value, i) => (
                  <button
                    key={value}
                    ref={i === 0 ? firstFieldRef : undefined}
                    type="button"
                    role="radio"
                    aria-checked={type === value}
                    className={`request-type-chip ${type === value ? 'active' : ''}`}
                    onClick={() => setType(value)}
                  >
                    {t(`request.type.${value}`)}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="request-field">
              <span>{t('request.message.label')}</span>
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (touchedError) setTouchedError(false);
                }}
                placeholder={t('request.message.placeholder')}
                rows={4}
                className={touchedError ? 'has-error' : ''}
                disabled={sending}
              />
              {touchedError && <span className="request-error-msg">{t('request.required')}</span>}
            </label>

            <label className="request-field">
              <span>{t('request.email.label')}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('request.email.placeholder')}
                autoComplete="email"
                disabled={sending}
              />
            </label>

            {status === 'error' && <p className="request-error-banner">{t('request.error')}</p>}
            </div>

            <div className="request-actions">
              <button
                type="button"
                className="request-cancel-btn"
                onClick={onClose}
                disabled={sending}
              >
                {t('request.cancel')}
              </button>
              <button type="submit" className="btn-primary request-submit-btn" disabled={sending}>
                {sending ? t('request.sending') : t('request.submit')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
