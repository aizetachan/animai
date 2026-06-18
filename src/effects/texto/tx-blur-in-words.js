/** @type {import('../types.js').Effect} */
const effect = {
  id:'tx-blur-in-words', title:'Blur In Words', cat:'Texto',
  tags:['texto','blur','desenfoque','stagger','entrada','reveal','words'],
  desc:'Las palabras de una frase entran desde un fuerte desenfoque con un stagger suave.',
  meta:['filter:blur','Stagger','Por palabra'],
  prompt:`Crea un reveal de entrada por palabra basado en desenfoque.
Tecnica: divide la frase en palabras y envuelve cada una en un <span> inline-block. Cada palabra se anima de un estado inicial (filter:blur(12px), opacity:0, translateY pequeno) a su estado final nitido (blur(0), opacity:1, translateY:0).
Stagger: aplica un animation-delay creciente por indice (~120ms por palabra) para que aparezcan en cascada.
Timing: ~0.8s cubic-bezier(.2,.8,.2,1) con fill both. Texto blanco sobre fondo oscuro; acento opcional en una palabra clave.`,
  code:`<p class="blur-in" aria-label="Diseno en movimiento puro"></p>
<style>
.blur-in span{display:inline-block;opacity:0;filter:blur(12px);animation:biw .8s cubic-bezier(.2,.8,.2,1) both}
@keyframes biw{from{opacity:0;filter:blur(12px);transform:translateY(8px)}to{opacity:1;filter:blur(0);transform:none}}
</style>
<script>
const p=document.querySelector('.blur-in');
'Diseno en movimiento puro'.split(' ').forEach((w,i)=>{const s=document.createElement('span');s.textContent=w+' ';s.style.animationDelay=(i*0.12)+'s';p.appendChild(s);});
<\/script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.innerHTML='<style>'
      +'@keyframes txbiw{from{opacity:0;filter:blur(12px);transform:translateY(8px)}to{opacity:1;filter:blur(0);transform:none}}'
      +'.txbiw span{display:inline-block;animation:txbiw .8s cubic-bezier(.2,.8,.2,1) both}'
      +'.txbiw .ac{color:#7b5cff}'
      +'</style>'
      +'<div style="height:100%;display:grid;place-items:center;padding:0 18px"><p class="txbiw" style="margin:0;font-size:26px;font-weight:700;text-align:center;line-height:1.25"></p></div>';
    el.appendChild(s);
    const p=s.querySelector('.txbiw');let to,run=true;
    const words=[['Diseno',0],['en',0],['movimiento',1],['puro',0]];
    (function go(){
      p.innerHTML='';
      words.forEach((w,i)=>{const sp=document.createElement('span');sp.textContent=w[0]+' ';if(w[1])sp.className='ac';sp.style.animationDelay=(i*0.12)+'s';p.appendChild(sp);});
      if(run)to=setTimeout(go,3200);
    })();
    return{stop(){run=false;clearTimeout(to);el.innerHTML='';}};
  }
};
export default effect;
