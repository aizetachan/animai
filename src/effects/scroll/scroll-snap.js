import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'scroll-snap', title:'Section Snap', cat:'Scroll',
  tags:['snap','scroll-snap','secciones','fullscreen','observer','css'],
  desc:'Las secciones se "enganchan" a pantalla completa al scrollear. Scroll-snap nativo de CSS.',
  meta:['scroll-snap','CSS','Fullscreen'],
  prompt:`Crea secciones fullscreen que hacen snap al scrollear, con CSS nativo.
Contenedor con scroll-snap-type:y mandatory y overflow-y:scroll; cada sección con height:100vh y scroll-snap-align:start.
Da la sensación de "una pantalla por sección" sin JS. Para landings tipo presentación. (El Observer de GSAP hace lo mismo con más control.)`,
  code:`/* Scroll snap nativo */
.container {
  height: 100vh; overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}
.section {
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const cols=['#7b5cff','#00e0c6','#ff5ca8','#3a2a7a'];let cur=0,target=0,idx=0,raf,run=true,timer=0;
    (function loop(){if(!run)return;timer++;if(timer%80===0){idx=(idx+1)%cols.length;target=idx;}cur+=(target-cur)*.12;
      x.clearRect(0,0,o.W(),o.H());for(let i=0;i<cols.length;i++){const yy=(i-cur)*o.H();x.fillStyle=cols[i];x.fillRect(0,yy,o.W(),o.H());x.fillStyle='rgba(255,255,255,.9)';x.font='800 22px Inter,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('Sección '+(i+1),o.W()/2,yy+o.H()/2);}
      // indicador
      for(let i=0;i<cols.length;i++){x.fillStyle=Math.round(cur)===i?'#fff':'rgba(255,255,255,.4)';x.beginPath();x.arc(o.W()-16,o.H()/2-20+i*14,Math.round(cur)===i?4:2.5,0,6.28);x.fill();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
