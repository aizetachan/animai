/** @type {import('../types.js').Effect} */
const effect = {
  id:'ui-bg-gradient-anim', title:'Animated Gradient BG', cat:'UI Components',
  tags:['gradient','fondo','animado','blobs','magic ui','color','mezcla'],
  desc:'Fondo de gradientes que se mezclan y mueven con blend modes. El Background Gradient Animation de Aceternity.',
  meta:['Aceternity UI','blend','Interactivo'],
  prompt:`Recrea el Background Gradient Animation de Aceternity: varias manchas de gradiente radial de colores que se mueven y se mezclan con mix-blend-mode (hard-light/screen) sobre un fondo de color, una de ellas siguiendo al cursor.
Cada blob es un radial-gradient grande animado con translate en bucle, con filter:blur y blend. Da un fondo vivo tipo "lava lamp" de IA.`,
  code:`// Aceternity UI — Background Gradient Animation (CSS blend)
.gradients-container { filter: blur(40px); }
.g1, .g2, .g3 {
  position: absolute; mix-blend-mode: hard-light;
  background: radial-gradient(circle, rgba(123,92,255,.8) 0, transparent 50%);
  animation: moveVertical 30s ease infinite;
}
@keyframes moveVertical { 50% { transform: translateY(-50%); } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;overflow:hidden;background:#0a0820';
    s.innerHTML='<div style="position:absolute;inset:0;filter:blur(30px)"><style>@keyframes mv1{50%{transform:translate(40px,-30px)}}@keyframes mv2{50%{transform:translate(-40px,30px)}}@keyframes mv3{50%{transform:translate(30px,40px)}}</style><div style="position:absolute;width:160px;height:160px;left:20%;top:25%;background:radial-gradient(circle,rgba(123,92,255,.85),transparent 60%);mix-blend-mode:hard-light;animation:mv1 6s ease infinite"></div><div style="position:absolute;width:150px;height:150px;right:18%;bottom:20%;background:radial-gradient(circle,rgba(0,224,198,.8),transparent 60%);mix-blend-mode:hard-light;animation:mv2 7s ease infinite"></div><div style="position:absolute;width:130px;height:130px;left:45%;top:45%;background:radial-gradient(circle,rgba(255,92,168,.75),transparent 60%);mix-blend-mode:hard-light;animation:mv3 8s ease infinite"></div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
