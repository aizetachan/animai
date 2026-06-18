/** @type {import('../types.js').Effect} */
const effect = {
  id:'hv-lens-magnifier', title:'Lens Magnifier', cat:'Hover & UI',
  tags:['lens','magnifier','lupa','zoom','hover','cursor','ampliar'],
  desc:'Una lente circular sigue al cursor y magnifica la zona que tiene debajo, como una lupa real.',
  meta:['background-size','transform','cursor'],
  prompt:`Crea una lupa que magnifica la zona bajo el cursor sobre una imagen o un contenido.
Elementos: un contenedor con la imagen/contenido base y un div circular ".lens" con position:absolute, borde, border-radius:50% y box-shadow para dar volumen.
Técnica: la lente usa la misma imagen como background pero con background-size mayor (p.ej. 250%) para magnificar. Al mover el cursor, calcula la posición relativa (x,y) dentro del contenedor; mueve la lente a esa posición (centrada con translate(-50%,-50%)) y ajusta background-position de la lente proporcionalmente al cursor para que muestre la zona correcta ampliada.
Fórmula: bgPosX = -(x*zoom - lensRadius), bgPosY = -(y*zoom - lensRadius).
Timings: usa requestAnimationFrame para suavizar la posición (lerp) y oculta la lente cuando el cursor sale.`,
  code:`<div class="zoom"><div class="lens"></div></div>
<style>
.zoom{position:relative;width:260px;height:180px;background-image:url(foto.jpg);background-size:cover;border-radius:12px}
.lens{position:absolute;width:90px;height:90px;border-radius:50%;border:2px solid #7b5cff;box-shadow:0 8px 24px rgba(0,0,0,.5);background-image:url(foto.jpg);background-size:650px;pointer-events:none;opacity:0;transition:opacity .2s}
</style>
<script>
const z=document.querySelector('.zoom'),lens=document.querySelector('.lens'),zoom=2.5,r=45;
z.addEventListener('mousemove',e=>{
  const b=z.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;
  lens.style.opacity=1;
  lens.style.left=x+'px';lens.style.top=y+'px';lens.style.transform='translate(-50%,-50%)';
  lens.style.backgroundPosition=(-(x*zoom-r))+'px '+(-(y*zoom-r))+'px';
});
z.addEventListener('mouseleave',()=>lens.style.opacity=0);
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#06060c';
    s.innerHTML='<style>'
      +'@keyframes hvlmPulse{0%,100%{box-shadow:0 8px 24px rgba(0,0,0,.5),0 0 0 1px rgba(123,92,255,.4)}50%{box-shadow:0 8px 24px rgba(0,0,0,.5),0 0 0 3px rgba(0,224,198,.5)}}'
      +'.hvlm{position:relative;width:220px;height:150px;border-radius:14px;overflow:hidden}'
      +'.hvlm-base{position:absolute;inset:0;background:repeating-conic-gradient(from 0deg,#7b5cff 0deg 18deg,#00e0c6 18deg 36deg);filter:saturate(.9)}'
      +'.hvlm-grid{position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,0,0,.25),transparent),radial-gradient(circle at 30% 30%,rgba(255,255,255,.35),transparent 40%)}'
      +'.hvlm-lens{position:absolute;width:80px;height:80px;border-radius:50%;border:2px solid #7b5cff;background:repeating-conic-gradient(from 0deg,#7b5cff 0deg 18deg,#00e0c6 18deg 36deg);background-size:560px 560px;pointer-events:none;animation:hvlmPulse 2.2s ease-in-out infinite;will-change:transform,background-position}'
      +'</style>'
      +'<div class="hvlm"><div class="hvlm-base"></div><div class="hvlm-grid"></div><div class="hvlm-lens"></div></div>';
    el.appendChild(s);
    const box=s.querySelector('.hvlm'),lens=s.querySelector('.hvlm-lens');
    const zoom=2.5,r=40;let raf,run=true,a=0,cx=110,cy=75,tx=110,ty=75;
    (function loop(){
      if(!run)return;
      a+=.025;
      tx=110+Math.cos(a)*78;ty=75+Math.sin(a*1.6)*52;
      cx+=(tx-cx)*.12;cy+=(ty-cy)*.12;
      lens.style.left=cx+'px';lens.style.top=cy+'px';
      lens.style.transform='translate(-50%,-50%)';
      lens.style.backgroundPosition=(-(cx*zoom-r))+'px '+(-(cy*zoom-r))+'px';
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
