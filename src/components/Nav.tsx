import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import RequestModal from './RequestModal';

interface NavProps {
  query?: string;
  setQuery?: (v: string) => void;
}

export default function Nav({ query = '', setQuery }: NavProps) {
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const isGallery = location.pathname === '/gallery';

  const [hasTargetAnim, setHasTargetAnim] = useState(!!location.state?.triggerExploreAnim);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [showSearchBehind, setShowSearchBehind] = useState(false);

  const [requestOpen, setRequestOpen] = useState(false);

  const [hasLogoAnim, setHasLogoAnim] = useState(!!location.state?.triggerLogoAnim);
  const [isShrinking, setIsShrinking] = useState(false);
  const [isTextFading, setIsTextFading] = useState(false);
  const [isInputFading, setIsInputFading] = useState(false);
  const [isBtnAppearing, setIsBtnAppearing] = useState(false);

  useEffect(() => {
    if (hasTargetAnim) {
      if (location.state?.triggerExploreAnim) {
        window.history.replaceState({}, document.title);
      }

      const frame = requestAnimationFrame(() => {
        setIsExpanding(true);
      });

      const searchTimer = setTimeout(() => {
        setShowSearchBehind(true);
      }, 800);

      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 925); // 800ms expansion + 125ms hold = 925ms

      const endTimer = setTimeout(() => {
        setIsExpanding(false);
        setIsFading(false);
        setShowSearchBehind(false);
        setHasTargetAnim(false);
      }, 1725); // 925ms + 800ms fade = 1725ms

      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(searchTimer);
        clearTimeout(fadeTimer);
        clearTimeout(endTimer);
      };
    }
  }, [hasTargetAnim, location]);

  useEffect(() => {
    if (hasLogoAnim) {
      if (location.state?.triggerLogoAnim) {
        window.history.replaceState({}, document.title);
      }

      const frame = requestAnimationFrame(() => {
        setIsShrinking(true);
        setIsTextFading(true);
      });

      // Explore button starts appearing when shrinking completes (at 800ms)
      const btnTimer = setTimeout(() => {
        setIsBtnAppearing(true);
      }, 800);

      // Search input container holds for 500ms, then starts fading out at 1300ms
      const inputFadeTimer = setTimeout(() => {
        setIsInputFading(true);
      }, 1300); // 800ms shrinking + 500ms hold = 1300ms

      // Reset all animations once the complete sequence is done at 1900ms
      const endTimer = setTimeout(() => {
        setIsShrinking(false);
        setIsTextFading(false);
        setIsInputFading(false);
        setIsBtnAppearing(false);
        setHasLogoAnim(false);
      }, 1900); // 1300ms + 600ms container fade = 1900ms

      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(btnTimer);
        clearTimeout(inputFadeTimer);
        clearTimeout(endTimer);
      };
    }
  }, [hasLogoAnim, location]);

  const showSearch = hasTargetAnim ? showSearchBehind : (isGallery || hasLogoAnim);
  const showExploreBtn = !isGallery || hasTargetAnim || hasLogoAnim;

  return (
    <>
    <nav className="nav">
      <div className="wrap">
        <Link 
          to="/" 
          state={isGallery ? { triggerLogoAnim: true } : undefined} 
          className="brand"
        >
          Animai<span className="dot">.</span>
        </Link>
        <span className="spacer" />

        <div className="nav-actions-container">
          <button
            type="button"
            className="nav-request-btn"
            onClick={() => setRequestOpen(true)}
            aria-label={t('nav.request')}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>{t('nav.request')}</span>
          </button>

          {showSearch && (
            <div 
              className={`search nav-search ${(showSearchBehind || hasLogoAnim) ? 'behind' : ''} ${isShrinking ? 'shrinking' : ''} ${isTextFading ? 'text-fading' : ''} ${isInputFading ? 'input-fading' : ''}`}
            >
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={isGallery ? query : ''}
                onChange={(e) => setQuery?.(e.target.value)}
                placeholder={t('search.placeholder')}
                autoComplete="off"
                aria-label={t('search.label')}
                readOnly={!isGallery}
              />
            </div>
          )}

          {showExploreBtn && (
            <Link
              to="/gallery"
              state={{ triggerExploreAnim: true }}
              className={`btn-primary nav-explore-btn ${isExpanding ? 'expanding' : ''} ${isFading ? 'fading' : ''} ${hasLogoAnim ? 'logo-anim-init' : ''} ${isBtnAppearing ? 'logo-anim-appearing' : ''}`}
              onClick={(e) => {
                if (isGallery) {
                  e.preventDefault();
                }
              }}
            >
              <span>{t('nav.explore')}</span>
            </Link>
          )}
        </div>

        <select
          className="select-lang"
          value={lang}
          onChange={(e) => setLang(e.target.value as any)}
          aria-label="Cambiar idioma / Change language / 切换语言"
        >
          <option value="es">ES</option>
          <option value="en">EN</option>
          <option value="zh">中文</option>
        </select>
      </div>
    </nav>
    <RequestModal open={requestOpen} onClose={() => setRequestOpen(false)} />
    </>
  );
}
