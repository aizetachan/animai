/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-swing', title:'Swing', cat:'CSS Moderno',
  tags:['css','swing','balanceo','pendulo','rotate','attention','animate.css'],
  desc:'Balanceo tipo pendulo: el elemento oscila rotando desde su borde superior con amplitud decreciente.',
  meta:['transform-origin top','0 JS'],
  prompt:`Crea un efecto "Swing" (balanceo de pendulo), estilo Animate.css.
La clave es transform-origin:top center para que pivote desde arriba.
Con @keyframes anima rotate alternando signo y amplitud decreciente: 20% rotate(15deg); 40% rotate(-10deg); 60% rotate(5deg); 80% rotate(-5deg); 100% rotate(0deg).
Duracion ~1s, repeticion infinita. Anade un "clavo" o punto fijo arriba para reforzar la idea de pendulo. Sin JS.`,
  code:`/* Swing attention seeker (Animate.css style) */
.swing {
  transform-origin: top center;
  animation: am-swing 1s infinite ease-in-out;
}
@keyframes am-swing {
  20% { transform: rotate(15deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(5deg); }
  80% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amSwing{20%{transform:rotate(15deg)}40%{transform:rotate(-10deg)}60%{transform:rotate(5deg)}80%{transform:rotate(-5deg)}100%{transform:rotate(0deg)}}</style><div style="position:relative;display:flex;flex-direction:column;align-items:center"><div style="width:10px;height:10px;border-radius:50%;background:#00e0c6;box-shadow:0 0 10px #00e0c6;z-index:1"></div><div style="font:800 30px/1 system-ui,sans-serif;color:#fff;padding:14px 20px;border-radius:0 0 14px 14px;background:linear-gradient(135deg,#7b5cff,#00e0c6);transform-origin:top center;animation:amSwing 1.4s 0.3s infinite ease-in-out;margin-top:-2px">Swing</div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
