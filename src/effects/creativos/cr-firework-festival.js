import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cr-firework-festival', title:'Festival Fireworks', cat:'Creativos',
  tags:['fuegos','fireworks','烟花','año nuevo','festival','celebración','flor'],
  desc:'Fuegos artificiales de Año Nuevo (烟花): cohetes que suben y estallan en flores de chispas.',
  meta:['canvas','año nuevo','auto-demo'],
  prompt:`Crea fuegos artificiales de festival (烟花) de Año Nuevo en canvas 2D con dos fases.
Estructura de datos: un array de cohetes {x,y,vy,targetY,hue} y un array de chispas {x,y,vx,vy,hue,life,trail}.
Algoritmo: lanza cohetes periódicamente desde la base con velocidad ascendente y estela; al frenar (vy>=0) o alcanzar targetY, explota: genera N chispas en patrón de "flor" (anillo doble radial con velocidades 2 niveles) más algunas chispas de purpurina dorada.
Físca de chispas: gravedad (vy+=g), arrastre (v*=0.985), life decae; dibuja con estela usando un trail de posiciones y composite 'lighter'. Fondo oscuro con fade alfa para rastros. Colores cálidos festivos (rojo, dorado, magenta).
Timing: nuevo cohete cada ~22-40 frames; explosión ~60-80 chispas.`,
  code:`// Festival fireworks (烟花) — cohete + explosión en flor
function explode(x, y, hue) {
  const rings = [0.6, 1]                       // doble anillo => flor
  rings.forEach((r, k) => {
    const n = 30
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      const sp = (1.4 + Math.random() * 1.4) * (k ? 1 : 0.6)
      sparks.push({ x, y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp, hue, life: 1, trail: [] })
    }
  })
}
// loop: rocket.vy += 0.06; si vy>=0 -> explode. spark: vy+=0.05; v*=0.985; life-=0.012`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const R=[],S=[];const palettes=[0,18,45,300,330,210];
    function launch(){const w=o.W(),h=o.H();R.push({x:w*(.2+Math.random()*.6),y:h,vy:-(3.4+Math.random()*1.4),targetY:h*(.18+Math.random()*.28),hue:palettes[(Math.random()*palettes.length)|0]});}
    function explode(px,py,hue){
      [0.6,1].forEach((mul,k)=>{const n=30;for(let i=0;i<n;i++){const a=(i/n)*6.283+ (k?0:.1);const sp=(1.3+Math.random()*1.3)*(k?1:.6);S.push({x:px,y:py,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,hue:hue+(Math.random()*24-12),life:1,trail:[],gold:false});}});
      for(let i=0;i<14;i++){const a=Math.random()*6.283,sp=Math.random()*2.4;S.push({x:px,y:py,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,hue:45,life:1,trail:[],gold:true});}
    }
    let raf,run=true,c=0,next=10;
    (function loop(){if(!run)return;c++;const w=o.W(),h=o.H();
      if(c>=next){launch();next=c+22+(Math.random()*18|0);}
      x.fillStyle='rgba(8,6,16,.25)';x.fillRect(0,0,w,h);
      x.globalCompositeOperation='lighter';
      for(let i=R.length-1;i>=0;i--){const r=R[i];r.y+=r.vy;r.vy+=.06;
        x.fillStyle='hsl('+r.hue+',90%,72%)';x.beginPath();x.arc(r.x,r.y,2,0,6.28);x.fill();
        // estela
        x.fillStyle='hsla('+r.hue+',90%,80%,.4)';x.beginPath();x.arc(r.x,r.y+4,1.3,0,6.28);x.fill();
        if(r.vy>=-.2||r.y<=r.targetY){explode(r.x,r.y,r.hue);R.splice(i,1);}
      }
      for(let i=S.length-1;i>=0;i--){const s=S[i];
        s.trail.push([s.x,s.y]);if(s.trail.length>5)s.trail.shift();
        s.vy+=.05;s.vx*=.985;s.vy*=.985;s.x+=s.vx;s.y+=s.vy;s.life-=.012;
        if(s.life<=0){S.splice(i,1);continue;}
        const col=s.gold?'hsla(45,95%,'+(60+s.life*15)+'%,':'hsla('+s.hue+',95%,65%,';
        // estela
        for(let t=0;t<s.trail.length;t++){const tp=s.trail[t],al=s.life*(t/s.trail.length)*.5;x.fillStyle=col+al+')';x.beginPath();x.arc(tp[0],tp[1],1.4*s.life,0,6.28);x.fill();}
        x.fillStyle=col+s.life+')';x.beginPath();x.arc(s.x,s.y,(s.gold?1.6:2)*s.life,0,6.28);x.fill();
      }
      x.globalCompositeOperation='source-over';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
