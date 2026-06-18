/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-only-toggle', title:'iOS Toggle Switch', cat:'Hover & UI',
  tags:['toggle','switch','ios','css','interruptor','on off','slide'],
  desc:'Un interruptor estilo iOS que desliza con rebote y cambia de color. El switch satisfactorio, solo CSS.',
  meta:['transition','knob','0 JS'],
  prompt:`Crea un toggle switch estilo iOS en CSS: una pista redondeada con un knob que se desliza de izquierda (off, gris) a derecha (on, color), con un pequeño rebote/squash al cambiar.
Un input checkbox oculto controla el estado; la pista cambia background-color y el knob hace translateX con transición elástica. Opcional: el knob se estira un poco al moverse.
Para ajustes y formularios con tacto premium.`,
  code:`/* iOS toggle (CSS, checkbox oculto) */
.track { width: 52px; height: 30px; border-radius: 999px; background: #3a3a4e; transition: background .3s; }
.knob { width: 24px; height: 24px; border-radius: 50%; background: #fff; transition: transform .3s cubic-bezier(.5,1.6,.4,1); }
input:checked + .track { background: #7b5cff; }
input:checked + .track .knob { transform: translateX(22px); }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes tgl{0%,45%{background:#3a3a4e}55%,100%{background:#7b5cff}}@keyframes knb{0%,45%{transform:translateX(0)}50%{transform:translateX(11px) scaleX(1.2)}55%,100%{transform:translateX(22px) scaleX(1)}}</style><div style="width:54px;height:30px;border-radius:999px;padding:3px;box-sizing:border-box;animation:tgl 3s ease-in-out infinite"><div style="width:24px;height:24px;border-radius:50%;background:#fff;animation:knb 3s ease-in-out infinite"></div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
