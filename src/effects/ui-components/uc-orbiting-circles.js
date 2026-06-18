/** @type {import('../types.js').Effect} */
const effect = {
  id:'uc-orbiting-circles', title:'Orbiting Circles', cat:'UI Components',
  tags:['orbit','órbita','circles','rotate','concentric','magic ui','satellites'],
  desc:'Puntos e iconos orbitando en anillos concéntricos a distintas velocidades y sentidos.',
  meta:['CSS transform','rotate','Magic UI'],
  prompt:`Recrea el Orbiting Circles de Magic UI: un elemento central y varios anillos concéntricos (círculos con border punteado/tenue), cada uno con uno o más satélites (puntos o iconos) que orbitan.
Técnica: cada anillo es un contenedor circular centrado con position:absolute. El satélite se ancla en el borde superior del anillo y todo el anillo se anima con @keyframes orbit que rota de 0 a 360deg (o -360 para sentido inverso). El satélite recibe una contra-rotación inversa para no girar sobre sí mismo.
Datos: 3 anillos de radios crecientes (ej. 40/70/100px), duraciones distintas (8s/14s/20s), alterna direction normal/reverse. Color de marca violeta/cian, anillos con border tenue. Centra un icono o punto luminoso en el medio.`,
  code:`<div class="orb">
  <div class="ring r1"><i class="dot"></i></div>
  <div class="ring r2"><i class="dot"></i></div>
  <div class="ring r3"><i class="dot"></i></div>
  <div class="core"></div>
</div>
<style>
.orb{position:relative;width:240px;height:240px;display:grid;place-items:center}
.ring{position:absolute;border-radius:50%;border:1px dashed rgba(123,92,255,.25)}
.r1{width:90px;height:90px;animation:ocSpin 8s linear infinite}
.r2{width:150px;height:150px;animation:ocSpin 14s linear infinite reverse}
.r3{width:210px;height:210px;animation:ocSpin 20s linear infinite}
.dot{position:absolute;top:-6px;left:50%;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:#7b5cff;box-shadow:0 0 12px #7b5cff}
.r2 .dot{background:#00e0c6;box-shadow:0 0 12px #00e0c6}
.core{width:20px;height:20px;border-radius:50%;background:radial-gradient(circle,#fff,#7b5cff);box-shadow:0 0 18px #7b5cff}
@keyframes ocSpin{to{transform:rotate(360deg)}}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:radial-gradient(circle at 50% 50%,#15131f,#0a0a12)';
    s.innerHTML='<style>'
      +'@keyframes ocSpin{to{transform:rotate(360deg)}}'
      +'.oc-orb{position:relative;width:190px;height:190px;display:grid;place-items:center}'
      +'.oc-ring{position:absolute;border-radius:50%;border:1px dashed rgba(123,92,255,.22)}'
      +'.oc-r1{width:70px;height:70px;animation:ocSpin 7s linear infinite}'
      +'.oc-r2{width:120px;height:120px;animation:ocSpin 12s linear infinite reverse}'
      +'.oc-r3{width:175px;height:175px;animation:ocSpin 18s linear infinite}'
      +'.oc-dot{position:absolute;top:-6px;left:50%;width:11px;height:11px;margin-left:-5.5px;border-radius:50%;background:#7b5cff;box-shadow:0 0 12px #7b5cff}'
      +'.oc-dot.b{top:auto;bottom:-6px;background:#fff;box-shadow:0 0 10px #fff}'
      +'.oc-r2 .oc-dot{background:#00e0c6;box-shadow:0 0 12px #00e0c6}'
      +'.oc-core{width:18px;height:18px;border-radius:50%;background:radial-gradient(circle,#fff,#7b5cff);box-shadow:0 0 18px #7b5cff}'
      +'</style>'
      +'<div class="oc-orb">'
      +'<div class="oc-ring oc-r1"><i class="oc-dot"></i></div>'
      +'<div class="oc-ring oc-r2"><i class="oc-dot"></i><i class="oc-dot b"></i></div>'
      +'<div class="oc-ring oc-r3"><i class="oc-dot"></i></div>'
      +'<div class="oc-core"></div>'
      +'</div>';
    el.appendChild(s);
    return{stop(){el.innerHTML='';}};
  }
};
export default effect;
