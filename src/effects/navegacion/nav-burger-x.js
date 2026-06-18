/** @type {import('../types.js').Effect} */
const effect = {
  id:'nav-burger-x', title:'Hamburger → X', cat:'Navegación',
  tags:['hamburger','menu','x','morph','css','toggle','barras'],
  desc:'Las tres barras del menú se transforman en una X al abrir. El morph de hamburguesa imprescindible.',
  meta:['transform','rotate','0 JS'],
  prompt:`Crea el morph de icono hamburguesa a X en CSS: tres barras donde, al activar, la del medio se desvanece (opacity/scaleX 0) y las otras dos rotan ±45° y se trasladan al centro formando una X.
Un checkbox oculto o una clase controla el estado; anima transform (rotate + translateY) y opacity con transición suave. transform-origin centrado.
El botón de menú móvil por excelencia, accesible y sin librerías.`,
  code:`/* Hamburger -> X (CSS) */
.bar { width: 28px; height: 3px; background: #fff; transition: .3s; }
.open .bar:nth-child(1) { transform: translateY(8px) rotate(45deg); }
.open .bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
.open .bar:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes hb1{0%,40%{transform:translateY(0) rotate(0)}60%,100%{transform:translateY(8px) rotate(45deg)}}@keyframes hb2{0%,40%{opacity:1;transform:scaleX(1)}60%,100%{opacity:0;transform:scaleX(0)}}@keyframes hb3{0%,40%{transform:translateY(0) rotate(0)}60%,100%{transform:translateY(-8px) rotate(-45deg)}}.hbar{width:30px;height:3px;background:#eef0f7;border-radius:2px;margin:5px 0}</style><div style="cursor:pointer"><div class="hbar" style="animation:hb1 3s ease-in-out infinite"></div><div class="hbar" style="animation:hb2 3s ease-in-out infinite"></div><div class="hbar" style="animation:hb3 3s ease-in-out infinite"></div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
