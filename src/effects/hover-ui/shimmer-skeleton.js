/** @type {import('../types.js').Effect} */
const effect = {
  id:'shimmer-skeleton', title:'Shimmer Skeleton', cat:'Hover & UI',
  tags:['skeleton','loading','shimmer','carga','placeholder','ui'],
  desc:'Placeholder de carga con barrido de luz. El estándar para estados de loading elegantes.',
  meta:['CSS','Loading state','0 JS'],
  prompt:`Skeleton loader con shimmer en CSS puro.
Bloques con fondo oscuro y un ::after con gradiente claro que barre de izquierda a derecha en bucle (translateX -100%->100%, ~1.5s infinite).
Usa la forma real del contenido (líneas, avatar, thumbnail) para evitar layout shift. Respeta reduced-motion.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='padding:18px;display:flex;flex-direction:column;gap:12px;justify-content:center';
    s.innerHTML='<style>@keyframes shm{100%{transform:translateX(100%)}} .sk{position:relative;overflow:hidden;background:#16162a;border-radius:8px} .sk::after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,rgba(123,92,255,.25),transparent);animation:shm 1.5s infinite}</style><div style="display:flex;gap:12px;align-items:center"><div class="sk" style="width:44px;height:44px;border-radius:50%"></div><div style="flex:1;display:flex;flex-direction:column;gap:8px"><div class="sk" style="height:12px;width:55%"></div><div class="sk" style="height:12px;width:80%"></div></div></div><div class="sk" style="height:12px;width:100%"></div><div class="sk" style="height:12px;width:90%"></div><div class="sk" style="height:12px;width:70%"></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
