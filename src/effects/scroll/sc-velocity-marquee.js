/** @type {import('../types.js').Effect} */
const effect = {
  id:'sc-velocity-marquee', title:'Scroll Velocity Marquee', cat:'Scroll',
  tags:['scroll','marquee','velocity','velocidad','ticker','inertia','滚动'],
  desc:'Marquesina cuya velocidad y dirección se controlan por el scroll, con inercia y skew dinámico.',
  meta:['scroll velocity','transform','requestAnimationFrame'],
  prompt:`Crea una marquesina (marquee) infinita cuya velocidad y dirección dependan del scroll.
Estructura: un contenedor con overflow:hidden y dentro una pista (track) con el contenido DUPLICADO una vez, para poder hacer loop sin saltos. El track se mueve con transform:translateX(-x px); cuando x supera el ancho de una copia, se resetea con módulo.
Algoritmo: en cada frame mide la velocidad de scroll (delta entre scrollY actual y el anterior). La velocidad base de la marquesina (p.ej. 1px/frame) se suma a la velocidad de scroll multiplicada por un factor; cuando scrolleas hacia abajo acelera, hacia arriba invierte la dirección. Aplica también un skewX proporcional a la velocidad para dar sensación de inercia, y amortigua (lerp) la velocidad hacia su valor base cuando no hay scroll.
Timings: lerp factor ~0.05-0.1, base ~0.6px/frame, skew clamp a +-12deg.`,
  code:`<div class="vm"><div class="vm-track">
  <span>ANIMAI &bull; MOTION &bull; SCROLL &bull; VELOCITY &bull; </span>
  <span>ANIMAI &bull; MOTION &bull; SCROLL &bull; VELOCITY &bull; </span>
</div></div>
<style>
.vm{overflow:hidden;white-space:nowrap}
.vm-track{display:inline-flex;will-change:transform}
.vm-track span{font:800 28px Inter,sans-serif;color:#7b5cff;padding-right:.4em}
</style>
<script>
const track=document.querySelector('.vm-track');
let x=0,vel=0,base=.6,prevY=scrollY,unit=track.scrollWidth/2;
function frame(){
  const dy=scrollY-prevY; prevY=scrollY;
  const target=base+dy*.4;
  vel+=(target-vel)*.08;
  x=(x+vel)%unit; if(x<0)x+=unit;
  const skew=Math.max(-12,Math.min(12,vel*1.5));
  track.style.transform='translateX('+(-x)+'px) skewX('+skew+'deg)';
  requestAnimationFrame(frame);
}
frame();
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='display:grid;align-content:center;gap:14px;overflow:hidden';
    s.innerHTML='<style>'
      +'.svm{overflow:hidden;white-space:nowrap;width:100%}'
      +'.svm-t{display:inline-flex;will-change:transform}'
      +'.svm-t span{font:800 22px Inter,system-ui,sans-serif;letter-spacing:.5px;padding-right:.4em}'
      +'.svm-bar{height:4px;background:#16162a;border-radius:3px;margin:0 14px;position:relative;overflow:hidden}'
      +'.svm-bar i{position:absolute;top:0;height:100%;width:34%;border-radius:3px;background:linear-gradient(90deg,#7b5cff,#00e0c6)}'
      +'</style>'
      +'<div class="svm"><div class="svm-t">'
      +'<span style="color:#7b5cff">ANIMAI &bull; MOTION &bull; SCROLL &bull; VELOCITY &bull; </span>'
      +'<span style="color:#00e0c6">ANIMAI &bull; MOTION &bull; SCROLL &bull; VELOCITY &bull; </span>'
      +'</div></div>'
      +'<div class="svm"><div class="svm-t" data-r="1">'
      +'<span style="color:#00e0c6">FLOW &bull; INERTIA &bull; DESIGN &bull; ANIMAI &bull; </span>'
      +'<span style="color:#7b5cff">FLOW &bull; INERTIA &bull; DESIGN &bull; ANIMAI &bull; </span>'
      +'</div></div>'
      +'<div class="svm-bar"><i></i></div>';
    el.appendChild(s);
    const tracks=[...s.querySelectorAll('.svm-t')];
    const bar=s.querySelector('.svm-bar i');
    const units=tracks.map(t=>t.scrollWidth/2||100);
    const xs=tracks.map(()=>0);
    // simula scroll: vaivén de "scrollY" animado
    let raf,run=true,t=0,prevY=0,vel=0,base=.7;
    (function loop(){if(!run)return;
      t+=0.016;
      // scroll simulado: senoidal con tramos rápidos
      const scrollY=(Math.sin(t*0.8)*0.5+0.5)*900 + Math.sin(t*3)*60;
      const dy=scrollY-prevY;prevY=scrollY;
      const target=base+dy*0.6;
      vel+=(target-vel)*0.07;
      const skew=Math.max(-12,Math.min(12,vel*1.4));
      tracks.forEach((tr,i)=>{
        const u=units[i]||100;const sign=tr.dataset.r?-1:1;
        xs[i]=(xs[i]+vel*sign)%u;if(xs[i]<0)xs[i]+=u;
        tr.style.transform='translateX('+(-xs[i])+'px) skewX('+(skew*sign)+'deg)';
      });
      const prog=(Math.sin(t*0.8)*0.5+0.5);
      bar.style.left=(prog*66)+'%';
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
