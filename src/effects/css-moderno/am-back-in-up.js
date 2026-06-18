/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-back-in-up', title:'Back In Up', cat:'CSS Moderno',
  tags:['css','entrada','back','abajo','overshoot','slide','0 js'],
  desc:'Entrada desde abajo con un rebote de overshoot: el elemento sube, se pasa un poco y se asienta.',
  meta:['transform:translateY','scale','0 JS'],
  prompt:`Crea una animación de entrada "back in up" solo con CSS.
El elemento entra desde abajo (translateY positivo grande) y escalado pequeño, sube pasándose un poco (overshoot) y termina en su posición y tamaño finales.
Define @keyframes backInUp con 0% { transform:translateY(120px) scale(.7); opacity:.7 } 80% { transform:translateY(-12px) scale(1.02); opacity:1 } 100% { transform:translateY(0) scale(1); opacity:1 }.
Aplica animation: backInUp .8s cubic-bezier(.25,.46,.45,.94) both. Sin JS.`,
  code:`/* Back In Up: entrada desde abajo con overshoot */
.back-in-up {
  animation: backInUp 0.8s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}
@keyframes backInUp {
  0%   { transform: translateY(120px) scale(0.7); opacity: 0.7; }
  80%  { transform: translateY(-12px) scale(1.02); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;overflow:hidden';
    s.innerHTML='<style>@keyframes amBackInUp{0%{transform:translateY(110px) scale(.7);opacity:0}80%{transform:translateY(-12px) scale(1.02);opacity:1}100%{transform:translateY(0) scale(1);opacity:1}}</style><div style="padding:18px 28px;border-radius:14px;background:linear-gradient(135deg,#7b5cff,#00e0c6);color:#07070d;font:700 20px/1 system-ui,sans-serif;letter-spacing:.5px;will-change:transform;animation:amBackInUp 1.8s cubic-bezier(.25,.46,.45,.94) infinite">Back In Up</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
