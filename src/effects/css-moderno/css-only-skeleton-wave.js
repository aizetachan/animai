/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-only-skeleton-wave', title:'Skeleton Shimmer', cat:'CSS Moderno',
  tags:['skeleton','shimmer','loading','css','placeholder','wave','carga'],
  desc:'Placeholders de carga con un brillo que barre de izquierda a derecha. El skeleton screen moderno.',
  meta:['gradient sweep','loading','0 JS'],
  prompt:`Crea un "skeleton screen" con shimmer: bloques placeholder (líneas, avatar) en gris con un brillo diagonal que barre de izquierda a derecha en bucle, indicando carga.
Cada bloque tiene un background-gradient (gris → claro → gris) con background-size grande y animación de background-position. Reproduce la estructura del contenido real.
Para estados de carga elegantes que reducen la percepción de espera.`,
  code:`/* Skeleton shimmer */
.skeleton {
  background: linear-gradient(90deg, #1a1a2a 25%, #2a2a3e 50%, #1a1a2a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer { to { background-position: -200% 0; } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:flex;flex-direction:column;gap:10px;justify-content:center;padding:20px';
    s.innerHTML='<style>@keyframes shm{to{background-position:-200% 0}}.sk{background:linear-gradient(90deg,#1a1a2a 25%,#2e2e44 50%,#1a1a2a 75%);background-size:200% 100%;animation:shm 1.5s infinite;border-radius:6px}</style><div style="display:flex;gap:10px;align-items:center"><div class="sk" style="width:40px;height:40px;border-radius:50%;flex:0 0 auto"></div><div style="flex:1;display:flex;flex-direction:column;gap:6px"><div class="sk" style="height:10px;width:60%"></div><div class="sk" style="height:10px;width:40%"></div></div></div><div class="sk" style="height:10px;width:100%"></div><div class="sk" style="height:10px;width:90%"></div><div class="sk" style="height:10px;width:70%"></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
