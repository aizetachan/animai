/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-theme-toggle', title:'Theme Toggle Morph', cat:'CSS Moderno',
  tags:['theme','toggle','dark','light','sol','luna','morph','switch'],
  desc:'El icono sol se transforma en luna al cambiar de tema. Morphing suave del switch.',
  meta:['SVG morph','mask','Toggle'],
  prompt:`Crea un toggle de tema donde el icono sol↔luna se transforma con morphing al cambiar (no un simple swap).
Técnica clásica: un círculo (sol) al que una máscara/segundo círculo desplazado le "muerde" un lado para convertirlo en luna creciente; los rayos del sol aparecen/desaparecen escalando. Anima la máscara y los rayos.
El detalle de UX que da gusto pulsar.`,
  code:`/* Theme toggle morph — una máscara muerde el sol para hacer la luna */
.sun { fill: #ffd166; transition: transform .5s; }
.moon-mask { cx: 30; transition: cx .5s; }   /* al activar -> cx: 12 (muerde) */
.rays { opacity: 1; transition: opacity .4s; } /* al activar -> 0 */
[data-theme="dark"] .moon-mask { cx: 12; }
[data-theme="dark"] .rays { opacity: 0; }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<svg width="70" height="70" viewBox="0 0 50 50"><defs><mask id="mm"><rect width="50" height="50" fill="#fff"/><circle id="bite" cx="40" cy="15" r="13" fill="#000"/></mask></defs><g id="rays" style="transition:opacity .5s">'+Array.from({length:8},(_,i)=>{const a=i/8*6.283;return '<line x1="'+(25+Math.cos(a)*16)+'" y1="'+(25+Math.sin(a)*16)+'" x2="'+(25+Math.cos(a)*21)+'" y2="'+(25+Math.sin(a)*21)+'" stroke="#ffd166" stroke-width="2.5" stroke-linecap="round"/>';}).join('')+'</g><circle cx="25" cy="25" r="11" fill="#ffd166" mask="url(#mm)" id="orb" style="transition:fill .5s"/></svg>';
    el.appendChild(s);const bite=s.querySelector('#bite'),rays=s.querySelector('#rays'),orb=s.querySelector('#orb');let dark=false,raf,run=true,t=0;
    function set(){bite.setAttribute('cx',dark?17:40);rays.style.opacity=dark?'0':'1';orb.setAttribute('fill',dark?'#c9d1e8':'#ffd166');}
    (function loop(){if(!run)return;t++;if(t%80===0){dark=!dark;set();}raf=requestAnimationFrame(loop);})();bite.style.transition='cx .5s';
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
