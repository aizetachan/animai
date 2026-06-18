/** @type {import('../types.js').Effect} */
const effect = {
  id:'ui-spotlight-svg', title:'Hero Spotlight', cat:'UI Components',
  tags:['spotlight','foco','hero','aceternity','luz','atención'],
  desc:'Foco de luz cónico que ilumina una esquina del hero. El Spotlight de Aceternity, fijo y elegante.',
  meta:['Aceternity UI','SVG blur','Hero'],
  prompt:`Recrea el Spotlight de Aceternity UI: un haz de luz elíptico difuminado que entra desde una esquina superior del hero e ilumina el contenido.
Se hace con un SVG de una elipse con gaussian blur fuerte y baja opacidad, posicionado absolute y con una animación sutil de entrada (translate + opacity).
Sobre fondo oscuro casi negro. Da dramatismo a títulos de landing.`,
  code:`// Aceternity UI — Spotlight (SVG + Tailwind)
export const Spotlight = ({ className }) => (
  <svg className={cn('animate-spotlight pointer-events-none absolute', className)}
    viewBox="0 0 3787 2842" fill="none">
    <g filter="url(#blur)">
      <ellipse cx="1924" cy="273" rx="1924" ry="273"
        transform="matrix(-0.82 -0.57 -0.57 0.82 3631 2291)"
        fill="#7b5cff" fillOpacity="0.21" />
    </g>
    <defs><filter id="blur"><feGaussianBlur stdDeviation="151" /></filter></defs>
  </svg>
)`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;overflow:hidden;background:#070710;display:grid;place-items:center';
    s.innerHTML='<div style="position:absolute;width:260px;height:160px;left:-40px;top:-30px;background:radial-gradient(ellipse at center,rgba(123,92,255,.5),transparent 70%);filter:blur(30px);transform:rotate(-25deg)"></div><div style="position:relative;font-size:24px;font-weight:800;color:#eef0f7;text-align:center;letter-spacing:-.02em">Spotlight<br><span style="color:#7b5cff">on you</span></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
