/** @type {import('../types.js').Effect} */
const effect = {
  id:'hover-shine', title:'Shine Sweep', cat:'Hover & UI',
  tags:['shine','brillo','hover.css','reflejo','barrido','botón','glossy'],
  desc:'Un brillo diagonal barre el elemento al hover. El "shine" glossy de botones premium.',
  meta:['skew gradient','Hover','Glossy'],
  prompt:`Crea un barrido de brillo (shine) sobre un botón al hover: un pseudo-elemento con un gradiente blanco semitransparente, inclinado (skew), que viaja de izquierda a derecha (translateX) cruzando el botón.
Se dispara en :hover con una transición de ~0.6s. Da sensación glossy/premium a CTAs y badges.`,
  code:`/* Shine sweep en hover */
.shine { position: relative; overflow: hidden; }
.shine::after {
  content: ''; position: absolute; top: 0; left: -120%;
  width: 60%; height: 100%; transform: skewX(-20deg);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
  transition: left 0.6s ease;
}
.shine:hover::after { left: 140%; }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>.shn{position:relative;overflow:hidden;padding:14px 30px;border-radius:12px;background:linear-gradient(90deg,#7b5cff,#5a3fd6);color:#fff;font-weight:700}.shn::after{content:"";position:absolute;top:0;left:-120%;width:55%;height:100%;transform:skewX(-20deg);background:linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent);animation:shsweep 2.4s ease-in-out infinite}@keyframes shsweep{0%{left:-120%}60%,100%{left:160%}}</style><div class="shn">Premium</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
