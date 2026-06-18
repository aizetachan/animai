import { useMemo, useState } from 'react';
import { ITEMS } from '../effects';
import Nav from '../components/Nav';
import SearchBar from '../components/SearchBar';
import CatChips from '../components/CatChips';
import EffectCard from '../components/EffectCard';

export default function Gallery() {
  const [activeCat, setActiveCat] = useState('Todos');
  const [query, setQuery] = useState('');

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
      <Nav />
      <header className="gallery-head">
        <div className="wrap">
          <div className="eyebrow">Motion Lab</div>
          <h1>
            Animaciones que hacen <span className="grad">respirar</span>
            <br />
            una landing page
          </h1>
          <p className="sub">
            Catálogo de efectos para web: shaders WebGL, scroll, tipografía animada, partículas, SVG
            y microinteracciones. Cada uno con preview en vivo y un prompt listo para copiar. Sin
            dependencias externas: todo corre en Canvas/WebGL nativo.
          </p>
        </div>
      </header>

      <div className="controls">
        <SearchBar
          value={query}
          onChange={setQuery}
          count={list.length}
          total={ITEMS.length}
          filtered={filtered}
        />
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
          <div className="empty">Sin resultados. Prueba con otra palabra o categoría.</div>
        )}
      </main>

      <footer>
        <div className="wrap">
          Motion Lab · {ITEMS.length} efectos con preview real en WebGL + Canvas + SVG · botón{' '}
          <code>&lt;/&gt;</code> para ver el código · sin dependencias externas · prompts
          orientativos, ajústalos a tu stack
        </div>
      </footer>
    </>
  );
}
