import { Link } from 'react-router-dom';
import { ITEMS, CAT_ORDER, catCount } from '../effects';
import type { EffectEntry } from '../effects/types';
import Nav from '../components/Nav';
import Preview from '../components/Preview';

const byId = (id: string): EffectEntry | undefined => ITEMS.find((e) => e.id === id);
const firstOfCat = (cat: string): EffectEntry | undefined => ITEMS.find((e) => e.cat === cat);

// Demo viva del hero (con fallback al primer shader si cambiara el catálogo).
const heroEffect =
  byId('aurora') || ITEMS.find((e) => e.cat === 'Shaders WebGL') || ITEMS[0];

const features = [
  {
    h: 'Preview en vivo real',
    p: 'Cada efecto se ve funcionando de verdad, no un gif. WebGL, Canvas 2D y CSS nativos.',
  },
  {
    h: 'Prompt + código',
    p: 'Un toggle alterna entre el prompt descriptivo y el código fuente exacto que produce el efecto.',
  },
  {
    h: 'Cero dependencias',
    p: 'Las previews no cargan ninguna librería ni CDN. Copia, pega y funciona en tu landing.',
  },
  {
    h: 'Rendimiento por visibilidad',
    p: 'Solo se animan las previews visibles (IntersectionObserver). 219 efectos sin fundir el navegador.',
  },
];

export default function Landing() {
  return (
    <>
      <Nav />

      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          {heroEffect && <Preview effect={heroEffect} badge={false} />}
        </div>
        <div className="hero-inner wrap">
          <div className="eyebrow">Nakama Studio · Motion Lab</div>
          <h1>
            El catálogo de animaciones
            <br />
            que hace <span className="grad">respirar</span> tus landings
          </h1>
          <p className="sub">
            {ITEMS.length} efectos listos para usar —shaders, 3D, scroll, tipografía, partículas,
            SVG y microinteracciones— con preview en vivo y código copiable. Sin dependencias
            externas.
          </p>
          <div className="hero-cta">
            <Link to="/gallery" className="btn-primary">
              Explorar los {ITEMS.length} efectos
            </Link>
            <a href="#categorias" className="btn-ghost">
              Ver categorías
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="n">{ITEMS.length}</div>
              <div className="l">Efectos</div>
            </div>
            <div className="stat">
              <div className="n">{CAT_ORDER.length}</div>
              <div className="l">Categorías</div>
            </div>
            <div className="stat">
              <div className="n">0</div>
              <div className="l">Dependencias</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <h2>Una herramienta de motion para producto real</h2>
        <p className="lead">
          Motion Lab es a la vez nuestra biblioteca interna de Nakama Studio y un recurso público:
          inspiración y código de partida para equipos de diseño y desarrollo que quieren añadir
          movimiento con intención.
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
        <h2>Explora por categoría</h2>
        <p className="lead">Cada tarjeta es una preview viva. Entra a la galería para el resto.</p>
        <div className="cat-grid">
          {CAT_ORDER.map((cat) => {
            const rep = firstOfCat(cat);
            if (!rep) return null;
            return (
              <Link to="/gallery" className="cat-tile" key={cat}>
                <Preview effect={rep} badge={false} />
                <div className="cap">
                  <span className="name">{cat}</span>
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
            ¿Listo para <span className="grad">moverte</span>?
          </h2>
          <Link to="/gallery" className="btn-primary">
            Abrir la galería
          </Link>
        </div>
      </section>

      <footer>
        <div className="wrap">Motion Lab · Nakama Studio · diseño UX/UI + producción AI</div>
      </footer>
    </>
  );
}
