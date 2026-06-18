/** @type {import('../types.js').Effect} */
const effect = {
  id:'cd-text-scramble-path', title:'Text on Path', cat:'SVG',
  tags:['svg','text path','curva','texto','círculo','rotar','sello'],
  desc:'Texto que sigue una curva SVG y rota, como un sello circular. Texto sobre trazado.',
  meta:['SVG textPath','rotate','Sello'],
  prompt:`Crea texto que sigue un trazado SVG (textPath) en círculo y rota lentamente, como un sello/insignia o un badge giratorio.
Define un path circular con un id y un <textPath href="#id"> con el texto; anima la rotación del grupo con CSS/transform o animateTransform. Repite el texto para llenar el círculo.
Para sellos de "scroll down", insignias de marca, badges premium.`,
  code:`<!-- Texto sobre trazado circular que rota -->
<svg viewBox="0 0 200 200" class="spin">
  <defs>
    <path id="circle" d="M100,100 m-75,0 a75,75 0 1,1 150,0 a75,75 0 1,1 -150,0"/>
  </defs>
  <text><textPath href="#circle">• NAKAMA STUDIO • MOTION DESIGN </textPath></text>
</svg>
<style>.spin { animation: spin 10s linear infinite } @keyframes spin { to { transform: rotate(360deg) } }</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes tpspin{to{transform:rotate(360deg)}}</style><svg viewBox="0 0 200 200" width="60%" style="animation:tpspin 12s linear infinite"><defs><path id="tpc" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" fill="none"/></defs><text fill="#7b5cff" font-size="15" font-weight="700" letter-spacing="2"><textPath href="#tpc">• NAKAMA STUDIO • MOTION DESIGN </textPath></text><circle cx="100" cy="100" r="46" fill="none" stroke="#00e0c6" stroke-width="2"/><text x="100" y="106" text-anchor="middle" fill="#00e0c6" font-size="20">↓</text></svg>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
