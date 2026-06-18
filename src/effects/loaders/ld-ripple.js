/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-ripple', title:'Ripple Rings', cat:'Loaders',
  tags:['css','loader','ripple','rings','ondas','radar','0 js'],
  desc:'Dos círculos que se expanden y desvanecen desde el centro, como ondas de radar.',
  meta:['scale','opacity','0 JS'],
  prompt:`Crea un loader de ondas expansivas.
Dos divs con border circular que crecen desde 0 hasta llenar el contenedor mientras su opacidad pasa de 1 a 0. El segundo lleva animation-delay de -0.5s (la mitad del ciclo) para solapar las ondas. 1s cubic-bezier infinite.`,
  code:`.ripple { width:64px; aspect-ratio:1; position:relative; }
.ripple div { position:absolute; border:4px solid #7b5cff; border-radius:50%; animation: rp 1s cubic-bezier(0,.2,.8,1) infinite; }
.ripple div:nth-child(2){ animation-delay:-.5s }
@keyframes rp {
  0% { top:32px; left:32px; width:0; height:0; opacity:1; }
  100% { top:0; left:0; width:64px; height:64px; opacity:0; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes ldRp{0%{top:32px;left:32px;width:0;height:0;opacity:1}100%{top:0;left:0;width:64px;height:64px;opacity:0}}</style>'+
      '<div style="width:64px;height:64px;position:relative">'+
      '<div style="position:absolute;box-sizing:border-box;border:4px solid #7b5cff;border-radius:50%;animation:ldRp 1s cubic-bezier(0,.2,.8,1) infinite"></div>'+
      '<div style="position:absolute;box-sizing:border-box;border:4px solid #00e0c6;border-radius:50%;animation:ldRp 1s cubic-bezier(0,.2,.8,1) infinite;animation-delay:-.5s"></div>'+
      '</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
