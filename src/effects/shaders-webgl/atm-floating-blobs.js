import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'atm-floating-blobs', title:'Floating Blobs', cat:'Shaders WebGL',
  tags:['blobs','flotar','gradiente','orgánico','fondo','deformar','lava'],
  desc:'Blobs de color que flotan y se deforman lentamente como una lámpara de lava. Fondo orgánico vivo.',
  meta:['Canvas 2D','blob','Fondo'],
  prompt:`Crea blobs flotantes orgánicos: varias manchas de color con borde difuso que se mueven lentamente por la pantalla y deforman su contorno con seno+tiempo, como una lámpara de lava o líquido.
Cada blob es un path cerrado y suave (radios variables con tiempo) con relleno de gradiente y blur, desplazándose en trayectorias lentas. Mezcla con blend.
Fondo premium para heros, secciones de marca, ambient.`,
  code:`// Floating blobs — contorno deformado por seno + deriva lenta
function blob(cx, cy, t, r) {
  ctx.beginPath()
  for (let a = 0; a <= Math.PI*2; a += 0.3) {
    const rad = r + Math.sin(a*3 + t) * r*0.2
    ctx.lineTo(cx + Math.cos(a)*rad, cy + Math.sin(a)*rad)
  }
  ctx.fill()   // con blur/gradiente
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const B=[{c:'#7b5cff',ph:0,sp:.3},{c:'#00e0c6',ph:2,sp:.4},{c:'#ff5ca8',ph:4,sp:.25}];let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.01;x.fillStyle='#0a0816';x.fillRect(0,0,o.W(),o.H());x.globalCompositeOperation='lighter';
      B.forEach((b,k)=>{const cx=o.W()*(.5+Math.sin(t*b.sp+b.ph)*.3),cy=o.H()*(.5+Math.cos(t*b.sp*1.2+b.ph)*.3),R=Math.min(o.W(),o.H())*.22;const g=x.createRadialGradient(cx,cy,0,cx,cy,R*1.5);g.addColorStop(0,b.c);g.addColorStop(1,'transparent');x.fillStyle=g;x.beginPath();for(let a=0;a<=6.3;a+=.25){const rad=R+Math.sin(a*3+t*2+b.ph)*R*.2;x.lineTo(cx+Math.cos(a)*rad,cy+Math.sin(a)*rad);}x.closePath();x.fill();});x.globalCompositeOperation='source-over';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
