import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-image-particles', title:'Image Dispersion', cat:'3D / R3F',
  tags:['imagen','partículas','dispersión','desintegrar','recomponer','pixels'],
  desc:'Una imagen se desintegra en partículas y se vuelve a recomponer. Dispersión reversible.',
  meta:['Points','pixel sampling','Morph'],
  prompt:`Crea el efecto de imagen que se desintegra en partículas y se recompone.
Muestrea los píxeles de una imagen en una rejilla; cada partícula tiene su posición "ordenada" (su píxel) y una posición "dispersa" (aleatoria/explosión). Interpola entre ambas según un estado (en reposo = imagen, activo = nube). El color de cada partícula es el del píxel.
Para reveals de producto/retrato dramáticos.`,
  code:`// Image dispersion — cada partícula = un píxel muestreado
// home = posición del píxel en la imagen; scatter = posición caótica
particles.forEach(p => {
  const target = dispersed ? p.scatter : p.home
  p.pos.lerp(target, 0.06)
})
// color de la partícula = color del píxel (sampleado del <img> en un canvas)`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const cols=26,rows=16,P=[];
    // "imagen": un degradado/forma procedural muestreada
    function colAt(u,v){const r=Math.round(120+u*120),g=Math.round(60+v*150),b=Math.round(200-u*60);return [r,g,b];}
    for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const u=i/(cols-1),v=j/(rows-1);P.push({hx:u,hy:v,sx:Math.random(),sy:Math.random(),x:u,y:v,col:colAt(u,v)});}
    let disp=false,raf,run=true,c=0;
    (function loop(){if(!run)return;c++;if(c%110===0)disp=!disp;x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const pad=20,W=o.W()-pad*2,H=o.H()-pad*2;P.forEach(p=>{const tx=disp?p.sx:p.hx,ty=disp?p.sy:p.hy;p.x+=(tx-p.x)*.06;p.y+=(ty-p.y)*.06;x.fillStyle='rgb('+p.col[0]+','+p.col[1]+','+p.col[2]+')';x.fillRect(pad+p.x*W,pad+p.y*H,4,4);});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
