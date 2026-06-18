import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-violin', title:'Violin Plot', cat:'Datos / Charts',
  tags:['violin','density','densidad','distribución','distribution','kde','estadística'],
  desc:'Gráfico de violín que despliega la densidad de una distribución a ambos lados de un eje. Violin plot.',
  meta:['canvas','grow','Viz'],
  prompt:`Crea un violin plot animado: para cada categoría calcula una estimación de densidad (KDE) sobre un eje vertical y dibuja su silueta espejada a izquierda y derecha del eje central de esa categoría.
Estructura: un array de categorías, cada una con un array de muestras. Bineas las muestras en ~40 niveles a lo largo del eje vertical y suavizas con un kernel gaussiano para obtener el ancho (densidad) en cada nivel.
Animación: el ancho se interpola de 0 a su valor final con un easing cúbico (despliegue). Se rellena con gradiente semitransparente y borde. Marca la mediana con una línea.
Uso: comparar la forma de varias distribuciones (no solo media/cuartiles como un boxplot).`,
  code:`// Violin: densidad espejada por categoría
function kde(samples, levels){
  const d = new Array(levels).fill(0)
  for(const s of samples){            // s en [0,1]
    for(let i=0;i<levels;i++){
      const c = i/(levels-1)
      d[i] += Math.exp(-((c-s)**2)/(2*0.02)) // kernel gaussiano
    }
  }
  const max = Math.max(...d)
  return d.map(v => v/max)             // ancho normalizado 0..1
}
// dibujar silueta: izquierda con +w, derecha con -w; animar w*easing`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const L=42;
    // distribuciones de ejemplo (multimodales) -> densidades pre-binneadas
    function gen(modes){const d=new Array(L).fill(0);for(let i=0;i<L;i++){const c=i/(L-1);for(const m of modes){d[i]+=m.w*Math.exp(-((c-m.mu)**2)/(2*m.s*m.s));}}const mx=Math.max(...d);return d.map(v=>v/mx);}
    const cats=[
      {c:'#7b5cff',d:gen([{mu:.35,s:.10,w:1},{mu:.7,s:.07,w:.5}]),med:.42},
      {c:'#00e0c6',d:gen([{mu:.5,s:.16,w:1}]),med:.5},
      {c:'#ff5ca8',d:gen([{mu:.25,s:.08,w:.8},{mu:.62,s:.12,w:1}]),med:.55}
    ];
    let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;if(hold>0)hold--;else{t+=.018;if(t>=1){t=1;hold=50;}}
      const e=t<1?1-Math.pow(1-t,3):1;
      const W=o.W(),H=o.H();
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const pad=18,top=14,bot=H-18,h=bot-top;
      const cw=(W-pad*2)/cats.length, maxW=cw*0.42;
      cats.forEach((cat,ci)=>{
        const cx=pad+cw*ci+cw/2;
        // borde silueta
        x.beginPath();
        for(let i=0;i<L;i++){const py=bot-(i/(L-1))*h;x.lineTo(cx-cat.d[i]*maxW*e,py);}
        for(let i=L-1;i>=0;i--){const py=bot-(i/(L-1))*h;x.lineTo(cx+cat.d[i]*maxW*e,py);}
        x.closePath();
        const g=x.createLinearGradient(cx-maxW,0,cx+maxW,0);
        g.addColorStop(0,cat.c+'22');g.addColorStop(.5,cat.c+'aa');g.addColorStop(1,cat.c+'22');
        x.fillStyle=g;x.fill();
        x.strokeStyle=cat.c;x.lineWidth=1.4;x.stroke();
        // mediana
        const my=bot-cat.med*h, mw=cat.d[Math.round(cat.med*(L-1))]*maxW*e;
        x.strokeStyle='#ffffff';x.lineWidth=1.4;x.globalAlpha=.85;
        x.beginPath();x.moveTo(cx-mw,my);x.lineTo(cx+mw,my);x.stroke();x.globalAlpha=1;
      });
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
