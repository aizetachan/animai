import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'nv-gooey-tabs', title:'Gooey Tabs', cat:'Navegación',
  tags:['gooey','tabs','pestañas','blob','metaball','indicator','liquid'],
  desc:'Indicador líquido que fluye y se estira entre pestañas como una gota viscosa al cambiar de tab.',
  meta:['svg filter gooey','canvas metaballs','indicator'],
  prompt:`Crea unas "Gooey Tabs": una barra de pestañas donde el indicador activo se desplaza entre tabs con un efecto líquido/viscoso (gooey), estirándose y reconectándose como mercurio al pasar de una pestaña a otra.
Técnica en DOM: usa un filtro SVG gooey (feGaussianBlur stdDeviation ~8 seguido de feColorMatrix con alpha contrast alto) aplicado a un contenedor con dos blobs: un indicador base bajo el tab destino y una "gota" que viaja; al solaparse el blur+contrast los funde en una sola forma. Anima la posición del indicador con transition spring.
Alternativa en canvas (preview): dibuja metaballs — varios círculos cuyo campo escalar combinado se umbraliza para producir bordes que se funden; mueve el centro del blob entre las posiciones de los tabs con easing y deja una cola que se reconecta.
Datos: 4 tabs equiespaciados; el activo cambia en bucle. Acento #7b5cff sobre fondo oscuro. Timings: viaje ~520ms ease-in-out.`,
  code:`<div class="tabs">
  <svg width="0" height="0"><filter id="goo">
    <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b"/>
    <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"/>
  </filter></svg>
  <div class="goo-layer" style="filter:url(#goo)">
    <span class="blob"></span>
  </div>
  <button>Inicio</button><button>Buscar</button><button>Perfil</button><button>Más</button>
</div>
<style>
.tabs{position:relative;display:flex;gap:4px}
.goo-layer{position:absolute;inset:0}
.blob{position:absolute;top:6px;height:32px;width:64px;border-radius:16px;background:#7b5cff;
  transition:left .52s cubic-bezier(.65,0,.35,1),width .52s cubic-bezier(.65,0,.35,1)}
.tabs button{position:relative;z-index:1;width:64px;height:44px;border:0;background:none;color:#fff}
</style>
<script>
const blob=document.querySelector('.blob');
let i=0;const w=68;
setInterval(()=>{ i=(i+1)%4; blob.style.left=(i*w+2)+'px'; },1400);
</script>`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const labels=['Inicio','Buscar','Perfil','Más'];
    const N=4;let raf,run=true,t=0;
    let cur=0,from=0,to=0,start=0,moving=false;
    const dwell=1.0, travel=0.55;
    function ease(p){return p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;}
    (function loop(){if(!run)return;t+=1/60;
      const W=o.W(),H=o.H();
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const pad=16, gap=(W-pad*2)/N, cy=H*0.5, r=15;
      const centers=[];for(let i=0;i<N;i++)centers.push(pad+gap*i+gap/2);
      // schedule movement
      if(!moving && t-start>dwell){moving=true;start=t;from=cur;to=(cur+1)%N;}
      let pos=centers[cur];
      if(moving){const p=Math.min(1,(t-start)/travel);const e=ease(p);
        pos=centers[from]+(centers[to]-centers[from])*e;
        if(p>=1){moving=false;cur=to;start=t;}}
      // metaball field: a fixed bump at each tab-center is dim; the active blob is bright and stretches
      // build by stamping radial gradients and thresholding via composite glow
      // 1) draw soft track dots
      for(let i=0;i<N;i++){x.beginPath();x.arc(centers[i],cy,4,0,6.28);x.fillStyle='#2a2a3c';x.fill();}
      // 2) gooey indicator using metaball threshold
      const img=x.createImageData(W,H);const d=img.data;
      // two charges: the moving blob + the snapping target, producing stretch
      const charges=[{x:pos,y:cy,q:r*r}];
      if(moving){const p=Math.min(1,(t-start)/travel);
        // trailing charge near origin fades, leading charge near target grows -> looks like it reconnects
        charges.push({x:centers[from],y:cy,q:r*r*(1-p)*0.7});
        charges.push({x:centers[to],y:cy,q:r*r*p*0.7});}
      // sample on a coarse grid for speed
      const step=2;
      for(let py=0;py<H;py+=step){for(let px=0;px<W;px+=step){
        let f=0;for(let c=0;c<charges.length;c++){const ch=charges[c];const dx=px-ch.x,dy=py-ch.y;f+=ch.q/(dx*dx+dy*dy+1);}
        if(f>0.9){for(let oy=0;oy<step;oy++)for(let ox=0;ox<step;ox++){const idx=((py+oy)*W+(px+ox))*4;d[idx]=123;d[idx+1]=92;d[idx+2]=255;d[idx+3]=255;}}
      }}
      x.putImageData(img,0,0);
      // labels on top
      x.font='600 11px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';
      for(let i=0;i<N;i++){const active=Math.abs(pos-centers[i])<gap*0.5;
        x.fillStyle=active?'#ffffff':'#6a6a80';x.fillText(labels[i],centers[i],cy);}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
