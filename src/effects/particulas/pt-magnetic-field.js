import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pt-magnetic-field', title:'Magnetic Field', cat:'Partículas',
  tags:['magnetic','campo','field','dipole','dipolo','partículas','físico','líneas'],
  desc:'Partículas trazan las líneas de campo de dos polos magnéticos (dipolo), curvándose entre cargas opuestas.',
  meta:['Canvas 2D','partículas','físico'],
  prompt:`Dibuja líneas de campo magnético de un dipolo (dos cargas, +q y -q) con partículas que las recorren.
Coloca varias cargas con posición y signo. El campo en un punto es la suma vectorial de las contribuciones de cada carga: para cada carga, vector dirección desde la carga al punto (o al revés según signo) con magnitud q/r^2.
Cada partícula avanza en la dirección normalizada del campo (integración tipo Euler), dejando estela; se reinicia al acercarse a una carga negativa, salir del lienzo o agotar su vida. Anima los polos moviéndolos suavemente.
Colorea según el signo dominante: violeta (#7b5cff) hacia el polo +, turquesa (#00e0c6) hacia el -.`,
  code:`// Campo magnético dipolar — partículas siguen el campo vectorial
const charges=[{x:90,y:100,q:+1},{x:180,y:100,q:-1}];

function field(px,py){
  let fx=0,fy=0;
  for(const c of charges){
    const dx=px-c.x, dy=py-c.y;
    const r2=dx*dx+dy*dy+25;            // +25 evita singularidad
    const inv=c.q/(r2*Math.sqrt(r2));   // q/r^2, normalizado por r
    fx+=dx*inv; fy+=dy*inv;
  }
  return [fx,fy];
}

parts.forEach(p=>{
  const [fx,fy]=field(p.x,p.y);
  const m=Math.hypot(fx,fy)||1;
  p.x+=fx/m*1.5; p.y+=fy/m*1.5;         // avanza por la línea de campo
  ctx.lineTo(p.x,p.y);
});`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let raf,run=true,t=0;
    const charges=[{x:0,y:0,q:1},{x:0,y:0,q:-1}];
    const P=[];
    function reset(p){p.x=Math.random()*o.W();p.y=Math.random()*o.H();p.px=p.x;p.py=p.y;p.life=40+Math.random()*70;}
    for(let i=0;i<150;i++){const p={};reset(p);P.push(p);}
    function field(px,py){let fx=0,fy=0;for(const c of charges){const dx=px-c.x,dy=py-c.y;const r2=dx*dx+dy*dy+25;const inv=c.q/(r2*Math.sqrt(r2));fx+=dx*inv;fy+=dy*inv;}return [fx,fy];}
    x.fillStyle='#070710';x.fillRect(0,0,o.W(),o.H());
    (function loop(){if(!run)return;t+=.012;
      const W=o.W(),H=o.H();
      charges[0].x=W*.32+Math.sin(t)*W*.08;charges[0].y=H*.5+Math.cos(t*.8)*H*.18;
      charges[1].x=W*.68+Math.sin(t*1.1+2)*W*.08;charges[1].y=H*.5+Math.cos(t)*H*.18;
      x.fillStyle='rgba(7,7,16,.10)';x.fillRect(0,0,W,H);
      x.globalCompositeOperation='lighter';x.lineWidth=1;
      for(const p of P){p.px=p.x;p.py=p.y;const f=field(p.x,p.y);const m=Math.hypot(f[0],f[1])||1;p.x+=f[0]/m*1.6;p.y+=f[1]/m*1.6;p.life--;
        let near=false;for(const c of charges){if(c.q<0){const d=Math.hypot(p.x-c.x,p.y-c.y);if(d<8)near=true;}}
        if(p.life<0||near||p.x<0||p.x>W||p.y<0||p.y>H){reset(p);continue;}
        const dPos=Math.hypot(p.x-charges[0].x,p.y-charges[0].y);const dNeg=Math.hypot(p.x-charges[1].x,p.y-charges[1].y);
        const col=dPos<dNeg?'123,92,255':'0,224,198';
        x.strokeStyle='rgba('+col+',.55)';x.beginPath();x.moveTo(p.px,p.py);x.lineTo(p.x,p.y);x.stroke();}
      x.globalCompositeOperation='source-over';
      for(const c of charges){x.fillStyle=c.q>0?'#7b5cff':'#00e0c6';x.beginPath();x.arc(c.x,c.y,4,0,6.283);x.fill();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
