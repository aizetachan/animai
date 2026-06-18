/** @type {import('../types.js').Effect} */
const effect = {
  id:'sc-stacking-cards', title:'Stacking Cards', cat:'Scroll',
  tags:['scroll','stacking','cards','tarjetas','sticky','pile','堆叠'],
  desc:'Tarjetas que se apilan, escalan hacia atrás y se comprimen una sobre otra al hacer scroll.',
  meta:['position:sticky','scroll %','transform'],
  prompt:`Crea un apilado de tarjetas (stacking cards) controlado por scroll.
Estructura: una lista de tarjetas, cada una en un wrapper alto; cada tarjeta usa position:sticky con top creciente (o un top fijo) para que al scrollear se queden pegadas y las siguientes se monten encima.
Algoritmo: calcula un progreso 0->1 del scroll de la sección. Para cada tarjeta i, mientras una tarjeta posterior se aproxima, escala la actual hacia abajo (scale 1 -> ~0.9) y baja un poco su opacidad/brillo, dando la sensación de que se hunde en la pila. Las tarjetas superiores conservan un pequeño offset vertical para mostrar su borde.
Timings: cada tarjeta interpola su scale en su tramo de scroll; usa easing suave (easeOutCubic). Sticky top escalonado p.ej. top:i*8px.`,
  code:`<section class="sc">
  <article class="sc-card">01</article>
  <article class="sc-card">02</article>
  <article class="sc-card">03</article>
  <article class="sc-card">04</article>
</section>
<style>
.sc-card{position:sticky;top:40px;height:60vh;border-radius:18px;
  display:grid;place-items:center;font:800 40px Inter,sans-serif;color:#fff;
  background:linear-gradient(135deg,#7b5cff,#00e0c6);transform-origin:top center}
</style>
<script>
const cards=[...document.querySelectorAll('.sc-card')];
function frame(){
  cards.forEach((c,i)=>{
    const r=c.getBoundingClientRect();
    // progreso de cuánto ha sido cubierta esta tarjeta por las siguientes
    const after=cards.length-1-i;
    const top=40+i*8;
    const p=Math.min(1,Math.max(0,(top-r.top)/300));
    const scale=1-p*0.08*after;
    c.style.transform='scale('+scale+')';
    c.style.filter='brightness('+(1-p*0.3)+')';
  });
  requestAnimationFrame(frame);
}
frame();
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='position:relative;overflow:hidden';
    el.appendChild(s);
    const W=()=>s.clientWidth,H=()=>s.clientHeight;
    const colors=[['#7b5cff','#5a3fd6'],['#00e0c6','#0a9d8c'],['#ff6ad5','#a23fc6'],['#ffb347','#ff6a3f']];
    const cards=colors.map((c,i)=>{
      const d=document.createElement('div');
      d.style.cssText='position:absolute;left:50%;border-radius:14px;display:grid;place-items:center;'
        +'font:800 26px Inter,system-ui,sans-serif;color:#fff;transform-origin:center top;'
        +'box-shadow:0 12px 30px rgba(0,0,0,.45);background:linear-gradient(135deg,'+c[0]+','+c[1]+')';
      d.textContent='0'+(i+1);
      s.appendChild(d);return d;
    });
    let raf,run=true,p=0,dir=1;
    const ease=t=>1-Math.pow(1-t,3);
    (function loop(){if(!run)return;
      p+=dir*0.0045;if(p>=1){p=1;dir=-1;}if(p<=0){p=0;dir=1;}
      const cw=Math.min(170,W()-40),ch=Math.min(74,H()*0.42);
      const n=cards.length;
      // progreso global recorre las tarjetas: la pila "entra" una a una
      const gp=ease(p)*(n-1);
      cards.forEach((c,i)=>{
        c.style.width=cw+'px';c.style.height=ch+'px';
        // cuánto está apilada/cubierta esta tarjeta
        const cov=Math.min(1,Math.max(0,gp-i+1));    // 0..1 cubierta por la siguiente
        const after=Math.min(1,Math.max(0,gp-i));    // cuánto ha avanzado más allá
        const baseTop=10+i*14;
        const scale=1-after*0.08;
        const ty=baseTop - after*4;
        c.style.transform='translateX(-50%) translateY('+ty+'px) scale('+scale+')';
        c.style.filter='brightness('+(1-after*0.28)+')';
        c.style.zIndex=String(i);
        c.style.opacity=String(1-Math.max(0,after-2)*0.3);
      });
      raf=requestAnimationFrame(loop);
    })();
    const ro=new ResizeObserver(()=>{});ro.observe(s);
    return{stop(){run=false;cancelAnimationFrame(raf);ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
