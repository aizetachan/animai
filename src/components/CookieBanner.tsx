import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { initAnalytics } from '../lib/firebase';
import { logPageView } from '../lib/analytics';

export default function CookieBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if consent is already decided
    const consent = localStorage.getItem('animai_cookie_consent');
    if (!consent) {
      // Delay showing the banner slightly for a smoother visual entrance
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    } else if (consent === 'accepted') {
      // If already accepted, initialize analytics silently on mount
      initAnalytics();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('animai_cookie_consent', 'accepted');
    setVisible(false);
    initAnalytics().then(() => {
      // Log current page view immediately upon acceptance
      logPageView(window.location.pathname);
    });
  };

  const handleDecline = () => {
    localStorage.setItem('animai_cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner-wrapper" role="alert" aria-live="polite">
      <div className="cookie-banner">
        <div className="cookie-spark-container">
          <div className="cookie-spark"></div>
        </div>
        <div className="cookie-content">
          <h4>{t('cookie.title')}</h4>
          <p>{t('cookie.text')}</p>
        </div>
        <div className="cookie-actions">
          <button className="cookie-btn cookie-btn-decline" onClick={handleDecline}>
            {t('cookie.decline')}
          </button>
          <button className="cookie-btn cookie-btn-accept" onClick={handleAccept}>
            {t('cookie.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
