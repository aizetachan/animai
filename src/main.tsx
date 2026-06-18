import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/global.css';
import Landing from './routes/Landing';
import Gallery from './routes/Gallery';
import { ITEMS, CAT_ORDER } from './effects';

/* Guard global: una preview que falle no debe tumbar la página entera. */
window.addEventListener('error', (ev) => {
  console.warn('[motion-lab] error capturado:', ev.message);
});
window.addEventListener('unhandledrejection', (ev) => {
  console.warn('[motion-lab] promesa rechazada:', ev.reason);
});

/* Red de seguridad: valida integridad del catálogo al cargar (solo avisa). */
(function validateCatalog() {
  const seen = new Set<string>();
  const titles = new Set<string>();
  const dupId: string[] = [];
  const dupTitle: string[] = [];
  const orphan = new Set<string>();
  for (const it of ITEMS) {
    if (seen.has(it.id)) dupId.push(it.id);
    else seen.add(it.id);
    if (titles.has(it.title)) dupTitle.push(it.title);
    else titles.add(it.title);
    if (!CAT_ORDER.includes(it.cat)) orphan.add(it.cat);
  }
  const tag = '[Motion Lab]';
  console.log(`${tag} ${ITEMS.length} efectos cargados en ${new Set(ITEMS.map((i) => i.cat)).size} categorías.`);
  if (dupId.length) console.warn(`${tag} IDs duplicados:`, dupId);
  if (dupTitle.length) console.warn(`${tag} Títulos duplicados:`, dupTitle);
  if (orphan.size) console.warn(`${tag} Categorías sin orden en CAT_ORDER:`, [...orphan]);
})();

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/gallery', element: <Gallery /> },
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
