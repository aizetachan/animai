/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-aurora-blur', title:'Aurora Blobs (CSS)', cat:'CSS Moderno',
  tags:['css','aurora','blobs','fondo','blur','gradiente','hero'],
  desc:'Fondo de manchas de color difuminadas que flotan. El "aurora background" de las landings de IA, solo CSS.',
  meta:['filter:blur','keyframes','Fondo'],
  prompt:`Crea un fondo "aurora" de manchas difuminadas que flotan, solo con CSS.
Varios divs circulares con colores de marca, filter:blur(60px), opacidades medias, animados con @keyframes que mueven translate y scale en bucle lento.
Ponlos en un contenedor con overflow:hidden detrás del hero. Es el fondo de moda en SaaS/IA. Respeta reduced-motion.`,
  code:`/* Aurora background con blobs difuminados */
.aurora { position: relative; overflow: hidden; }
.aurora .blob {
  position: absolute; border-radius: 50%;
  filter: blur(60px); opacity: 0.5;
  animation: drift 12s ease-in-out infinite alternate;
}
.blob.a { background: #7b5cff; width: 300px; height: 300px; }
.blob.b { background: #00e0c6; width: 260px; height: 260px; animation-delay: -4s; }
@keyframes drift {
  to { transform: translate(60px, -40px) scale(1.2); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;overflow:hidden;background:#0a0a12';
    s.innerHTML='<style>@keyframes dft1{to{transform:translate(50px,-30px) scale(1.25)}}@keyframes dft2{to{transform:translate(-40px,30px) scale(1.15)}}</style><div style="position:absolute;width:150px;height:150px;border-radius:50%;background:#7b5cff;filter:blur(45px);opacity:.6;left:15%;top:20%;animation:dft1 8s ease-in-out infinite alternate"></div><div style="position:absolute;width:130px;height:130px;border-radius:50%;background:#00e0c6;filter:blur(45px);opacity:.5;right:15%;bottom:15%;animation:dft2 7s ease-in-out infinite alternate"></div><div style="position:absolute;width:110px;height:110px;border-radius:50%;background:#ff5ca8;filter:blur(45px);opacity:.4;left:45%;top:50%;animation:dft1 9s ease-in-out infinite alternate"></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
