/** @type {import('../types.js').Effect} */
const effect = {
  id:'logo-ticker', title:'Infinite Logo Ticker', cat:'Scroll',
  tags:['logos','ticker','marcas','infinito','marquee','social proof'],
  desc:'Cinta infinita de logos que se desliza sin costuras. La franja de "confían en nosotros".',
  meta:['CSS','loop seamless','Social proof'],
  prompt:`Ticker infinito de logos (banda de social proof "trusted by").
Duplica la lista de logos y desplaza el track con translateX en bucle CSS (@keyframes, 100% = -50% del track duplicado) para un loop sin saltos.
Pausa en hover (animation-play-state:paused). Fade lateral con mask-image para entradas/salidas suaves.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 15%,#000 85%,transparent);mask-image:linear-gradient(90deg,transparent,#000 15%,#000 85%,transparent)';
    const names=['ACME','NOVA','PIXEL','ORBIT','FLUX','VERTEX'];
    s.innerHTML='<style>@keyframes tick{to{transform:translateX(-50%)}}</style><div id="tk" style="display:flex;gap:34px;white-space:nowrap;animation:tick 12s linear infinite"></div>';
    el.appendChild(s);const tk=s.querySelector('#tk');const set=names.concat(names);set.forEach(n=>{const d=document.createElement('div');d.textContent=n;d.style.cssText='font-size:22px;font-weight:800;color:#5a5c72;letter-spacing:.05em';tk.appendChild(d);});
    return{stop(){el.innerHTML='';}};
  }
};
export default effect;
