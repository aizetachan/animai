import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'uc-warp-background', title:'Warp Background', cat:'UI Components',
  tags:['warp','grid','perspectiva','perspective','grid floor','retro','magic ui'],
  desc:'Cuadrícula en perspectiva tipo suelo infinito con celdas que destellan al ritmo.',
  meta:['Canvas 2D','perspective grid','Magic UI'],
  prompt:`Recrea un Warp Background: una cuadrícula en perspectiva (suelo infinito retro/synthwave) con celdas que destellan aleatoriamente.
Técnica: dibuja líneas horizontales cuya separación crece con la profundidad (mapeo no lineal, ej. y = horizon + height*pow(i/rows, p)) y líneas verticales que convergen hacia un punto de fuga en el horizonte (interpolación lineal del x entre el punto de fuga y los bordes según la profundidad). Anima desplazando el offset de profundidad para simular avance continuo (módulo para reciclar líneas). De vez en cuando ilumina una celda con un fill brillante que se desvanece.
Datos: punto de fuga centrado en el horizonte (~40% alto), líneas de marca violeta/cian con glow, fondo oscuro con degradado, destellos aleatorios temporizados.`,
  code:`// Warp / perspective grid floor (canvas 2D)
const horizon = H*0.4, vp = {x:W/2, y:horizon}, rows=14, cols=12;
function lineY(i){ return horizon + (H-horizon)*Math.pow(i/rows, 2.2); } // densas cerca del horizonte
function draw(t){
  // horizontales recicladas con offset de profundidad
  for(let i=1;i<=rows;i++){ const f=((i+t*0.02)%rows)/rows; const y=horizon+(H-horizon)*Math.pow(f,2.2);
    line(0,y,W,y); }
  // verticales convergiendo al punto de fuga
  for(let c=0;c<=cols;c++){ const x=c/cols*W; line(vp.x,vp.y, x, H); }
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    let t=0,raf,run=true;
    const rows=13,cols=11;
    let flashes=[];let lastFlash=0;
    (function loop(){if(!run)return;t+=1;
      const W=o.W(),H=o.H();
      const horizon=H*0.40,vpx=W/2;
      // fondo
      const g=x.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#0a0a14');g.addColorStop(0.4,'#0d0b1a');g.addColorStop(1,'#08070f');
      x.fillStyle=g;x.fillRect(0,0,W,H);
      // glow horizonte
      x.fillStyle='rgba(123,92,255,.10)';x.fillRect(0,horizon-18,W,36);
      const depth=t*0.015;
      const yAt=f=>horizon+(H-horizon)*Math.pow(f,2.4);
      const xAt=(c,f)=>{const edge=(c/cols)*W;return vpx+(edge-vpx)*Math.pow(f,1.0);};
      // destellos
      if(t-lastFlash>20){lastFlash=t;flashes.push({r:1+Math.floor(Math.random()*(rows-2)),c:Math.floor(Math.random()*cols),life:1});}
      flashes.forEach(fl=>{fl.life-=0.03;});
      flashes=flashes.filter(fl=>fl.life>0);
      flashes.forEach(fl=>{
        const f0=((fl.r+depth)%rows)/rows, f1=((fl.r+1+depth)%rows)/rows;
        if(f1<f0)return;
        const y0=yAt(f0),y1=yAt(f1);
        const xa=xAt(fl.c,f0),xb=xAt(fl.c+1,f0),xc=xAt(fl.c+1,f1),xd=xAt(fl.c,f1);
        x.beginPath();x.moveTo(xa,y0);x.lineTo(xb,y0);x.lineTo(xc,y1);x.lineTo(xd,y1);x.closePath();
        x.fillStyle='rgba(0,224,198,'+(fl.life*0.45)+')';x.fill();
      });
      // horizontales
      for(let i=1;i<=rows;i++){
        const f=((i+depth)%rows)/rows;const y=yAt(f);
        const op=0.12+f*0.55;
        x.beginPath();x.moveTo(0,y);x.lineTo(W,y);
        x.strokeStyle='rgba(123,92,255,'+op+')';x.lineWidth=0.5+f*1.2;x.stroke();
      }
      // verticales
      for(let c=0;c<=cols;c++){
        const edge=(c/cols)*W;
        x.beginPath();x.moveTo(vpx,horizon);x.lineTo(edge,H);
        x.strokeStyle='rgba(0,224,198,.18)';x.lineWidth=0.8;x.stroke();
      }
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
