/** @type {import('../types.js').Effect} */
const effect = {
  id:'uc-macbook-scroll', title:'Macbook Scroll', cat:'UI Components',
  tags:['macbook','scroll','laptop','3d','aceternity','perspective','reveal'],
  desc:'Un portátil cuya pantalla se abre y escala a pantalla completa según el scroll. El MacBook Scroll de Aceternity.',
  meta:['Aceternity UI','transform 3D','Scroll-linked'],
  prompt:`Recrea el MacBook Scroll de Aceternity: un portátil visto en perspectiva cuya pantalla, al hacer scroll, se "abre" (rotateX de -28deg a 0) y escala hasta casi llenar el viewport, revelando su contenido.
Elementos: un contenedor con perspective; la tapa/pantalla con transform-origin en la bisagra inferior; la base/teclado fijo abajo. Mapea un progreso 0→1 a: rotateX(-28deg→0), scale(0.7→1.15) y translateY de la pantalla.
Para la demo: anima un progreso simulado (ease in-out, ida y vuelta en bucle) en vez de scroll real, para mostrar el ciclo completo de cierre y apertura.`,
  code:`// Aceternity UI — MacBook Scroll (React + Framer Motion useScroll)
const { scrollYProgress } = useScroll({ target: ref })
const rotate = useTransform(scrollYProgress, [0,1], [-28, 0])      // abrir tapa
const scale  = useTransform(scrollYProgress, [0,1], [0.7, 1.15])   // acercar
const ty     = useTransform(scrollYProgress, [0,1], [0, -60])
<motion.div style={{ rotateX: rotate, scale, y: ty, transformOrigin: 'bottom' }}>
  <div className="screen">{children}</div>
</motion.div>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:radial-gradient(circle at 50% 30%,#15152a,#06060d);overflow:hidden';
    s.innerHTML='<style>'
      +'.umb-scene{perspective:700px;width:200px}'
      +'.umb-lid{transform-origin:bottom center;transform-style:preserve-3d;will-change:transform}'
      +'.umb-screen{width:200px;height:124px;border-radius:9px 9px 0 0;background:#0e0e18;border:3px solid #2a2a3e;border-bottom:none;overflow:hidden;position:relative;box-shadow:inset 0 0 22px #0008}'
      +'.umb-wp{position:absolute;inset:0;background:linear-gradient(135deg,#7b5cff,#00e0c6 60%,#ff5ca8);opacity:.9}'
      +'.umb-cam{position:absolute;top:5px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:#000;box-shadow:0 0 0 1px #333}'
      +'.umb-dock{position:absolute;bottom:6px;left:50%;transform:translateX(-50%);display:flex;gap:6px}'
      +'.umb-dock i{width:13px;height:13px;border-radius:4px;background:#ffffff55}'
      +'.umb-base{width:222px;height:13px;background:linear-gradient(#3a3a52,#202032);border-radius:0 0 11px 11px;margin:0 auto;position:relative;box-shadow:0 10px 24px #000a}'
      +'.umb-notch{position:absolute;top:0;left:50%;transform:translateX(-50%);width:54px;height:5px;background:#15151f;border-radius:0 0 7px 7px}'
      +'</style>'
      +'<div class="umb-scene"><div class="umb-lid"><div class="umb-screen"><div class="umb-wp"></div><div class="umb-cam"></div><div class="umb-dock"><i></i><i></i><i></i><i></i></div></div></div></div>'
      +'<div class="umb-base"><div class="umb-notch"></div></div>';
    el.appendChild(s);
    const lid=s.querySelector('.umb-lid');
    let raf,run=true,t=0;
    function loop(){if(!run)return;t+=0.012;
      // progreso ping-pong con easing
      let p=(Math.sin(t)+1)/2; // 0..1
      p=p*p*(3-2*p); // smoothstep
      const rot=-78+p*78;            // -78deg (cerrado) -> 0 (abierto)
      const sc=0.78+p*0.34;          // acerca al abrir
      const ty=(1-p)*18;             // baja al cerrar
      lid.style.transform='rotateX('+rot.toFixed(2)+'deg) scale('+sc.toFixed(3)+') translateY('+ty.toFixed(1)+'px)';
      raf=requestAnimationFrame(loop);
    }
    loop();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
