import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-word-cloud', title:'Word Cloud', cat:'Datos / Charts',
  tags:['word cloud','nube de palabras','词云','frecuencia','tags','viz','tipografía'],
  desc:'Nube de palabras con tamaño según frecuencia y entrada animada con fade + scale.',
  meta:['canvas','frequency','Viz'],
  prompt:`Crea una nube de palabras (word cloud) en canvas 2D.
Estructura de datos: lista de {text, weight}. El tamaño de fuente se mapea linealmente desde el peso (p.ej. 12px..40px). El color se asigna por peso interpolando entre dos tonos de marca.
Layout: algoritmo de espiral simple (spiral placement). Empieza en el centro, prueba posiciones a lo largo de una espiral arquimediana incrementando el ángulo y el radio; mide el ancho del texto con measureText y comprueba colisión con cajas ya colocadas (AABB). Coloca la palabra en el primer hueco libre.
Animación de entrada: cada palabra aparece con stagger por índice, interpolando opacidad 0->1 y escala 0.4->1 con easing easeOutBack. En bucle: tras unos segundos, reinicia el ciclo.
Para resúmenes de texto, tags populares y dashboards editoriales.`,
  code:`// Word cloud (spiral layout) — Canvas 2D
const words = [{text:'design',weight:10},{text:'motion',weight:7},/* ... */];
const placed = [];
function fits(box){ return !placed.some(p => box.x<p.x+p.w&&box.x+box.w>p.x&&box.y<p.y+p.h&&box.y+box.h>p.y); }
words.forEach(w=>{
  const fs = 12 + w.weight*3; ctx.font = fs+'px sans-serif';
  const tw = ctx.measureText(w.text).width, th = fs;
  let a=0, r=0;
  while(true){
    const x = cx + Math.cos(a)*r - tw/2, y = cy + Math.sin(a)*r;
    const box = {x, y:y-th, w:tw, h:th};
    if(fits(box)){ placed.push({...box, ...w, fs}); break; }
    a += 0.35; r += 1.2;
  }
});`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const WORDS=[
      {text:'design',weight:10},{text:'motion',weight:8},{text:'color',weight:6},
      {text:'pixel',weight:5},{text:'flow',weight:7},{text:'grid',weight:4},
      {text:'web',weight:9},{text:'css',weight:5},{text:'canvas',weight:6},
      {text:'react',weight:4},{text:'svg',weight:3},{text:'ux',weight:7},
      {text:'art',weight:5},{text:'code',weight:6},{text:'fx',weight:3}
    ];
    let placed=[],raf,run=true,t=0,phase=0;
    function lerpColor(a,b,k){return a.map((v,i)=>Math.round(v+(b[i]-v)*k));}
    const C1=[123,92,255],C2=[0,224,198];
    function layout(){
      placed=[];const cx=o.W()/2,cy=o.H()/2;
      const mx=Math.max(...WORDS.map(w=>w.weight)),mn=Math.min(...WORDS.map(w=>w.weight));
      const arr=[...WORDS].sort((a,b)=>b.weight-a.weight);
      arr.forEach(w=>{
        const k=(w.weight-mn)/(mx-mn||1);
        const fs=11+k*22;
        x.font='700 '+fs.toFixed(0)+'px sans-serif';
        const tw=x.measureText(w.text).width,th=fs;
        let a=0,r=0,box=null;
        for(let i=0;i<900;i++){
          const px=cx+Math.cos(a)*r-tw/2,py=cy+Math.sin(a)*r*.7;
          const b={x:px,y:py-th*.8,w:tw,h:th};
          const inside=b.x>2&&b.x+b.w<o.W()-2&&b.y>2&&b.y+b.h<o.H()-2;
          const hit=placed.some(p=>b.x<p.x+p.w&&b.x+b.w>p.x&&b.y<p.y+p.h&&b.y+b.h>p.y);
          if(inside&&!hit){box=b;break;}
          a+=0.35;r+=1.0;
        }
        if(box){const col=lerpColor(C2,C1,k);placed.push({...box,text:w.text,fs,col,k});}
      });
    }
    layout();const ro2=new ResizeObserver(()=>layout());ro2.observe(el);
    (function loop(){if(!run)return;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      t++;
      placed.forEach((p,i)=>{
        const local=Math.max(0,Math.min(1,(t-i*5)/22));
        const e=local===0?0:1+(2.7*Math.pow(local-1,3)+1.7*Math.pow(local-1,2));
        const op=local;
        const sc=0.4+0.6*e;
        x.save();
        x.globalAlpha=op;
        x.font='700 '+(p.fs*sc).toFixed(1)+'px sans-serif';
        x.textBaseline='alphabetic';
        x.fillStyle='rgb('+p.col[0]+','+p.col[1]+','+p.col[2]+')';
        const cxp=p.x+p.w/2,cyp=p.y+p.h*.8;
        x.fillText(p.text,cxp-x.measureText(p.text).width/2,cyp);
        x.restore();
      });
      if(t>180){t=0;}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();ro2.disconnect();el.innerHTML='';}};
  }
};
export default effect;
