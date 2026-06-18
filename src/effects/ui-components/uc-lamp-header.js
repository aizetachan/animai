/** @type {import('../types.js').Effect} */
const effect = {
  id:'uc-lamp-header', title:'Lamp Header', cat:'UI Components',
  tags:['lamp','lampara','conic','haz','beam','header','aceternity'],
  desc:'Encabezado con un haz cónico de lámpara que se enciende y proyecta luz bajo un título.',
  meta:['Aceternity UI','conic-gradient','blur'],
  prompt:`Recrea el Lamp Header de Aceternity: un haz de luz triangular que se enciende desde una línea horizontal y proyecta un resplandor hacia abajo, con un título centrado encima.
Elementos: un contenedor oscuro; dos conos de luz (pseudo-elementos o divs) creados con conic-gradient hacia los lados que forman un triángulo invertido; una línea brillante horizontal en el vértice; y debajo un título.
Técnica: usa background:conic-gradient(from ... , var(--acento), transparent) recortado en forma de cono, más una elipse con blur grande como halo. Anima la opacidad y la escala horizontal del haz con @keyframes para simular el encendido (de apagado a brillo pleno) en bucle suave.
Timings: encendido ~1.2s ease-out, parpadeo sutil del halo ~3s alterno. Color acento #7b5cff con toque #00e0c6.`,
  code:`<div class="lamp"><div class="cone left"></div><div class="cone right"></div><div class="line"></div><h2>Build Lamps</h2></div>
<style>
.lamp{position:relative;display:grid;place-items:center;background:#080812;overflow:hidden;padding-top:120px}
.cone{position:absolute;top:0;height:200px;width:240px;filter:blur(28px)}
.cone.left{right:50%;background:conic-gradient(from 70deg at center top,#7b5cff,transparent);transform-origin:top right}
.cone.right{left:50%;background:conic-gradient(from 290deg at center top,transparent,#7b5cff);transform-origin:top left}
.line{position:absolute;top:0;width:280px;height:2px;background:#00e0c6;box-shadow:0 0 24px 6px #7b5cff;animation:lampGlow 3s ease-in-out infinite alternate}
.lamp h2{position:relative;color:#eef0f7;font-weight:800}
@keyframes lampGlow{from{opacity:.6;box-shadow:0 0 12px 3px #7b5cff}to{opacity:1;box-shadow:0 0 30px 8px #7b5cff}}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;overflow:hidden;background:#080812;display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes lhOn{0%{opacity:0;transform:scaleX(.2)}100%{opacity:1;transform:scaleX(1)}}'
      +'@keyframes lhGlow{0%{opacity:.55;box-shadow:0 0 10px 2px #7b5cff}100%{opacity:1;box-shadow:0 0 26px 7px #7b5cff}}'
      +'@keyframes lhText{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}'
      +'.lh{position:relative;width:100%;height:100%;display:grid;place-items:center;padding-top:30px;box-sizing:border-box}'
      +'.lh .cone{position:absolute;top:60px;height:120px;width:140px;filter:blur(22px);animation:lhOn 1.2s ease-out both,lhGlow 3s ease-in-out 1.2s infinite alternate}'
      +'.lh .cone.l{right:50%;background:conic-gradient(from 70deg at center top,#7b5cff,transparent);transform-origin:top right}'
      +'.lh .cone.r{left:50%;background:conic-gradient(from 290deg at center top,transparent,#7b5cff);transform-origin:top left}'
      +'.lh .line{position:absolute;top:60px;width:170px;height:2px;background:#00e0c6;animation:lhGlow 3s ease-in-out infinite alternate}'
      +'.lh h2{position:relative;margin:0;margin-top:70px;color:#eef0f7;font:800 22px system-ui,sans-serif;letter-spacing:.5px;animation:lhText 1s ease-out .6s both}'
      +'</style>'
      +'<div class="lh"><div class="cone l"></div><div class="cone r"></div><div class="line"></div><h2>Build Lamps</h2></div>';
    el.appendChild(s);
    let lh=s.querySelector('.lh');
    const replay=()=>{const n=lh.cloneNode(true);lh.replaceWith(n);lh=n;};
    const t=setInterval(replay,4600);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
