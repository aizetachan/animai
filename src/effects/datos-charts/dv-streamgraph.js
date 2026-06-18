import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-streamgraph', title:'Streamgraph', cat:'Datos / Charts',
  tags:['streamgraph','themeRiver','rio','area','flujo','apilado','wiggle'],
  desc:'Áreas fluidas apiladas alrededor de una línea central que ondulan como un río de datos.',
  meta:['canvas','flow','Viz'],
  prompt:`Crea un streamgraph (themeRiver): varias series cuyas áreas se apilan no sobre una base recta sino centradas alrededor del eje medio, produciendo formas orgánicas tipo río.
Para cada columna x, calcula la suma total y desplaza el conjunto para centrarlo (offset = -total/2). Apila cada serie sumando su grosor; dibuja cada banda con curvas suaves entre puntos (interpolación/curva). Anima un desplazamiento temporal de los valores (cada serie usa un seno con fase propia) para que el río fluya, y un crecimiento de entrada desde el centro.
Ideal para evolución de categorías en el tiempo (géneros, temas, fuentes de tráfico).`,
  code:`// Streamgraph: apilado centrado + wiggle
const N=24; // columnas
for(let i=0;i<N;i++){
  let total=0; const v=series.map(s=>{const val=s.base+Math.sin(i*0.5+s.ph+time)*s.amp; total+=val; return val;});
  let y=-total/2; // centrado
  series.forEach((s,si)=>{ topY[si][i]=y; y+=v[si]; botY[si][i]=y; });
}
// dibuja cada banda con curvas suaves (top de izq a der, bot de der a izq)`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const N=26;
    const series=[
      {c:'#7b5cff',base:0.9,amp:0.5,ph:0},
      {c:'#00e0c6',base:0.75,amp:0.45,ph:1.7},
      {c:'#ff5ca8',base:0.6,amp:0.4,ph:3.2},
      {c:'#ffb454',base:0.5,amp:0.35,ph:4.6}
    ];
    let tm=0,grow=0,raf,run=true;
    (function loop(){if(!run)return;tm+=0.018;if(grow<1)grow+=0.02;
      const W=o.W(),H=o.H();x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const pad=10,cy=H/2;const scale=(H-pad*2)/9;
      const xs=i=>pad+i/(N-1)*(W-pad*2);
      const top=series.map(()=>new Array(N)),bot=series.map(()=>new Array(N));
      for(let i=0;i<N;i++){
        const env=Math.sin(i/(N-1)*Math.PI)*0.5+0.5;
        let total=0;const v=series.map(s=>{const val=Math.max(0.05,(s.base+Math.sin(i*0.45+s.ph+tm)*s.amp))*env; total+=val; return val;});
        let y=cy-(total*scale*grow)/2;
        series.forEach((s,si)=>{top[si][i]=y;y+=v[si]*scale*grow;bot[si][i]=y;});
      }
      const curve=(pts,fwd)=>{
        if(fwd){for(let i=0;i<N;i++){const px=xs(i),py=pts[i];if(i===0)x.lineTo(px,py);else{const ppx=xs(i-1);x.bezierCurveTo((ppx+px)/2,pts[i-1],(ppx+px)/2,py,px,py);}}}
        else{for(let i=N-1;i>=0;i--){const px=xs(i),py=pts[i];if(i===N-1)x.lineTo(px,py);else{const ppx=xs(i+1);x.bezierCurveTo((ppx+px)/2,pts[i+1],(ppx+px)/2,py,px,py);}}}
      };
      series.forEach((s,si)=>{
        x.beginPath();x.moveTo(xs(0),top[si][0]);curve(top[si],true);curve(bot[si],false);x.closePath();
        const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,s.c);g.addColorStop(1,s.c+'88');
        x.fillStyle=g;x.globalAlpha=0.9;x.fill();x.globalAlpha=1;
      });
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
