/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-only-tooltip', title:'Animated Tooltip', cat:'Hover & UI',
  tags:['tooltip','css','hover','aparecer','globo','info','microinteracción'],
  desc:'Un tooltip que aparece con fade y desliza suavemente al hover, con flechita. Tooltip pulido CSS.',
  meta:['::after','transition','Tooltip'],
  prompt:`Crea un tooltip animado en CSS: al hacer hover sobre un elemento, aparece una etiqueta encima con fade + un pequeño deslizamiento hacia arriba y una flechita apuntando al elemento.
Usa ::before (burbuja) y ::after (triángulo) posicionados; estado base opacity:0 + translateY(4px), y al :hover opacity:1 + translateY(0) con transición. content desde un data-attribute.
Para iconos, botones y campos con ayuda contextual.`,
  code:`/* Tooltip animado (CSS) */
.tip::before {
  content: attr(data-tip);
  position: absolute; bottom: 120%; left: 50%;
  transform: translateX(-50%) translateY(4px);
  opacity: 0; transition: 0.25s; pointer-events: none;
}
.tip:hover::before { opacity: 1; transform: translateX(-50%) translateY(0); }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes tipshow{0%,30%{opacity:0;transform:translateX(-50%) translateY(6px)}50%,80%{opacity:1;transform:translateX(-50%) translateY(0)}100%{opacity:0;transform:translateX(-50%) translateY(6px)}}.tipw{position:relative}.tipw::before{content:"¡Hola! 👋";position:absolute;bottom:130%;left:50%;background:#7b5cff;color:#fff;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;white-space:nowrap;animation:tipshow 3s ease-in-out infinite}.tipw::after{content:"";position:absolute;bottom:115%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#7b5cff;animation:tipshow 3s ease-in-out infinite}</style><div class="tipw" style="width:44px;height:44px;border-radius:50%;background:#16162a;border:1px solid #2a2a3e;display:grid;place-items:center;color:#8a8ca3;font-size:18px">?</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
