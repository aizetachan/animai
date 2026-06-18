/** @type {import('../types.js').Effect} */
const effect = {
  id:'tx-wave-hover', title:'Wave Hover Letters', cat:'Texto',
  tags:['texto','wave','ola','hover','letras','secuencia','bounce'],
  desc:'Las letras se elevan en secuencia formando una ola que recorre la palabra (auto-demo en bucle).',
  meta:['transform','Stagger','Por letra'],
  prompt:`Crea un efecto de letras que forman una "ola" al pasar el raton (hover) sobre el texto.
Tecnica: envuelve cada letra en un <span> inline-block. Al hacer hover sobre el contenedor, cada letra se eleva (translateY negativo) y vuelve, pero con un animation-delay creciente por indice (~50ms) para que el movimiento recorra la palabra de izquierda a derecha como una ola.
@keyframes: 0% translateY(0), 50% translateY(-14px) con un leve cambio de color al acento, 100% translateY(0). Timing ~0.5s ease.
Para la demo automatica: en lugar de hover real, reproduce la animacion en bucle aplicando los delays escalonados, esperando a que termine la ola y repitiendo. Texto blanco, acento #7b5cff en el pico.`,
  code:`<h2 class="wave">Animai</h2>
<style>
.wave span{display:inline-block;transition:transform .2s}
.wave:hover span{animation:wv .5s ease}
@keyframes wv{0%{transform:translateY(0)}50%{transform:translateY(-14px);color:#7b5cff}100%{transform:translateY(0)}}
</style>
<script>
const h=document.querySelector('.wave');const t=h.textContent;h.textContent='';
[...t].forEach((c,i)=>{const s=document.createElement('span');s.textContent=c;s.style.animationDelay=(i*0.05)+'s';h.appendChild(s);});
<\/script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.innerHTML='<style>'
      +'@keyframes txwv{0%{transform:translateY(0);color:#fff}50%{transform:translateY(-14px);color:#7b5cff}100%{transform:translateY(0);color:#fff}}'
      +'.txwv span{display:inline-block}'
      +'.txwv.on span{animation:txwv .5s ease}'
      +'</style>'
      +'<div style="height:100%;display:grid;place-items:center"><h2 class="txwv" style="margin:0;font-size:40px;font-weight:800;letter-spacing:-.01em;color:#fff"></h2></div>';
    el.appendChild(s);
    const h=s.querySelector('.txwv');const txt='Animai';
    [...txt].forEach((c,i)=>{const sp=document.createElement('span');sp.textContent=c;sp.style.animationDelay=(i*0.06)+'s';h.appendChild(sp);});
    const fire=()=>{h.classList.remove('on');void h.offsetWidth;h.classList.add('on');};
    fire();
    const t=setInterval(fire,1800);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
