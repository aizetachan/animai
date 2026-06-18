import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-bump-chart', title:'Bump Chart', cat:'Datos / Charts',
  tags:['bump','ranking','rank','líneas','lines','tiempo','evolución'],
  desc:'Gráfico de ranking en el que cada serie es una línea que sube y baja de posición cruzándose en el tiempo.',
  meta:['canvas','rank lines','Viz'],
  prompt:`Crea un bump chart (gráfico de ranking) en canvas 2D.
Estructura de datos: un array de series; cada serie es un array de rangos (1 = mejor) por periodo, p.ej. {name, color, ranks:[3,1,1,2,...]}.
Layout: el eje X reparte los periodos uniformemente (x = pad + i/(N-1)*ancho); el eje Y mapea el rango a una fila (y = pad + (rank-1)/(R-1)*alto). Une los puntos de cada serie con una línea suave (curva de Catmull-Rom o tensión) y dibuja un nodo circular en cada periodo.
Animación: dibuja las líneas progresivamente con un parámetro t de 0 a 1 que avanza periodo a periodo (interpola el último tramo). Cuando completa, mantén unos frames y reinicia en bucle. Resalta el líder (rank 1).
Para mostrar evolución de posiciones (equipos, productos, países) a lo largo del tiempo.`,
  code:`// Bump chart (ranking) — concepto en Canvas 2D / D3
const series = [
  { name:'A', color:'#7b5cff', ranks:[3,1,1,2,1] },
  { name:'B', color:'#00e0c6', ranks:[1,2,3,1,2] },
]
const x = i => pad + i/(periods-1) * innerW
const y = r => pad + (r-1)/(maxRank-1) * innerH
// por cada serie: moveTo(x(0),y(ranks[0])) y lineTo a lo largo de los periodos
// anima dibujando hasta un t creciente; nodo circular en cada periodo`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const series=[
      {name:'A',color:'#7b5cff',ranks:[4,2,1,1,2,1]},
      {name:'B',color:'#00e0c6',ranks:[1,1,2,3,1,2]},
      {name:'C',color:'#ff8acb',ranks:[2,3,3,2,3,4]},
      {name:'D',color:'#ffc861',ranks:[3,4,4,4,4,3]}
    ];
    const N=series[0].ranks.length,R=4;
    let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;
      if(hold>0){hold--;}else{t+=.018;if(t>=1.15){t=1.15;hold=45;}}
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const padX=22,padY=24,W=o.W(),H=o.H();
      const innerW=W-padX*2,innerH=H-padY*2;
      const px=i=>padX+(N<=1?0:i/(N-1)*innerW);
      const py=r=>padY+(R<=1?0:(r-1)/(R-1)*innerH);
      // gridlines por rango
      x.strokeStyle='rgba(255,255,255,.06)';x.lineWidth=1;
      for(let r=1;r<=R;r++){const yy=py(r);x.beginPath();x.moveTo(padX,yy);x.lineTo(W-padX,yy);x.stroke();}
      const prog=Math.min(t,1)*(N-1); // cuántos tramos dibujar
      series.forEach(s=>{
        x.strokeStyle=s.color;x.lineWidth=s.ranks[s.ranks.length-1]===1?3:2;x.lineJoin='round';x.lineCap='round';
        x.beginPath();x.moveTo(px(0),py(s.ranks[0]));
        for(let i=1;i<N;i++){
          if(i<=prog){x.lineTo(px(i),py(s.ranks[i]));}
          else{const seg=prog-(i-1);if(seg>0){x.lineTo(px(i-1)+(px(i)-px(i-1))*seg,py(s.ranks[i-1])+(py(s.ranks[i])-py(s.ranks[i-1]))*seg);}break;}
        }
        x.stroke();
        // nodos
        const drawn=Math.min(N-1,Math.floor(prog));
        for(let i=0;i<=drawn;i++){
          x.fillStyle='#0a0a14';x.beginPath();x.arc(px(i),py(s.ranks[i]),4.5,0,6.28);x.fill();
          x.fillStyle=s.color;x.beginPath();x.arc(px(i),py(s.ranks[i]),3,0,6.28);x.fill();
        }
      });
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
