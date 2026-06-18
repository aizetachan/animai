/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-yin-yang', title:'Yin-Yang', cat:'Loaders',
  tags:['css','loader','yin yang','yinyang','spinner','girar','0 js'],
  desc:'El símbolo yin-yang construido en puro CSS con bordes y pseudo-elementos, girando sin parar.',
  meta:['border','pseudo-elements','0 JS'],
  prompt:`Crea un loader con el símbolo yin-yang girando, solo CSS.
Un div redondo de 50px con border-radius:50%, mitad superior de un color y mitad inferior de otro: usa border de grosor igual al radio donde el borde superior es color A y el inferior color B (truco de border:25px solid; border-color: A B B A no funciona bien, mejor usa background lineal o un box mitad-mitad).
Forma alternativa: un círculo con background:#7b5cff, border:1px y dos pseudo-elementos ::before y ::after que son semicírculos pequeños arriba (color secundario) y abajo (color acento), cada uno con un punto central del color contrario.
Anima el contenedor con @keyframes rotate 360deg, 1.4s linear infinite.`,
  code:`.yy {
  width: 50px; aspect-ratio: 1; border-radius: 50%;
  border: 1px solid #7b5cff;
  background: linear-gradient(#00e0c6 50%, #7b5cff 50%);
  position: relative;
  animation: yy-spin 1.4s linear infinite;
}
.yy::before, .yy::after {
  content: ''; position: absolute; left: 50%; transform: translateX(-50%);
  width: 50%; aspect-ratio: 1; border-radius: 50%;
}
.yy::before { top: 0;    background: #00e0c6; }
.yy::after  { bottom: 0; background: #7b5cff; }
@keyframes yy-spin { to { transform: rotate(360deg); } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes ldYySpin{to{transform:rotate(360deg)}}.ldYy{width:50px;aspect-ratio:1;border-radius:50%;border:1px solid #7b5cff;background:linear-gradient(#00e0c6 50%,#7b5cff 50%);position:relative;animation:ldYySpin 1.4s linear infinite}.ldYy::before,.ldYy::after{content:"";position:absolute;left:50%;transform:translateX(-50%);width:50%;aspect-ratio:1;border-radius:50%}.ldYy::before{top:0;background:#00e0c6}.ldYy::after{bottom:0;background:#7b5cff}.ldYy i{position:absolute;left:50%;transform:translateX(-50%);width:14%;aspect-ratio:1;border-radius:50%;z-index:2}.ldYy .t{top:18%;background:#7b5cff}.ldYy .b{bottom:18%;background:#00e0c6}</style><div class="ldYy"><i class="t"></i><i class="b"></i></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
