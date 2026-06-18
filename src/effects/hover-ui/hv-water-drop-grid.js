import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'hv-water-drop-grid', title:'Water Drop Grid', cat:'Hover & UI',
  tags:['grid','rejilla','onda','wave','ripple','gota','water'],
  desc:'Rejilla de puntos que reacciona con una onda expansiva tipo gota de agua desde el punto pulsado.',
  meta:['Canvas 2D','wave','ripple'],
  prompt:`Crea una rejilla regular de puntos donde, al pulsar (o automáticamente), nace una onda circular tipo gota de agua desde ese punto.
Para cada punto calcula su distancia al origen de la gota. La onda es un anillo cuyo radio crece con el tiempo (radio = velocidad * edad). Un punto se desplaza/ilumina cuando el frente de onda lo cruza: usa un pulso gaussiano centrado en |distancia - radio| (gauss = exp(-((d-radio)^2)/ancho)). Aplica ese pulso a un desplazamiento vertical (o escala/brillo) del punto.
La amplitud decae con la edad de la onda. Permite varias gotas simultáneas sumando sus pulsos.
Timings: onda viaja ~140px/s, vida ~1.6s, nueva gota cada ~1.4s en posiciones aleatorias.`,
  code:`// Water drop grid — onda expansiva sobre rejilla de puntos
drops.forEach(drop => {
  const age = time - drop.t
  const radius = age * 140          // frente de onda
  pts.forEach(p => {
    const d = Math.hypot(p.x - drop.x, p.y - drop.y)
    const g = Math.exp(-((d - radius)**2) / 600)  // pulso en el anillo
    const decay = Math.max(0, 1 - age / 1.6)
    p.lift += g * decay * 10        // desplazamiento + brillo
  })
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const gap=20,pts=[];
    function grid(){pts.length=0;for(let yy=gap;yy<o.H();yy+=gap)for(let xx=gap;xx<o.W();xx+=gap)pts.push({x:xx,y:yy});}
    grid();
    let drops=[],raf,run=true,last=performance.now(),acc=0;
    function spawn(){drops.push({x:gap+Math.random()*(o.W()-2*gap),y:gap+Math.random()*(o.H()-2*gap),t:performance.now()/1000});}
    spawn();
    (function loop(){if(!run)return;const now=performance.now();const dt=(now-last)/1000;last=now;acc+=dt;if(acc>1.4){acc=0;spawn();}
      const tm=now/1000;drops=drops.filter(d=>tm-d.t<1.7);
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      pts.forEach(p=>{let lift=0,glow=0;
        drops.forEach(d=>{const age=tm-d.t;const radius=age*140;const dist=Math.hypot(p.x-d.x,p.y-d.y);const g=Math.exp(-((dist-radius)*(dist-radius))/600);const decay=Math.max(0,1-age/1.7);lift+=g*decay*9;glow+=g*decay;});
        const a=.18+Math.min(1,glow);const sz=1.6+Math.min(3.5,glow*3.5);
        x.fillStyle=glow>.35?'rgba(0,224,198,'+a+')':'rgba(123,92,255,'+a+')';
        x.beginPath();x.arc(p.x,p.y-lift,sz,0,6.283);x.fill();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
