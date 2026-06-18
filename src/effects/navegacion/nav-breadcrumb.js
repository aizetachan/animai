import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'nav-breadcrumb', title:'Breadcrumb Slide', cat:'Navegación',
  tags:['breadcrumb','migas','navegación','slide','ruta','separador'],
  desc:'Migas de pan que entran deslizando con separadores que se dibujan. Ruta de navegación animada.',
  meta:['stagger','slide','Ruta'],
  prompt:`Crea unas migas de pan (breadcrumb) animadas: cada nivel de la ruta entra deslizando desde la izquierda con un pequeño retardo escalonado, y los separadores (›) aparecen entre ellos.
Cada crumb tiene translateX + opacity con delay por índice; el último (actual) se resalta. Bonus: al cambiar de ruta, transición suave.
Para apps con jerarquía y navegación profunda.`,
  code:`/* Breadcrumb slide-in escalonado */
.crumb { opacity: 0; transform: translateX(-10px); animation: slideIn .4s forwards; }
.crumb:nth-child(1){animation-delay:.0s} .crumb:nth-child(2){animation-delay:.1s} /* ... */
@keyframes slideIn { to { opacity: 1; transform: translateX(0); } }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const crumbs=['Inicio','Proyectos','Web','Detalle'];let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;if(hold>0)hold--;else{t+=1;if(t>90){t=0;hold=40;}}x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      x.font='600 13px Inter';x.textBaseline='middle';let cx=18;crumbs.forEach((c,i)=>{const local=Math.max(0,Math.min(1,(t-i*10)/14));x.globalAlpha=local;const isLast=i===crumbs.length-1;x.fillStyle=isLast?'#7b5cff':'#8a8ca3';const tx=cx-(1-local)*10;x.fillText(c,tx,o.H()/2);const w=x.measureText(c).width;if(!isLast){x.fillStyle='#3a3a4e';x.globalAlpha=local;x.fillText('›',tx+w+8,o.H()/2);}cx+=w+24;});x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
