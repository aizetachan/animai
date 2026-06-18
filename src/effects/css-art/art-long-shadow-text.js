/** @type {import('../types.js').Effect} */
const effect = {
  id:'art-long-shadow-text', title:'Long Shadow Text', cat:'CSS Art',
  tags:['css art','long shadow','texto','typography','3d','sombra','0 js'],
  desc:'Palabra con larga sombra 3D en diagonal generada por text-shadow apilado, con el ángulo de luz que rota en bucle.',
  meta:['text-shadow','typography','0 JS'],
  prompt:`Crea el efecto "long shadow" sobre una palabra de texto.
Apila muchos text-shadow incrementales (1px 1px, 2px 2px, 3px 3px ... hasta ~30px) todos del mismo color oscuro/secundario para simular una sombra proyectada larga y sólida en diagonal.
El texto va en un color claro/acento brillante.
Para animar el ángulo de luz, usa una variable CSS o (en preview) recalcula la dirección de la sombra con JS rAF rotando el vector; alternativamente usa @keyframes que rotan filter:hue-rotate del color de sombra. Define keyframes propios con prefijo único.`,
  code:`.long-shadow {
  font: 800 46px/1 system-ui, sans-serif; color: #7b5cff; letter-spacing: 1px;
  text-shadow:
    1px 1px #00e0c6, 2px 2px #00e0c6, 3px 3px #00e0c6, 4px 4px #00e0c6,
    5px 5px #00e0c6, 6px 6px #00e0c6, 7px 7px #00e0c6, 8px 8px #00e0c6,
    9px 9px rgba(0,224,198,.7), 12px 12px rgba(0,224,198,.4), 16px 16px rgba(0,224,198,.15);
  animation: artLsHue 4s linear infinite;
}
@keyframes artLsHue { to { filter: hue-rotate(360deg) } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    const wrap=document.createElement('div');
    wrap.innerHTML='<span style="font:800 44px/1 system-ui,sans-serif;color:#7b5cff;letter-spacing:1px">ANIMAI</span>';
    const span=wrap.firstChild;
    s.appendChild(wrap);el.appendChild(s);
    let raf,t=0;
    const build=(ang)=>{
      const dx=Math.cos(ang),dy=Math.sin(ang);let sh='';
      for(let i=1;i<=22;i++){const a=i<=8?1:Math.max(0,1-(i-8)/16);sh+=`${(dx*i).toFixed(1)}px ${(dy*i).toFixed(1)}px rgba(0,224,198,${a.toFixed(2)}),`;}
      return sh.slice(0,-1);
    };
    const loop=()=>{t+=0.012;span.style.textShadow=build(t);raf=requestAnimationFrame(loop);};
    loop();
    return{stop(){cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
