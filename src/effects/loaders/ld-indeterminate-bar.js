/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-indeterminate-bar', title:'Indeterminate Bar', cat:'Loaders',
  tags:['css','loader','progress','barra','indeterminate','progreso','0 js'],
  desc:'Barra de progreso indeterminada estilo Material: un segmento que se desliza y estira de un lado a otro.',
  meta:['keyframes','0 JS'],
  prompt:`Crea una barra de progreso indeterminada en puro CSS.
Un contenedor track rectangular (ancho 100%, alto ~5px, border-radius, fondo oscuro semitransparente, overflow:hidden). Dentro un segmento absolute coloreado con gradiente acento->secundario.
Anima el segmento con @keyframes que combinan left y width: empieza fuera por la izquierda (left:-35%;width:35%), avanza hasta la derecha estirándose y encogiéndose y sale por la derecha (left:100%). Usa cubic-bezier para un movimiento natural. Duración ~1.6s infinite. Opcional: segundo segmento con delay para llenar el ritmo.`,
  code:`.ib-track {
  width: 200px; height: 5px; border-radius: 4px;
  background: rgba(255,255,255,.08); overflow: hidden; position: relative;
}
.ib-fill {
  position: absolute; top: 0; bottom: 0; border-radius: 4px;
  background: linear-gradient(90deg, #7b5cff, #00e0c6);
  animation: ib-slide 1.6s cubic-bezier(.65,.05,.36,1) infinite;
}
@keyframes ib-slide {
  0%   { left: -40%; width: 40%; }
  50%  { left: 25%;  width: 60%; }
  100% { left: 100%; width: 30%; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes ldIbSlide{0%{left:-40%;width:40%}50%{left:25%;width:60%}100%{left:100%;width:30%}}</style><div style="width:200px;height:5px;border-radius:4px;background:rgba(255,255,255,.08);overflow:hidden;position:relative"><div style="position:absolute;top:0;bottom:0;border-radius:4px;background:linear-gradient(90deg,#7b5cff,#00e0c6);animation:ldIbSlide 1.6s cubic-bezier(.65,.05,.36,1) infinite"></div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
