import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'nav-radial-menu', title:'Radial Menu', cat:'Navegación',
  tags:['radial','menu','arco','fab','desplegar','círculo','botones'],
  desc:'Botones que se despliegan en arco desde un botón central. Menú radial limpio (sin efecto líquido).',
  meta:['translate polar','arc','FAB'],
  prompt:`Crea un menú radial: un botón central que, al activarse, despliega varios sub-botones en arco/círculo a su alrededor con un stagger, cada uno saliendo a su posición polar.
Calcula la posición de cada sub-botón con ángulo y radio (translate polar); anímalos desde el centro con delay creciente. El botón central rota (+/- 45°) al abrir.
Para acciones rápidas, FABs creativos o controles de juego.`,
  code:`// Radial menu — sub-botones en posiciones polares
subButtons.forEach((b, i) => {
  const angle = startAngle + (i / (n-1)) * spread
  const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius
  b.style.transform = open ? \`translate(\${x}px,\${y}px)\` : 'translate(0,0)'
  b.style.transitionDelay = i * 0.05 + 's'
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const N=5;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.012;const cyc=t%2.4;const open=cyc<1.8;const prog=open?Math.min(1,cyc/.5):Math.max(0,1-(cyc-1.8)/.4);
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2,R=Math.min(o.W(),o.H())*.32;
      for(let i=0;i<N;i++){const local=Math.max(0,Math.min(1,(prog-i*.1)/.5));const a=-Math.PI/2-Math.PI*.6+i/(N-1)*Math.PI*1.2;const px=cx+Math.cos(a)*R*local,py=cy+Math.sin(a)*R*local;x.fillStyle='hsl('+(250+i*20)+',60%,60%)';x.globalAlpha=local;x.beginPath();x.arc(px,py,11,0,6.28);x.fill();}x.globalAlpha=1;
      x.fillStyle='#7b5cff';x.beginPath();x.arc(cx,cy,17,0,6.28);x.fill();x.strokeStyle='#fff';x.lineWidth=2.5;x.lineCap='round';x.save();x.translate(cx,cy);x.rotate(prog*.785);x.beginPath();x.moveTo(-6,0);x.lineTo(6,0);x.moveTo(0,-6);x.lineTo(0,6);x.stroke();x.restore();
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
