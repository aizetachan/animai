/** @type {import('../types.js').Effect} */
const effect = {
  id:'art-gooey-metaballs', title:'Gooey Metaballs', cat:'CSS Art',
  tags:['css art','gooey','metaballs','filter','blur','contrast','0 js'],
  desc:'Blobs de color que se fusionan y separan como gotas de lava usando el truco filter blur + contrast sobre un contenedor.',
  meta:['filter','contrast','0 JS'],
  prompt:`Crea el efecto "gooey metaballs".
Un contenedor padre lleva filter: blur(10px) contrast(20) y un fondo sólido; dentro pon varios círculos (divs con border-radius:50%) de colores vivos.
El blur funde los bordes y el alto contrast vuelve a endurecerlos, de modo que cuando dos círculos se acercan se "fusionan" con un puente líquido.
Anima la posición de los círculos con @keyframes (translate en distintas fases/tiempos) para que choquen y se separen en bucle infinito. Usa nombres de keyframes con prefijo único. Sin JS para la animación (solo CSS).`,
  code:`.goo {
  width: 220px; height: 160px; background: #07070d;
  filter: blur(10px) contrast(22); overflow: hidden;
  display: grid; place-items: center;
}
.goo span {
  position: absolute; border-radius: 50%; background: #7b5cff;
}
.goo span:nth-child(1){ width:46px;height:46px; animation: artGooA 3s ease-in-out infinite }
.goo span:nth-child(2){ width:40px;height:40px; background:#00e0c6; animation: artGooB 3s ease-in-out infinite }
.goo span:nth-child(3){ width:34px;height:34px; animation: artGooC 3.4s ease-in-out infinite }
@keyframes artGooA { 0%,100%{transform:translate(-40px,0)} 50%{transform:translate(0,0)} }
@keyframes artGooB { 0%,100%{transform:translate(40px,0)} 50%{transform:translate(0,0)} }
@keyframes artGooC { 0%,100%{transform:translate(0,-34px)} 50%{transform:translate(0,4px)} }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'+
      '@keyframes artGooA{0%,100%{transform:translate(-42px,0)}50%{transform:translate(0,0)}}'+
      '@keyframes artGooB{0%,100%{transform:translate(42px,0)}50%{transform:translate(0,0)}}'+
      '@keyframes artGooC{0%,100%{transform:translate(0,-34px)}50%{transform:translate(0,6px)}}'+
      '</style>'+
      '<div style="position:relative;width:220px;height:160px;background:#07070d;filter:blur(10px) contrast(22);overflow:hidden;display:grid;place-items:center;border-radius:10px">'+
      '<span style="position:absolute;width:46px;height:46px;border-radius:50%;background:#7b5cff;animation:artGooA 3s ease-in-out infinite"></span>'+
      '<span style="position:absolute;width:40px;height:40px;border-radius:50%;background:#00e0c6;animation:artGooB 3s ease-in-out infinite"></span>'+
      '<span style="position:absolute;width:34px;height:34px;border-radius:50%;background:#9d86ff;animation:artGooC 3.4s ease-in-out infinite"></span>'+
      '</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
