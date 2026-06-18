import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'part-pixel-dissolve', title:'Pixel Dissolve', cat:'Partículas',
  tags:['dissolve','pixel','desintegrar','thanos','disolver','partículas'],
  desc:'Un elemento se deshace en píxeles que vuelan, estilo "Thanos". Disolución dramática.',
  meta:['Canvas 2D','dissolve','Reveal'],
  prompt:`Crea el efecto "pixel dissolve / disintegrate" (estilo Thanos): un bloque/imagen se deshace en píxeles que se desprenden progresivamente desde un borde y vuelan con deriva hasta desvanecerse.
Divide el área en celdas; cada celda se "suelta" en un momento según su posición (gradiente de tiempo) y luego se mueve con velocidad + viento + fade.
Para reveals dramáticos, transiciones de salida o estados de "borrado".`,
  code:`// Pixel dissolve — cada celda se desprende y vuela
cells.forEach(c => {
  if (time > c.threshold) {        // se suelta según su posición
    c.x += c.vx; c.y += c.vy - 0.5
    c.vx += wind; c.life -= 0.02
  }
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let C=[];const cs=8;
    function reset(){C=[];const W=o.W()*.6,H=o.H()*.6,ox=o.W()*.2,oy=o.H()*.2;for(let yy=0;yy<H;yy+=cs)for(let xx=0;xx<W;xx+=cs){const u=xx/W;C.push({x:ox+xx,y:oy+yy,bx:ox+xx,by:oy+yy,u,vx:0,vy:0,th:u*60+Math.random()*10,life:1,col:'hsl('+(250+u*60)+',70%,60%)'});}}
    reset();let t=0,raf,run=true;
    (function loop(){if(!run)return;t++;if(t>140){t=0;reset();}x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      C.forEach(c=>{if(t>c.th){if(c.vx===0&&c.vy===0){c.vx=1+Math.random()*2;c.vy=(Math.random()-.5)*2;}c.vx+=.05;c.x+=c.vx;c.y+=c.vy;c.life-=.018;}if(c.life>0){x.globalAlpha=c.life;x.fillStyle=c.col;x.fillRect(c.x,c.y,cs-1,cs-1);}});x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
