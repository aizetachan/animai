/** @type {import('../types.js').Effect} */
const effect = {
  id:'mi-quantity-stepper', title:'Quantity Stepper', cat:'Micro-interacciones',
  tags:['stepper','quantity','counter','cart','bounce','plus','minus'],
  desc:'Control − valor + de cantidad donde el número rebota al cambiar de valor (auto-demo).',
  meta:['transform','keyframes','JS demo'],
  prompt:`Crea un stepper de cantidad: contenedor pill con un botón "−" a la izquierda, un número centrado y un botón "+" a la derecha.
Al pulsar + o −, el número cambia y se reproduce un rebote: aplica una clase que dispara un @keyframes (pop) que va de scale(.5) translateY(? )->scale(1.25)->scale(1) y un pequeño cambio de color al acento. Reinicia la animación quitando y volviendo a añadir la clase (force reflow) en cada cambio.
Los botones tienen feedback al pulsar (scale .9). El valor no baja de 0.`,
  code:`<div class="qstep">
  <button class="dec">−</button><span class="val">1</span><button class="inc">+</button>
</div>
<style>
.qstep{display:inline-flex;align-items:center;gap:14px;padding:6px 10px;border-radius:999px;background:#161622;}
.qstep button{width:34px;height:34px;border:0;border-radius:50%;background:#23233a;color:#fff;
  font-size:20px;cursor:pointer;transition:transform .1s,background .2s;}
.qstep button:active{transform:scale(.9);background:#7b5cff;}
.val{min-width:28px;text-align:center;font-weight:800;font-size:20px;color:#fff;}
.val.bump{animation:qsBump .4s cubic-bezier(.34,1.56,.64,1);}
@keyframes qsBump{0%{transform:scale(.5);color:#00e0c6;}55%{transform:scale(1.3);}100%{transform:scale(1);color:#fff;}}
</style>
<script>
const val=document.querySelector('.val');let n=1;
function set(d){n=Math.max(0,n+d);val.textContent=n;
  val.classList.remove('bump');void val.offsetWidth;val.classList.add('bump');}
document.querySelector('.inc').onclick=()=>set(1);
document.querySelector('.dec').onclick=()=>set(-1);
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'.miQs{display:inline-flex;align-items:center;gap:14px;padding:6px 10px;border-radius:999px;background:#161622}'
      +'.miQs button{width:34px;height:34px;border:0;border-radius:50%;background:#23233a;color:#fff;font-size:20px;cursor:pointer;transition:transform .12s,background .2s}'
      +'.miQs button.press{transform:scale(.9);background:#7b5cff}'
      +'.miQsVal{min-width:28px;text-align:center;font-weight:800;font-size:20px;color:#fff;display:inline-block}'
      +'.miQsVal.bump{animation:miQsBump .4s cubic-bezier(.34,1.56,.64,1)}'
      +'@keyframes miQsBump{0%{transform:scale(.5);color:#00e0c6}55%{transform:scale(1.3)}100%{transform:scale(1);color:#fff}}'
      +'</style>'
      +'<div class="miQs"><button class="miQsDec">−</button><span class="miQsVal">1</span><button class="miQsInc">+</button></div>';
    el.appendChild(s);
    const val=s.querySelector('.miQsVal'),inc=s.querySelector('.miQsInc'),dec=s.querySelector('.miQsDec');
    let n=1;
    function set(d,btn){
      n=Math.max(0,n+d);val.textContent=n;
      val.classList.remove('bump');void val.offsetWidth;val.classList.add('bump');
      btn.classList.add('press');setTimeout(()=>btn.classList.remove('press'),140);
    }
    // auto-demo: sube, sube, baja en bucle
    const seq=[1,1,1,-1,-1,1,-1];let i=0,timer;
    function tick(){const d=seq[i%seq.length];set(d,d>0?inc:dec);i++;}
    timer=setInterval(tick,900);
    return{stop(){clearInterval(timer);el.innerHTML='';}};
  }
};
export default effect;
