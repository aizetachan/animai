/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-marquee-mask', title:'Gradient Mask Text', cat:'CSS Moderno',
  tags:['css','mask','texto','fade','degradado','revelar'],
  desc:'Texto que se desvanece en los bordes con mask-image. Útil en tickers, listas largas y overflow elegante.',
  meta:['mask-image','gradient','0 JS'],
  prompt:`Aplica un desvanecido suave en los bordes de un bloque de texto/contenido con mask-image.
mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent) para fade horizontal (o 180deg para vertical).
Combínalo con overflow oculto o scroll para listas, tickers y carruseles donde el contenido "entra y sale" con elegancia en vez de cortarse en seco.`,
  code:`/* Fade en bordes con mask-image */
.fade-edges {
  -webkit-mask-image: linear-gradient(90deg,
    transparent, #000 12%, #000 88%, transparent);
          mask-image: linear-gradient(90deg,
    transparent, #000 12%, #000 88%, transparent);
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent);mask-image:linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent)';
    s.innerHTML='<style>@keyframes mq2{to{transform:translateX(-50%)}}</style><div id="mq" style="display:flex;gap:26px;white-space:nowrap;animation:mq2 9s linear infinite"></div>';
    el.appendChild(s);const mq=s.querySelector('#mq');const t='Diseño · Movimiento · Web · ';mq.textContent=(t.repeat(8));
    return{stop(){el.innerHTML='';}};
  }
};
export default effect;
