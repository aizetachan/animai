/** @type {import('../types.js').Effect} */
const effect = {
  id:'text-gradient', title:'Animated Gradient Text', cat:'Texto',
  tags:['texto','gradiente','titular','css','hero'],
  desc:'Titular con gradiente que se desplaza en bucle. Solo CSS, cero JS. El más fácil de adoptar.',
  meta:['CSS puro','0 JS','Accesible'],
  prompt:`Titular de hero con gradiente animado SOLO con CSS.
background:linear-gradient con varios colores de marca, background-size:200%, -webkit-background-clip:text y color:transparent.
Anima background-position en bucle con @keyframes (8-12s, infinite alternate). Mantén el texto seleccionable. Respeta reduced-motion.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.innerHTML='<style>@keyframes gt{0%{background-position:0% 50%}100%{background-position:200% 50%}}</style><div style="height:100%;display:grid;place-items:center;text-align:center;padding:0 16px"><span style="font-size:34px;font-weight:800;letter-spacing:-.02em;background:linear-gradient(90deg,#7b5cff,#00e0c6,#ff5ca8,#7b5cff);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:gt 6s linear infinite">Ship faster.</span></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
