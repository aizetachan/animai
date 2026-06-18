/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-clock-hands', title:'Clock Hands', cat:'Loaders',
  tags:['css','loader','reloj','clock','agujas','hands','0 js'],
  desc:'Esfera de reloj con dos agujas barriendo a distintas velocidades, como un loader de espera.',
  meta:['transform-origin','0 JS'],
  prompt:`Crea un loader con forma de esfera de reloj solo con CSS.
Un div circular con border (la esfera). Dentro, dos divs absolutos para las agujas: cada aguja es una barra fina con transform-origin en el extremo inferior (bottom center), centrada en la esfera con translate(-50%,-100%) sobre el punto medio.
La aguja larga (minutos) gira con @keyframes de 0 a 360deg en ~1.2s linear infinite; la corta (horas) gira más lento, ~6s linear infinite. Añade un punto central. Sin SVG ni JS.`,
  code:`.clock {
  width: 56px; aspect-ratio: 1; border-radius: 50%;
  border: 3px solid #7b5cff; position: relative;
}
.clock .hand {
  position: absolute; left: 50%; top: 50%; width: 3px;
  background: #00e0c6; border-radius: 3px;
  transform-origin: bottom center;
  transform: translate(-50%, -100%);
}
.clock .min { height: 22px; animation: clk-min 1.2s linear infinite; }
.clock .hr  { height: 14px; background:#7b5cff; animation: clk-hr 6s linear infinite; }
@keyframes clk-min { to { transform: translate(-50%, -100%) rotate(360deg); } }
@keyframes clk-hr  { to { transform: translate(-50%, -100%) rotate(360deg); } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes ldClkMin{to{transform:translate(-50%,-100%) rotate(360deg)}}'
      +'@keyframes ldClkHr{to{transform:translate(-50%,-100%) rotate(360deg)}}'
      +'</style>'
      +'<div style="position:relative;width:64px;aspect-ratio:1;border-radius:50%;border:3px solid #7b5cff">'
      +'<div style="position:absolute;left:50%;top:50%;width:3px;height:26px;background:#00e0c6;border-radius:3px;transform-origin:bottom center;transform:translate(-50%,-100%);animation:ldClkMin 1.2s linear infinite"></div>'
      +'<div style="position:absolute;left:50%;top:50%;width:3px;height:16px;background:#7b5cff;border-radius:3px;transform-origin:bottom center;transform:translate(-50%,-100%);animation:ldClkHr 6s linear infinite"></div>'
      +'<div style="position:absolute;left:50%;top:50%;width:8px;height:8px;border-radius:50%;background:#fff;transform:translate(-50%,-50%)"></div>'
      +'</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
