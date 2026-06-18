/** @type {import('../types.js').Effect} */
const effect = {
  id:'hv-wobble-card', title:'Wobble Card', cat:'Hover & UI',
  tags:['card','wobble','3d','tilt','hover','parallax','depth'],
  desc:'Tarjeta que se deforma en 3D siguiendo el cursor, con capas internas en parallax y brillo.',
  meta:['perspective','rotateXY','parallax'],
  prompt:`Crea una tarjeta con efecto "wobble" 3D que reacciona al cursor.
Elementos: un contenedor con perspective (~800px) y una tarjeta con transform-style:preserve-3d. Dentro coloca capas a distintas profundidades con translateZ (título translateZ(40px), subtítulo translateZ(20px)) para un parallax de profundidad. Añade una capa de brillo (radial-gradient blanco) que sigue al cursor.
Técnica: en mousemove mapea la posición relativa del cursor (0..1) a rotateY(±14deg) y rotateX(∓14deg). El centro produce 0 rotación. Mueve el brillo a la posición del cursor. En mouseleave resetea con transición suave (transform:none) creando un leve rebote.
Timings: transition transform ~150ms ease-out; el reset puede usar una curva con overshoot (cubic-bezier) para el "wobble".`,
  code:`<div class="wob"><div class="wob-card"><span class="wob-t">Animai</span><span class="wob-s">wobble 3D</span><div class="wob-glare"></div></div></div>
<style>
.wob{perspective:800px;display:grid;place-items:center;width:100%;height:100%}
.wob-card{width:160px;height:110px;border-radius:18px;background:linear-gradient(135deg,#241d4a,#15132e);border:1px solid #3a3a5e;position:relative;transform-style:preserve-3d;display:grid;place-content:center;gap:6px;text-align:center;transition:transform .15s ease-out}
.wob-t{font-weight:800;color:#eef0f7;transform:translateZ(40px)}
.wob-s{font-size:12px;color:#9b8cff;transform:translateZ(20px)}
.wob-glare{position:absolute;inset:0;border-radius:18px;background:radial-gradient(circle at 50% 50%,rgba(255,255,255,.35),transparent 55%);opacity:0;transition:opacity .2s}
</style>
<script>
const wrap=document.querySelector('.wob'),card=wrap.querySelector('.wob-card'),gl=wrap.querySelector('.wob-glare');
wrap.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
  card.style.transform='rotateY('+((px-.5)*28)+'deg) rotateX('+(-(py-.5)*28)+'deg)';
  gl.style.opacity=1;gl.style.background='radial-gradient(circle at '+px*100+'% '+py*100+'%,rgba(255,255,255,.35),transparent 55%)';});
wrap.addEventListener('mouseleave',()=>{card.style.transition='transform .6s cubic-bezier(.34,1.56,.64,1)';card.style.transform='none';gl.style.opacity=0;setTimeout(()=>card.style.transition='transform .15s ease-out',600);});
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='perspective:800px;display:grid;place-items:center;background:#0a0a14';
    s.innerHTML='<style>'
      +'.hvwob{width:160px;height:110px;border-radius:18px;background:linear-gradient(135deg,#241d4a,#15132e);border:1px solid #3a3a5e;position:relative;transform-style:preserve-3d;display:grid;place-content:center;gap:6px;text-align:center;will-change:transform}'
      +'.hvwob-t{font-weight:800;color:#eef0f7;transform:translateZ(40px)}'
      +'.hvwob-s{font-size:12px;color:#9b8cff;transform:translateZ(20px)}'
      +'.hvwob-g{position:absolute;inset:0;border-radius:18px}'
      +'</style>'
      +'<div class="hvwob"><span class="hvwob-t">Animai</span><span class="hvwob-s">wobble 3D</span><div class="hvwob-g"></div></div>';
    el.appendChild(s);
    const card=s.querySelector('.hvwob'),gl=s.querySelector('.hvwob-g');
    let a=0,raf,run=true;
    (function loop(){
      if(!run)return;
      a+=.024;
      const px=.5+Math.cos(a)*.42, py=.5+Math.sin(a*1.5)*.42;
      card.style.transform='rotateY('+((px-.5)*30)+'deg) rotateX('+(-(py-.5)*30)+'deg)';
      gl.style.background='radial-gradient(circle at '+(px*100)+'% '+(py*100)+'%,rgba(255,255,255,.32),transparent 55%)';
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
