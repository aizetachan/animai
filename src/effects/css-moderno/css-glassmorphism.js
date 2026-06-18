/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-glassmorphism', title:'Glassmorphism Card', cat:'CSS Moderno',
  tags:['css','glass','glassmorphism','blur','backdrop','tarjeta','translúcido'],
  desc:'Tarjeta de vidrio esmerilado con backdrop-filter sobre un fondo de color. El look glass que no muere.',
  meta:['backdrop-filter','blur','Translúcido'],
  prompt:`Crea una tarjeta glassmorphism.
Sobre un fondo colorido/con formas, pon un panel con background:rgba(255,255,255,.08), backdrop-filter:blur(14px), borde sutil rgba(255,255,255,.18) y border-radius generoso.
Añade un highlight superior con un gradiente lineal semitransparente. Cuida el contraste del texto encima para accesibilidad.`,
  code:`/* Glassmorphism con backdrop-filter */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;display:grid;place-items:center;overflow:hidden';
    s.innerHTML='<div style="position:absolute;width:120px;height:120px;border-radius:50%;background:#7b5cff;left:20%;top:20%;filter:blur(8px)"></div><div style="position:absolute;width:100px;height:100px;border-radius:50%;background:#00e0c6;right:18%;bottom:15%;filter:blur(8px)"></div><div style="position:relative;width:170px;height:104px;border-radius:20px;background:rgba(255,255,255,.08);backdrop-filter:blur(14px) saturate(160%);-webkit-backdrop-filter:blur(14px) saturate(160%);border:1px solid rgba(255,255,255,.18);box-shadow:0 8px 32px rgba(0,0,0,.25);display:grid;place-items:center;color:#fff;font-weight:700;font-size:15px">Glass</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
