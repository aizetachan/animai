/** @type {import('../types.js').Effect} */
const effect = {
  id:'mi-floating-label', title:'Floating Label', cat:'Micro-interacciones',
  tags:['label','input','floating','flotante','form','focus','micro'],
  desc:'Label de campo de texto que sube y se encoge al enfocar el input, con barra de acento, en bucle.',
  meta:['transform','transition','animation'],
  prompt:`Crea un campo de texto con "floating label".
Estructura: un .field con un input y un .label posicionado sobre el placeholder. Debajo una .bar (linea) que se ilumina al enfocar.
Al enfocar (estado activo), el label sube con transform:translateY y scale menor y cambia a color de acento; la barra se expande de width 0 a 100% desde el centro.
Normalmente se hace con :focus / :not(:placeholder-shown). Para la demo automatica se alterna una clase .active con keyframes que simulan el ciclo focus/blur.
Colores: label activo y barra en #7b5cff; texto claro. Ciclo ~3.5s infinite.`,
  code:`<div class="field">
  <input type="text" placeholder=" " value="ana@correo.com">
  <span class="label">Correo electronico</span>
  <span class="bar"></span>
</div>
<style>
.field{position:relative;width:210px}
.field input{width:100%;background:transparent;border:none;outline:none;
  color:#fff;font-size:15px;padding:18px 2px 8px;border-bottom:1px solid rgba(255,255,255,.2)}
.label{position:absolute;left:2px;top:18px;color:#8a8a9a;font-size:15px;
  pointer-events:none;transform-origin:left;animation:flLabel 3.5s ease-in-out infinite}
.bar{position:absolute;left:0;bottom:0;height:2px;width:100%;background:#7b5cff;
  transform:scaleX(0);transform-origin:center;animation:flBar 3.5s ease-in-out infinite}
@keyframes flLabel{0%,15%{transform:translateY(0) scale(1);color:#8a8a9a}
  45%,100%{transform:translateY(-22px) scale(.78);color:#7b5cff}}
@keyframes flBar{0%,15%{transform:scaleX(0)}45%,100%{transform:scaleX(1)}}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes miFlLabel{0%,15%{transform:translateY(0) scale(1);color:#8a8a9a}45%,90%{transform:translateY(-22px) scale(.78);color:#7b5cff}100%{transform:translateY(0) scale(1);color:#8a8a9a}}'
      +'@keyframes miFlBar{0%,15%{transform:scaleX(0)}45%,90%{transform:scaleX(1)}100%{transform:scaleX(0)}}'
      +'@keyframes miFlTxt{0%,20%{opacity:0}40%,100%{opacity:1}}'
      +'.miFlField{position:relative;width:210px;font-family:system-ui,sans-serif}'
      +'.miFlInput{width:100%;background:transparent;border:none;color:#fff;font-size:15px;padding:18px 2px 8px;border-bottom:1px solid rgba(255,255,255,.2);box-sizing:border-box;animation:miFlTxt 3.5s ease-in-out infinite}'
      +'.miFlLabel{position:absolute;left:2px;top:18px;color:#8a8a9a;font-size:15px;pointer-events:none;transform-origin:left;animation:miFlLabel 3.5s ease-in-out infinite}'
      +'.miFlBar{position:absolute;left:0;bottom:0;height:2px;width:100%;background:#7b5cff;transform:scaleX(0);transform-origin:center;animation:miFlBar 3.5s ease-in-out infinite}'
      +'</style>'
      +'<div class="miFlField"><div class="miFlInput">ana@correo.com</div><span class="miFlLabel">Correo electronico</span><span class="miFlBar"></span></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
