/** @type {import('../types.js').Effect} */
const effect = {
  id:'hover-underline', title:'Underline Reveal', cat:'Hover & UI',
  tags:['underline','subrayado','hover.css','link','menú','scaleX'],
  desc:'Subrayado que crece desde el centro al hover. El underline animado imprescindible en menús.',
  meta:['::after','scaleX','Menú'],
  prompt:`Crea un subrayado animado para links de menú: un ::after de 2px con transform:scaleX(0) y transform-origin:center que pasa a scaleX(1) al hover, con transición suave.
Variantes: origin left (entra de izquierda), o desde centro. Es el detalle que hace que un nav se sienta pulido. Acompaña con :focus-visible.`,
  code:`/* Underline reveal desde el centro */
.link { position: relative; }
.link::after {
  content: ''; position: absolute; left: 0; bottom: -2px;
  width: 100%; height: 2px; background: #7b5cff;
  transform: scaleX(0); transform-origin: center;
  transition: transform 0.3s cubic-bezier(.2,.8,.2,1);
}
.link:hover::after { transform: scaleX(1); }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:flex;gap:22px;align-items:center;justify-content:center';
    s.innerHTML='<style>.ulk{position:relative;color:#eef0f7;font-weight:600;font-size:16px;cursor:pointer}.ulk::after{content:"";position:absolute;left:0;bottom:-3px;width:100%;height:2px;background:#7b5cff;transform:scaleX(0);transform-origin:center;transition:transform .35s cubic-bezier(.2,.8,.2,1)}.ulk:hover::after{transform:scaleX(1)}.ulk.auto::after{animation:ulauto 2.4s ease-in-out infinite}@keyframes ulauto{0%,100%{transform:scaleX(0)}50%{transform:scaleX(1)}}</style><span class="ulk">Inicio</span><span class="ulk auto">Trabajo</span><span class="ulk">Contacto</span>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
