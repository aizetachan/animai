/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-hourglass', title:'Hourglass Flip', cat:'Loaders',
  tags:['css','loader','hourglass','reloj','flip','clepsidra','0 js'],
  desc:'Un reloj de arena formado con dos triángulos (borders) que gira 180º en cada ciclo.',
  meta:['border-triangles','rotate','0 JS'],
  prompt:`Crea un loader de reloj de arena.
Usa un div cuadrado cuyos triángulos se forman con un box-shadow inset o con border-width gruesos (top y bottom de color, left/right transparent) para dibujar dos conos opuestos.
Anímalo con @keyframes que mantenga el reloj y luego rote 180deg (transform:rotate) con pausa, 1.2s infinite.`,
  code:`.hourglass {
  width:0; height:0;
  border: 24px solid #7b5cff;
  border-color: #7b5cff transparent;
  animation: hg 1.2s ease-in-out infinite;
}
@keyframes hg {
  0%, 40% { transform: rotate(0); }
  60%, 100% { transform: rotate(180deg); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes ldHg{0%,40%{transform:rotate(0deg)}60%,100%{transform:rotate(180deg)}}</style>'+
      '<div style="width:0;height:0;border:26px solid #7b5cff;border-color:#7b5cff transparent;animation:ldHg 1.2s ease-in-out infinite"></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
