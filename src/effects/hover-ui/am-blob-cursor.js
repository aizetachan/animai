import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-blob-cursor', title:'Blob Cursor Follow', cat:'Hover & UI',
  tags:['blob','cursor','partículas','anime.js','seguir','gooey','orgánico'],
  desc:'Un grupo de puntos gooey que se agrupan y siguen al cursor como una entidad líquida viva.',
  meta:['gooey','follow','Orgánico'],
  prompt:`Crea un "blob cursor": un grupo de varios puntos que se agrupan formando una entidad gooey (con filtro goo) y siguen al cursor con distintos retardos (lag), de modo que se estiran y reagrupan orgánicamente al moverse.
Cada punto persigue al cursor con un lerp distinto; el filtro SVG goo los fusiona en una mancha líquida. Al moverse rápido, la mancha se estira; al parar, se reagrupa.
Cursor decorativo orgánico para webs creativas.`,
  code:`// Blob cursor — varios puntos con lag distinto + filtro goo
dots.forEach((d, i) => {
  const lag = 0.2 - i * 0.02
  d.x += (mouseX - d.x) * lag
  d.y += (mouseY - d.y) * lag
})
// contenedor con filter: url(#goo) -> se fusionan en blob líquido`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const D=[];for(let i=0;i<6;i++)D.push({x:o.W()/2,y:o.H()/2,r:16-i*1.5});
    let mx=o.W()/2,my=o.H()/2,a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top;};el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;a+=.04;if(!hover){mx=o.W()*(.5+Math.cos(a)*.35);my=o.H()*(.5+Math.sin(a*1.6)*.35);}x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      D.forEach((d,i)=>{const lag=.25-i*.03;d.x+=(mx-d.x)*lag;d.y+=(my-d.y)*lag;});
      // gooey fake: dibujar con blur + threshold simulando con círculos solapados
      x.save();x.globalCompositeOperation='lighter';D.forEach((d,i)=>{const g=x.createRadialGradient(d.x,d.y,0,d.x,d.y,d.r*2);g.addColorStop(0,'rgba(123,92,255,.9)');g.addColorStop(1,'rgba(123,92,255,0)');x.fillStyle=g;x.beginPath();x.arc(d.x,d.y,d.r*2,0,6.28);x.fill();});x.restore();
      D.forEach(d=>{x.fillStyle='#9d86ff';x.beginPath();x.arc(d.x,d.y,d.r*.7,0,6.28);x.fill();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
