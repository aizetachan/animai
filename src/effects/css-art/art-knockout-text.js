/** @type {import('../types.js').Effect} */
const effect = {
  id:'art-knockout-text', title:'Knockout Text', cat:'CSS Art',
  tags:['css','text','texto','background-clip','knockout','gradient','recortado'],
  desc:'Texto que recorta un gradiente animado moviendose detras con background-clip:text.',
  meta:['background-clip:text','keyframes','CSS'],
  prompt:`Crea texto tipo "knockout" donde las letras revelan un gradiente animado.
Usa un titulo grande en negrita con background:linear-gradient con varias paradas de color de marca, background-size mayor que el texto (ej 300%), -webkit-background-clip:text y color:transparent para que el fondo solo se vea dentro de las letras.
Anima @keyframes que desplazan background-position de 0% a 100% en bucle (ease-in-out), de modo que el gradiente fluye a traves del texto. Sin JS.`,
  code:`.knockout {
  font: 900 56px/1 system-ui, sans-serif; letter-spacing: 2px;
  background: linear-gradient(90deg, #7b5cff, #00e0c6, #ff5ca8, #7b5cff);
  background-size: 300% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: koFlow 5s ease-in-out infinite;
}
@keyframes koFlow {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes koFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}.koTxt{font:900 50px/1 system-ui,sans-serif;letter-spacing:2px;text-align:center;background:linear-gradient(90deg,#7b5cff,#00e0c6,#ff5ca8,#7b5cff);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:koFlow 5s ease-in-out infinite}</style><div class="koTxt">ANIMAI</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
