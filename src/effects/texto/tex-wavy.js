/** @type {import('../types.js').Effect} */
const effect = {
  id:'tex-wavy', title:'Wavy Text', cat:'Texto',
  tags:['texto','wave','onda','letras','ondular','bounce'],
  desc:'Las letras del texto ondulan en vertical como una bandera. Texto juguetón letra a letra.',
  meta:['per-letter','translateY','Loop'],
  prompt:`Crea un texto ondulante: cada letra sube y baja (translateY) con un desfase progresivo por índice, creando una onda que recorre la palabra.
Envuelve cada carácter en un span y aplica una animación @keyframes con animation-delay = índice * factor.
Juguetón para logos, encabezados lúdicos o estados de "cargando".`,
  code:`/* Wavy text — anima cada letra con delay por índice */
.wavy span {
  display: inline-block;
  animation: wave 1.2s ease-in-out infinite;
}
.wavy span:nth-child(n) { animation-delay: calc(var(--i) * 0.08s); }
@keyframes wave { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes wvy{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}</style><div id="wv" style="font-size:30px;font-weight:800;color:#7b5cff"></div>';
    el.appendChild(s);const wv=s.querySelector('#wv');'Wavy Text'.split('').forEach((ch,i)=>{const sp=document.createElement('span');sp.textContent=ch===' '?'\u00A0':ch;sp.style.cssText='display:inline-block;animation:wvy 1.3s ease-in-out infinite;animation-delay:'+(i*.08)+'s';sp.style.color=i%2?'#00e0c6':'#7b5cff';wv.appendChild(sp);});
    return{stop(){el.innerHTML='';}};
  }
};
export default effect;
