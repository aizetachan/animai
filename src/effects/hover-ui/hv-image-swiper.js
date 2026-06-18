/** @type {import('../types.js').Effect} */
const effect = {
  id:'hv-image-swiper', title:'Image Swiper', cat:'Hover & UI',
  tags:['swiper','carousel','carrusel','drag','swipe','snap','slider','cards'],
  desc:'Carrusel de tarjetas con arrastre horizontal e imán de anclaje (snap) a la diapositiva más cercana.',
  meta:['transform','drag','snap'],
  prompt:`Crea un carrusel de tarjetas con arrastre horizontal y snap.
Estructura: un viewport con overflow oculto y una pista (track) en display:flex que contiene las tarjetas; cada tarjeta ocupa el ancho del viewport (o un porcentaje).
Técnica: en pointerdown guarda startX y el offset actual; en pointermove calcula delta y aplica transform:translateX(offset+delta) a la pista (sin transición durante el drag). En pointerup decide el índice destino según la distancia/velocidad arrastrada, fija el índice y anima la pista con transition:transform .4s cubic-bezier al múltiplo del ancho (snap). Añade puntos indicadores que reflejan el índice activo.
Para auto-demo: avanza el índice cíclicamente con un timer, animando el translateX como si fuera un swipe.`,
  code:`<div class="vp"><div class="track">
  <div class="slide">1</div><div class="slide">2</div><div class="slide">3</div>
</div></div>
<style>
.vp{overflow:hidden;border-radius:14px;width:240px}
.track{display:flex;will-change:transform}
.slide{flex:0 0 100%;height:150px;display:grid;place-items:center;font-size:40px;color:#fff}
</style>
<script>
let i=0,startX=0,off=0,drag=false;const track=document.querySelector('.track');
const w=()=>track.parentElement.clientWidth;
function go(){track.style.transition='transform .4s cubic-bezier(.2,.7,.3,1)';track.style.transform='translateX('+(-i*w())+'px)';}
track.addEventListener('pointerdown',e=>{drag=true;startX=e.clientX;off=-i*w();track.style.transition='none';});
addEventListener('pointermove',e=>{if(!drag)return;track.style.transform='translateX('+(off+e.clientX-startX)+'px)';});
addEventListener('pointerup',e=>{if(!drag)return;drag=false;const d=e.clientX-startX;if(Math.abs(d)>w()*0.2)i=Math.max(0,Math.min(2,i-Math.sign(d)));go();});
go();
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#08080f;gap:10px;grid-auto-rows:min-content;align-content:center';
    const grads=['linear-gradient(135deg,#7b5cff,#00e0c6)','linear-gradient(135deg,#00e0c6,#7b5cff)','linear-gradient(135deg,#ff5ca8,#7b5cff)','linear-gradient(135deg,#ffd166,#ff5ca8)'];
    s.innerHTML='<style>'
      +'.his-vp{overflow:hidden;border-radius:14px;width:220px}'
      +'.his-track{display:flex;will-change:transform}'
      +'.his-slide{flex:0 0 100%;height:140px;display:grid;place-items:center;font-size:42px;font-weight:900;color:#fff}'
      +'.his-dots{display:flex;gap:7px;justify-content:center}'
      +'.his-dot{width:7px;height:7px;border-radius:50%;background:#ffffff33;transition:background .3s,transform .3s}'
      +'.his-dot.on{background:#7b5cff;transform:scale(1.4)}'
      +'</style>'
      +'<div class="his-vp"><div class="his-track">'+grads.map((g,k)=>'<div class="his-slide" style="background:'+g+'">'+(k+1)+'</div>').join('')+'</div></div>'
      +'<div class="his-dots">'+grads.map(()=>'<i class="his-dot"></i>').join('')+'</div>';
    el.appendChild(s);
    const track=s.querySelector('.his-track'),vp=s.querySelector('.his-vp'),dots=[...s.querySelectorAll('.his-dot')];
    const n=grads.length;let i=0,t=0,raf,run=true;
    const w=()=>vp.clientWidth;
    let cur=0,target=0;
    function setDots(){dots.forEach((d,k)=>d.classList.toggle('on',k===i));}
    setDots();
    // auto-demo: avanza el índice y anima translateX con easing manual (simula el snap del swipe)
    const timer=setInterval(()=>{i=(i+1)%n;target=-i*w();setDots();},1700);
    (function loop(){if(!run)return;
      // suaviza cur hacia target (snap animado)
      cur+=(target-cur)*0.12;
      track.style.transform='translateX('+cur+'px)';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;clearInterval(timer);cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
