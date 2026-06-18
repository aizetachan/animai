/** @type {import('../types.js').Effect} */
const effect = {
  id:'hv-squishy-card', title:'Squishy Card', cat:'Hover & UI',
  tags:['squishy','jelly','gelatina','click','bounce','scale','press'],
  desc:'Tarjeta gelatinosa que se aplasta al pulsar y vuelve con un rebote elástico tipo jelly.',
  meta:['scale','cubic-bezier','press'],
  prompt:`Crea una tarjeta "gelatinosa" que se aplasta al hacer click y rebota al soltar.
Elementos: una tarjeta centrada con border-radius y una etiqueta.
Técnica: en pointerdown aplica un transform de aplastamiento scale(1.06,0.86) (más ancha y baja) con transición rápida; en pointerup vuelve a scale(1,1) usando una curva elástica con overshoot, p.ej. @keyframes que pase por scale(.9,1.12) -> scale(1.04,.96) -> scale(1) o cubic-bezier(.34,1.56,.64,1) más prolongado. Añade una sombra que se reduce al aplastar.
Timings: aplastado ~120ms ease-out; rebote ~600ms con varios picos. El efecto es la sensación jelly: ancho aumenta cuando el alto baja (conservación de volumen aproximada).`,
  code:`<button class="squish"><span>Press me</span></button>
<style>
.squish{border:0;cursor:pointer;width:150px;height:96px;border-radius:20px;background:linear-gradient(135deg,#7b5cff,#00e0c6);color:#0a0a14;font-weight:800;box-shadow:0 14px 30px rgba(123,92,255,.4);transition:transform .12s ease-out,box-shadow .12s}
.squish.press{transform:scale(1.08,.82);box-shadow:0 4px 12px rgba(123,92,255,.3)}
.squish.bounce{animation:sqBounce .6s cubic-bezier(.34,1.56,.64,1)}
@keyframes sqBounce{0%{transform:scale(1.08,.82)}30%{transform:scale(.92,1.1)}55%{transform:scale(1.04,.97)}75%{transform:scale(.99,1.01)}100%{transform:scale(1)}}
</style>
<script>
const b=document.querySelector('.squish');
b.addEventListener('pointerdown',()=>{b.classList.remove('bounce');b.classList.add('press');});
b.addEventListener('pointerup',()=>{b.classList.remove('press');b.classList.add('bounce');});
b.addEventListener('animationend',()=>b.classList.remove('bounce'));
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='display:grid;place-items:center;background:#0a0a14';
    s.innerHTML='<style>'
      +'@keyframes hvsqBounce{0%{transform:scale(1.1,.8)}30%{transform:scale(.9,1.12)}55%{transform:scale(1.05,.96)}75%{transform:scale(.98,1.02)}100%{transform:scale(1)}}'
      +'.hvsq{width:150px;height:96px;border-radius:20px;background:linear-gradient(135deg,#7b5cff,#00e0c6);color:#0a0a14;font-weight:800;display:grid;place-items:center;box-shadow:0 14px 30px rgba(123,92,255,.4);transition:transform .12s ease-out,box-shadow .12s;will-change:transform}'
      +'.hvsq.press{transform:scale(1.1,.8);box-shadow:0 4px 12px rgba(123,92,255,.3)}'
      +'.hvsq.bounce{animation:hvsqBounce .6s cubic-bezier(.34,1.56,.64,1)}'
      +'</style>'
      +'<div class="hvsq">Press me</div>';
    el.appendChild(s);
    const b=s.querySelector('.hvsq');
    let t1,t2,run=true;
    const onEnd=()=>b.classList.remove('bounce');
    b.addEventListener('animationend',onEnd);
    function cycle(){
      if(!run)return;
      b.classList.remove('bounce');b.classList.add('press');
      t1=setTimeout(()=>{
        if(!run)return;
        b.classList.remove('press');
        void b.offsetWidth;
        b.classList.add('bounce');
      },340);
    }
    cycle();
    const t2int=setInterval(cycle,1900);
    return{stop(){run=false;clearTimeout(t1);clearInterval(t2int);b.removeEventListener('animationend',onEnd);el.innerHTML='';}};
  }
};
export default effect;
