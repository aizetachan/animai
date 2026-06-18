/** @type {import('../types.js').Effect} */
const effect = {
  id:'border-gradient', title:'Rotating Border', cat:'Hover & UI',
  tags:['borde','gradiente','glow','conic','card','rotativo','neon'],
  desc:'Borde con gradiente cónico que gira alrededor de la card. El "glow border" de las landings de IA.',
  meta:['conic-gradient','@property','Loop'],
  prompt:`Borde con gradiente cónico giratorio alrededor de una card.
Usa un pseudo-elemento con conic-gradient y anima su rotación (con @property --angle para animar el ángulo, o rotando el gradiente).
Recorta el interior con un fondo sólido para que solo el borde brille. Estética IA/SaaS. Pausa en reduced-motion.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#0a0a12';
    s.innerHTML='<style>@keyframes spin360{to{transform:rotate(360deg)}}</style><div style="position:relative;width:160px;height:96px;border-radius:16px;overflow:hidden;display:grid;place-items:center"><div style="position:absolute;inset:-60%;background:conic-gradient(from 0deg,#7b5cff,#00e0c6,#ff5ca8,#7b5cff);animation:spin360 4s linear infinite"></div><div style="position:absolute;inset:2px;border-radius:14px;background:#12121e"></div><span style="position:relative;color:#eef0f7;font-weight:700;font-size:14px">Glow Border</span></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
