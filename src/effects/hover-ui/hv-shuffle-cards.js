/** @type {import('../types.js').Effect} */
const effect = {
  id:'hv-shuffle-cards', title:'Shuffle Cards', cat:'Hover & UI',
  tags:['cards','cartas','shuffle','barajar','stack','deck','hover'],
  desc:'Una baraja de cartas apiladas que se reordena en bucle: la carta superior sale y vuelve al fondo.',
  meta:['transform','z-index','CSS+JS'],
  prompt:`Crea una pila de cartas (3-4) apiladas con un ligero offset y rotación que se barajan en bucle.
Elementos: varias .card en position:absolute centradas, cada una con un translate/rotate distinto para simular el mazo y distinto z-index.
Técnica: en cada ciclo, la carta de arriba se anima saliendo (translateX + rotate + scale) con una clase .out, luego se manda al fondo del mazo (menor z-index, vuelve a su offset de base) y las demás suben una posición. Usa un array de estados y recalcula transform/zIndex en cada tick.
Timings: salida ~600ms ease, ciclo cada ~1500ms. Reasigna transform y zIndex tras la animación para encadenar infinitamente.`,
  code:`<div class="deck"><div class="card">1</div><div class="card">2</div><div class="card">3</div></div>
<style>
.deck{position:relative;width:120px;height:160px}
.card{position:absolute;inset:0;border-radius:16px;display:grid;place-items:center;font-size:28px;font-weight:800;color:#fff;background:linear-gradient(135deg,#7b5cff,#00e0c6);box-shadow:0 10px 30px rgba(0,0,0,.4);transition:transform .6s cubic-bezier(.4,1.3,.4,1)}
.card.out{transform:translateX(160px) rotate(18deg) scale(.85)!important}
</style>
<script>
const cards=[...document.querySelectorAll('.card')];
function layout(){cards.forEach((c,i)=>{c.style.zIndex=cards.length-i;c.style.transform='translate('+(i*-6)+'px,'+(i*8)+'px) rotate('+(i*-4)+'deg)';});}
layout();
setInterval(()=>{const top=cards.shift();top.classList.add('out');setTimeout(()=>{top.classList.remove('out');cards.push(top);layout();},600);},1500);
<\/script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'.hvsc-deck{position:relative;width:110px;height:150px}'
      +'.hvsc-card{position:absolute;inset:0;border-radius:16px;display:grid;place-items:center;font-size:30px;font-weight:800;color:#fff;box-shadow:0 12px 30px rgba(0,0,0,.45);transition:transform .6s cubic-bezier(.4,1.3,.4,1)}'
      +'.hvsc-card.hvsc-out{transform:translateX(150px) rotate(20deg) scale(.82)!important}'
      +'</style>'
      +'<div class="hvsc-deck"><div class="hvsc-card" style="background:linear-gradient(135deg,#7b5cff,#5a3fd6)">A</div><div class="hvsc-card" style="background:linear-gradient(135deg,#00e0c6,#0a8f80)">K</div><div class="hvsc-card" style="background:linear-gradient(135deg,#7b5cff,#00e0c6)">Q</div><div class="hvsc-card" style="background:linear-gradient(135deg,#5a3fd6,#7b5cff)">J</div></div>';
    el.appendChild(s);
    let cards=[...s.querySelectorAll('.hvsc-card')];
    function layout(){cards.forEach((c,i)=>{c.style.zIndex=cards.length-i;c.style.transform='translate('+(i*-6)+'px,'+(i*8)+'px) rotate('+(i*-4)+'deg)';});}
    layout();
    let tout;
    const t=setInterval(()=>{const top=cards.shift();top.classList.add('hvsc-out');tout=setTimeout(()=>{top.classList.remove('hvsc-out');cards.push(top);layout();},600);},1500);
    return{stop(){clearInterval(t);clearTimeout(tout);el.innerHTML='';}};
  }
};
export default effect;
