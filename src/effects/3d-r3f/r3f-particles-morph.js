import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-particles-morph', title:'Particles Morph', cat:'3D / R3F',
  tags:['partículas','morph','puntos','formas','transición','nube','points'],
  desc:'Una nube de puntos transiciona suavemente entre formas: esfera, cubo, onda.',
  meta:['Points','lerp','Morph'],
  prompt:`Crea una nube de puntos (Points) que transiciona entre varias formas geométricas (esfera, cubo, plano de onda, texto).
Pregenera las posiciones objetivo de cada forma con el MISMO número de puntos; en cada frame interpola (lerp) la posición actual de cada punto hacia la forma destino. Cambia el destino por intervalo.
Espectacular para heros de marca tech/IA. Con drei + buffer attributes.`,
  code:`// Particles morph — lerp entre conjuntos de posiciones objetivo
useFrame(() => {
  for (let i = 0; i < count; i++) {
    pos[i*3]   += (target[i*3]   - pos[i*3])   * 0.05
    pos[i*3+1] += (target[i*3+1] - pos[i*3+1]) * 0.05
    pos[i*3+2] += (target[i*3+2] - pos[i*3+2]) * 0.05
  }
  geometry.attributes.position.needsUpdate = true
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const N=180;const pts=[];for(let i=0;i<N;i++)pts.push({x:0,y:0,z:0,tx:0,ty:0,tz:0});
    function sphere(){pts.forEach((p,i)=>{const ph=Math.acos(1-2*(i+.5)/N),th=Math.PI*(1+Math.sqrt(5))*i;p.tx=Math.sin(ph)*Math.cos(th);p.ty=Math.sin(ph)*Math.sin(th);p.tz=Math.cos(ph);});}
    function cube(){pts.forEach((p)=>{p.tx=(Math.random()*2-1);p.ty=(Math.random()*2-1);p.tz=(Math.random()*2-1);});}
    function wave(){pts.forEach((p,i)=>{const gx=(i%14)/14*2-1,gz=Math.floor(i/14)/13*2-1;p.tx=gx;p.tz=gz;p.ty=Math.sin(gx*3)*.4;});}
    const shapes=[sphere,cube,wave];let si=0;shapes[0]();pts.forEach(p=>{p.x=p.tx;p.y=p.ty;p.z=p.tz;});
    let rot=0,raf,run=true,c=0;
    (function loop(){if(!run)return;c++;if(c%120===0){si=(si+1)%shapes.length;shapes[si]();}rot+=.01;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2,sc=Math.min(o.W(),o.H())*.32;
      pts.forEach(p=>{p.x+=(p.tx-p.x)*.06;p.y+=(p.ty-p.y)*.06;p.z+=(p.tz-p.z)*.06;const c2=Math.cos(rot),s2=Math.sin(rot);const xx=p.x*c2-p.z*s2,zz=p.x*s2+p.z*c2;const pz=3/(3+zz);x.fillStyle='rgba('+(zz>0?'0,224,198':'123,92,255')+','+(.4+pz*.5)+')';x.beginPath();x.arc(cx+xx*sc*pz,cy+p.y*sc*pz,1.6*pz,0,6.28);x.fill();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
