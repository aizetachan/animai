import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'d3-parallax-layers', title:'Mouse Parallax Layers', cat:'3D / R3F',
  tags:['parallax','mouse','capas','profundidad','3d','tilt','seguir'],
  desc:'Capas que se mueven a distinta profundidad siguiendo el ratón, creando un 3D falso. Parallax de cursor.',
  meta:['mouse','depth','Parallax'],
  prompt:`Crea un parallax 3D que sigue al ratón: varias capas (fondo, medio, frente) que se desplazan en sentido contrario al cursor a distinta velocidad según su "profundidad", dando ilusión de 3D.
Mapea la posición del cursor (centrada) a un translate por capa, multiplicado por un factor de profundidad (las del frente se mueven más). Suaviza con lerp.
Para heros con escena en capas, cards con profundidad, ilustraciones interactivas.`,
  code:`// Mouse parallax layers
layers.forEach(layer => {
  const depth = layer.dataset.depth      // 0 (fondo) .. 1 (frente)
  const x = (mouseX - cx) * depth * 0.04
  const y = (mouseY - cy) * depth * 0.04
  layer.style.transform = \`translate(\${x}px, \${y}px)\`
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const layers=[{d:.2,c:'#1a1330',n:5,r:30},{d:.5,c:'#3a2a7a',n:4,r:22},{d:1,c:'#7b5cff',n:3,r:16}];
    layers.forEach(L=>{L.items=[];for(let i=0;i<L.n;i++)L.items.push({x:Math.random(),y:Math.random()});});
    let mx=0,my=0,tx=0,ty=0,a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();mx=(e.clientX-b.left-b.width/2);my=(e.clientY-b.top-b.height/2);};el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;a+=.02;if(!hover){mx=Math.cos(a)*o.W()*.3;my=Math.sin(a*1.3)*o.H()*.3;}tx+=(mx-tx)*.06;ty+=(my-ty)*.06;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());layers.forEach(L=>{const ox=-tx*L.d*.06,oy=-ty*L.d*.06;L.items.forEach(it=>{x.fillStyle=L.c;x.beginPath();x.arc(it.x*o.W()+ox,it.y*o.H()+oy,L.r,0,6.28);x.fill();});});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
