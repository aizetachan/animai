import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-shape-loop', title:'Morphing Loader', cat:'SVG',
  tags:['loader','morph','spinner','anime.js','formas','rotar','preloader'],
  desc:'Un loader que muta entre formas (círculo, cuadrado, triángulo) mientras rota. Preloader hipnótico.',
  meta:['shape morph','rotate','Loader'],
  prompt:`Crea un preloader que muta entre formas geométricas (círculo → cuadrado → triángulo → polígono) mientras rota en bucle, con cambios de color suaves y una sombra que sigue a la forma.
Interpola los vértices entre polígonos de distinto nº de lados (normalizados al mismo recuento de puntos) y rota el conjunto. Cambia el color por forma.
Preloader/spinner con personalidad para pantallas de carga.`,
  code:`// Morphing loader — interpola entre N-gonos mientras rota
const shapes = [circle(32), square(32), triangle(32), pentagon(32)] // mismo nº de puntos
const verts = lerpVerts(shapes[i], shapes[i+1], t)
rotateAndDraw(verts, angle)`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const n=48;
    function ngon(sides){const p=[];for(let i=0;i<n;i++){const frac=i/n*sides;const seg=Math.floor(frac),lt=frac-seg;const a0=seg/sides*6.283-1.57,a1=(seg+1)/sides*6.283-1.57;const x0=Math.cos(a0),y0=Math.sin(a0),x1=Math.cos(a1),y1=Math.sin(a1);p.push([x0+(x1-x0)*lt,y0+(y1-y0)*lt]);}return p;}
    function circle(){const p=[];for(let i=0;i<n;i++){const a=i/n*6.283;p.push([Math.cos(a),Math.sin(a)]);}return p;}
    const shapes=[circle(),ngon(4),ngon(3),ngon(5)];const cols=['#7b5cff','#00e0c6','#ff5ca8','#ffd166'];
    let idx=0,t=0,ang=0,raf,run=true;
    (function loop(){if(!run)return;t+=.018;ang+=.02;if(t>=1){t=0;idx=(idx+1)%shapes.length;}const a=shapes[idx],b=shapes[(idx+1)%shapes.length];const e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2,R=Math.min(o.W(),o.H())*.26;
      x.save();x.translate(cx,cy);x.rotate(ang);x.beginPath();a.forEach((p,i)=>{const px=(p[0]+(b[i][0]-p[0])*e)*R,py=(p[1]+(b[i][1]-p[1])*e)*R;i===0?x.moveTo(px,py):x.lineTo(px,py);});x.closePath();const c1=cols[idx],c2=cols[(idx+1)%cols.length];x.fillStyle=e<.5?c1:c2;x.shadowBlur=20;x.shadowColor=x.fillStyle;x.fill();x.restore();x.shadowBlur=0;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
