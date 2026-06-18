/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-puff-in', title:'Puff In', cat:'CSS Moderno',
  tags:['css','entrada','puff','blur','escala','animation','0 js'],
  desc:'Entrada tipo puff: el elemento aparece desde una escala grande y borrosa hasta su tamaño nítido.',
  meta:['filter:blur','transform:scale','0 JS'],
  prompt:`Crea una animación de entrada "puff in" solo con CSS.
El elemento parte de transform:scale(2) con filter:blur(4px) y opacity:0, y termina en scale(1), blur(0) y opacity:1.
Define @keyframes puffIn con 0% { transform:scale(2); filter:blur(4px); opacity:0 } y 100% { transform:scale(1); filter:blur(0); opacity:1 }.
Aplica animation: puffIn .6s cubic-bezier(.47,0,.745,.715) both. Sin JS.`,
  code:`/* Entrada puff: blur + escala desde grande */
.puff-in {
  animation: puffIn 0.6s cubic-bezier(0.470, 0.000, 0.745, 0.715) both;
}
@keyframes puffIn {
  0%   { transform: scale(2); filter: blur(4px); opacity: 0; }
  100% { transform: scale(1); filter: blur(0px); opacity: 1; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amPuffIn{0%{transform:scale(2);filter:blur(4px);opacity:0}100%{transform:scale(1);filter:blur(0);opacity:1}}</style><div style="padding:18px 28px;border-radius:14px;background:linear-gradient(135deg,#7b5cff,#00e0c6);color:#07070d;font:700 20px/1 system-ui,sans-serif;letter-spacing:.5px;will-change:transform,filter;animation:amPuffIn 1.6s cubic-bezier(.47,0,.745,.715) infinite">Puff In</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
