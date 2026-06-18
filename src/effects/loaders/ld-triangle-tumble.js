/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-triangle-tumble', title:'Triangle Tumble', cat:'Loaders',
  tags:['css','loader','triangle','triangulo','tumble','rodar','0 js'],
  desc:'Un triángulo que rueda esquina sobre esquina sobre una línea base, dando saltos de 120 grados.',
  meta:['transform-origin','0 JS'],
  prompt:`Crea un loader de un triángulo que "rueda" pivotando sobre sus vértices.
Dibuja un triángulo equilátero con clip-path:polygon(50% 0,100% 100%,0 100%) o con borders. Colócalo sobre una línea base invisible.
La animación rota el triángulo de 120 en 120 grados, cambiando el transform-origin a cada vértice de apoyo en cada tercio del ciclo (usa @keyframes con steps de rotación: 0deg, 120deg, 240deg, 360deg).
Para que parezca que rueda, alterna transform-origin entre la esquina inferior-izquierda y la inferior-derecha. Duración ~1.5s linear infinite.`,
  code:`.tt-wrap { width: 60px; height: 60px; position: relative; }
.tt-tri {
  width: 0; height: 0;
  border-left: 28px solid transparent;
  border-right: 28px solid transparent;
  border-bottom: 48px solid #7b5cff;
  transform-origin: 0% 100%;
  animation: tt-roll 1.5s linear infinite;
}
@keyframes tt-roll {
  0%   { transform: rotate(0deg);   transform-origin: 0% 100%; }
  33%  { transform: rotate(120deg); transform-origin: 0% 100%; }
  34%  { transform-origin: 100% 100%; }
  66%  { transform: rotate(240deg); transform-origin: 100% 100%; }
  67%  { transform-origin: 0% 100%; }
  100% { transform: rotate(360deg); transform-origin: 0% 100%; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes ldTtRoll{0%{transform:rotate(0deg);transform-origin:0% 100%}33%{transform:rotate(120deg);transform-origin:0% 100%}34%{transform-origin:100% 100%}66%{transform:rotate(240deg);transform-origin:100% 100%}67%{transform-origin:0% 100%}100%{transform:rotate(360deg);transform-origin:0% 100%}}</style><div style="width:60px;height:60px;display:grid;place-items:end center"><div style="width:0;height:0;border-left:28px solid transparent;border-right:28px solid transparent;border-bottom:48px solid #7b5cff;animation:ldTtRoll 1.5s linear infinite"></div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
