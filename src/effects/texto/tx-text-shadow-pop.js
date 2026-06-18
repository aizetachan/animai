/** @type {import('../types.js').Effect} */
const effect = {
  id:'tx-text-shadow-pop', title:'Text Shadow Pop', cat:'Texto',
  tags:['pop','text-shadow','depth','entrada','3d','typography','loop'],
  desc:'Aparición con text-shadow que emerge desde la profundidad como un pop-up 3D.',
  meta:['text-shadow','translateZ','CSS+JS'],
  prompt:`Crea una animación de entrada de texto que "salta" desde el fondo hacia el frente: la palabra empieza pequeña, borrosa y con una sombra larga (proyectada lejos) y se asienta al frente con la sombra encogiéndose, dando sensación de pop-up en profundidad.
Elementos: un span/h1 grueso de color claro.
Técnica: anima a la vez (a) transform scale de 0.4 -> 1 con un overshoot (cubic-bezier rebote), (b) un text-shadow encadenado de N capas hacia abajo-derecha que parte muy largo (depth alta) y se reduce a corto, y (c) opacity 0 -> 1. Usa @keyframes con varios stops del text-shadow. Bucle: tras asentarse, reinicia.
Timings: pop ~700ms con overshoot, espera ~900ms, ciclo total ~1800ms. Sombra en #7b5cff sobre fondo oscuro.`,
  code:`<h1 class="tsp">POP!</h1>
<style>
.tsp{font:900 64px system-ui;color:#eef0f7;display:inline-block;animation:tspPop 1.8s cubic-bezier(.34,1.56,.64,1) infinite}
@keyframes tspPop{
  0%{transform:scale(.4);opacity:0;text-shadow:18px 18px 0 #7b5cff,14px 14px 0 #7b5cff,10px 10px 0 #7b5cff}
  40%{transform:scale(1.06);opacity:1;text-shadow:6px 6px 0 #7b5cff,4px 4px 0 #7b5cff,2px 2px 0 #00e0c6}
  60%{transform:scale(1);text-shadow:3px 3px 0 #7b5cff,2px 2px 0 #00e0c6}
  85%{transform:scale(1);opacity:1}
  100%{transform:scale(.4);opacity:0}
}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#0e0e16;overflow:hidden';
    s.innerHTML='<style>'
      +'.tsp-t{font:900 56px system-ui,sans-serif;color:#eef0f7;display:inline-block;animation:tspPop 1.8s cubic-bezier(.34,1.56,.64,1) infinite}'
      +'@keyframes tspPop{'
      +'0%{transform:scale(.4);opacity:0;text-shadow:20px 20px 0 #7b5cff,16px 16px 0 #7b5cff,12px 12px 0 #7b5cff,8px 8px 0 #7b5cff}'
      +'38%{transform:scale(1.08);opacity:1;text-shadow:6px 6px 0 #7b5cff,4px 4px 0 #7b5cff,2px 2px 0 #00e0c6}'
      +'56%{transform:scale(1);text-shadow:3px 3px 0 #7b5cff,2px 2px 0 #00e0c6}'
      +'82%{transform:scale(1);opacity:1;text-shadow:3px 3px 0 #7b5cff,2px 2px 0 #00e0c6}'
      +'100%{transform:scale(.4);opacity:0;text-shadow:20px 20px 0 #7b5cff,16px 16px 0 #7b5cff,12px 12px 0 #7b5cff,8px 8px 0 #7b5cff}'
      +'}'
      +'</style><div class="tsp-t">POP!</div>';
    el.appendChild(s);
    return{stop(){el.innerHTML='';}};
  }
};
export default effect;
