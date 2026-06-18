import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'ui-meteors', title:'Meteors', cat:'UI Components',
  tags:['meteors','meteoritos','beams','fondo','aceternity','estrellas'],
  desc:'Lluvia de meteoritos con estela cruzando el fondo. El clásico de Aceternity UI para heros oscuros.',
  meta:['Aceternity UI','Framer Motion','Fondo'],
  prompt:`Recrea el efecto Meteors de Aceternity UI: meteoritos diagonales con estela cruzando un contenedor.
Cada meteoro es un punto con un pseudo-elemento ::before que es una línea-estela; se animan con translateX/Y negativo + fade, posiciones y delays aleatorios.
Sobre fondo oscuro. Lo usan landings de IA/SaaS como fondo de hero.`,
  code:`// Aceternity UI — Meteors (React + Framer Motion + Tailwind)
export const Meteors = ({ number = 20 }) => (
  <>
    {[...Array(number)].map((_, i) => (
      <span key={i}
        className="absolute h-0.5 w-0.5 rounded-full bg-violet-400
          rotate-[215deg] animate-meteor"
        style={{
          top: 0,
          left: Math.floor(Math.random() * 100) + '%',
          animationDelay: Math.random() * 0.6 + 's',
          animationDuration: Math.floor(Math.random() * 8 + 2) + 's',
        }} />
    ))}
  </>
)
/* @keyframes meteor { to { transform: rotate(215deg) translateX(-500px); opacity: 0 } } */`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const M=[];function spawn(){M.push({x:o.W()*Math.random(),y:-20,v:2+Math.random()*3,len:30+Math.random()*40,life:1});}
    let raf,run=true,c=0;
    (function loop(){if(!run)return;c++;if(c%14===0)spawn();x.fillStyle='rgba(7,7,13,.3)';x.fillRect(0,0,o.W(),o.H());
      for(let i=M.length-1;i>=0;i--){const m=M[i];m.x-=m.v*.6;m.y+=m.v;m.life-=.006;if(m.life<=0||m.y>o.H()+30){M.splice(i,1);continue;}
        const g=x.createLinearGradient(m.x,m.y,m.x+m.len*.6,m.y-m.len);g.addColorStop(0,'rgba(157,134,255,'+m.life+')');g.addColorStop(1,'rgba(157,134,255,0)');x.strokeStyle=g;x.lineWidth=1.5;x.beginPath();x.moveTo(m.x,m.y);x.lineTo(m.x+m.len*.6,m.y-m.len);x.stroke();
        x.fillStyle='rgba(200,190,255,'+m.life+')';x.beginPath();x.arc(m.x,m.y,1.5,0,6.28);x.fill();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
