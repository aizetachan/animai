import { useEffect, useMemo, useState } from 'react';
import { ITEMS } from '../effects';
import Nav from '../components/Nav';
import CatChips from '../components/CatChips';
import EffectCard from '../components/EffectCard';
import { useLanguage } from '../contexts/LanguageContext';
import { logPageView } from '../lib/analytics';

export default function Gallery() {
  const [activeCat, setActiveCat] = useState('Todos');
  const [query, setQuery] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    logPageView('/gallery');
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ITEMS.filter((it) => {
      const okCat = activeCat === 'Todos' || it.cat === activeCat;
      const hay = (it.title + ' ' + it.desc + ' ' + it.cat + ' ' + it.tags.join(' ')).toLowerCase();
      return okCat && (!q || hay.includes(q));
    });
  }, [activeCat, query]);

  const filtered = activeCat !== 'Todos' || query.trim() !== '';

  return (
    <>
      <Nav query={query} setQuery={setQuery} />
      <header className="gallery-head">
        <div className="wrap">
          <div className="eyebrow">Animai</div>
          <h1>
            {t('gallery.title1')}
            <span className="grad">{t('gallery.title2')}</span>
            {t('gallery.title3')}
          </h1>
          <p className="sub">
            {t('gallery.sub')}
          </p>
        </div>
      </header>

      <div className="controls">
        <CatChips active={activeCat} onSelect={setActiveCat} />
      </div>

      <main className="wrap">
        {list.length > 0 ? (
          <div className="grid">
            {list.map((it) => (
              <EffectCard key={it.id} effect={it} />
            ))}
          </div>
        ) : (
          <div className="empty">{t('gallery.empty')}</div>
        )}
      </main>

      <footer>
        <div className="wrap" dangerouslySetInnerHTML={{
          __html: t('gallery.footer', { count: ITEMS.length })
        }} />
      </footer>
    </>
  );
}
