import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ITEMS, CAT_ORDER, catCount } from '../effects';
import type { EffectEntry } from '../effects/types';
import Nav from '../components/Nav';
import Preview from '../components/Preview';
import HeroFloatingPreviews from '../components/HeroFloatingPreviews';
import { useLanguage } from '../contexts/LanguageContext';
import { logPageView } from '../lib/analytics';

const byId = (id: string): EffectEntry | undefined => ITEMS.find((e) => e.id === id);
const firstOfCat = (cat: string): EffectEntry | undefined => ITEMS.find((e) => e.cat === cat);

// Demo viva del hero (con fallback al primer shader si cambiara el catálogo).
const heroEffect =
  byId('aurora') || ITEMS.find((e) => e.cat === 'Shaders WebGL') || ITEMS[0];

export default function Landing() {
  const { t } = useLanguage();

  useEffect(() => {
    logPageView('/');
  }, []);

  const features = [
    {
      h: t('landing.features.0.h'),
      p: t('landing.features.0.p'),
    },
    {
      h: t('landing.features.1.h'),
      p: t('landing.features.1.p'),
    },
    {
      h: t('landing.features.2.h'),
      p: t('landing.features.2.p'),
    },
    {
      h: t('landing.features.3.h'),
      p: t('landing.features.3.p'),
    },
  ];

  return (
    <>
      <Nav />

      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <HeroFloatingPreviews />
        <div className="hero-inner wrap">
          <div className="eyebrow">{t('landing.eyebrow')}</div>
          <h1>
            {t('landing.hero.title1')}
            <br />
            {t('landing.hero.title2')}
            <span className="grad">{t('landing.hero.title3')}</span>
            {t('landing.hero.title4')}
          </h1>
          <p className="sub">
            {t('landing.hero.sub')}
          </p>
          <div className="hero-cta">
            <Link to="/gallery" className="btn-primary">
              {t('landing.hero.cta.explore', { count: ITEMS.length })}
            </Link>
            <a href="#categorias" className="btn-ghost">
              {t('landing.hero.cta.cats')}
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="n">{ITEMS.length}</div>
              <div className="l">{t('landing.hero.stats.effects')}</div>
            </div>
            <div className="stat">
              <div className="n">{CAT_ORDER.length}</div>
              <div className="l">{t('landing.hero.stats.cats')}</div>
            </div>
            <div className="stat">
              <div className="n">0</div>
              <div className="l">{t('landing.hero.stats.deps')}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <h2>{t('landing.about.title')}</h2>
        <p className="lead">
          {t('landing.about.lead')}
        </p>
        <div className="feature-grid">
          {features.map((f) => (
            <div className="feature" key={f.h}>
              <h3>{f.h}</h3>
              <p>{f.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section wrap" id="categorias">
        <h2>{t('landing.cats.title')}</h2>
        <p className="lead">{t('landing.cats.lead')}</p>
        <div className="cat-grid">
          {CAT_ORDER.map((cat) => {
            const rep = firstOfCat(cat);
            if (!rep) return null;
            return (
              <Link to="/gallery" className="cat-tile" key={cat}>
                <Preview effect={rep} badge={false} />
                <div className="cap">
                  <span className="name">{t('cat.' + cat)}</span>
                  <span className="n">{catCount(cat)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2>
            {t('landing.cta.title1')}
            <span className="grad">{t('landing.cta.title2')}</span>
            {t('landing.cta.title3')}
          </h2>
          <Link to="/gallery" className="btn-primary">
            {t('landing.cta.btn')}
          </Link>
        </div>
      </section>

      <footer>
        <div className="wrap">{t('footer.text')}</div>
      </footer>
    </>
  );
}
