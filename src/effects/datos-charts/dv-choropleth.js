import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-choropleth', title:'Choropleth Grid', cat:'Datos / Charts',
  tags:['choropleth','tile grid map','mapa','map','celdas','regiones','coropleta','色块地图'],
  desc:'Mapa abstracto donde cada región es una celda cuadrada coloreada según su valor (tile grid map).',
  meta:['canvas','grid','Viz'],
  prompt:`Crea un "tile grid map" / coropleta abstracta en canvas 2D: en vez de geometría real, cada región es una celda cuadrada colocada en una rejilla que evoca la silueta de un territorio (ej. EEUU).
Estructura de datos: lista de regiones {label, col, row, value}. Mapea value (0..1) a un color de rampa secuencial (oscuro -> #7b5cff -> #00e0c6). Dibuja cada celda como rectángulo redondeado con la etiqueta (abreviatura) centrada.
Animación: anima la entrada con un barrido (stagger por col+row) escalando cada tile desde el centro; en bucle, transiciona los valores a nuevos datos con un ease para que los colores fluyan. Útil para mapas de elecciones, métricas por estado/región sin proyección cartográfica.`,
  code:`// Tile grid map (choropleth abstracto) — celda por región, color por valor
const ramp = t => lerpColor('#16162a', t<.5?'#7b5cff':'#00e0c6', t)
regions.forEach(r => {
  const c = ramp(r.value)               // 0..1 -> color secuencial
  drawTile(r.col*S, r.row*S, S, c)
  drawLabel(r.label, r.col*S+S/2, r.row*S+S/2)
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    // mini tile-grid silueta abstracta (cols 0..8, rows 0..5)
    const layout=[
      'AK','..','..','..','..','..','..','..','ME',
      'WA','MT','ND','MN','WI','MI','..','VT','NH',
      'OR','ID','WY','SD','IA','IL','IN','OH','PA',
      'CA','NV','UT','CO','NE','MO','KY','WV','VA',
      'AZ','NM','OK','KS','AR','TN','NC','SC','..',
      'HI','TX','LA','MS','AL','GA','FL','..','..'
    ];
    const cols=9,rows=6;
    let cells=[];
    function build(){
      cells=[];
      for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
        const lab=layout[r*cols+c];if(lab==='..')continue;
        cells.push({c,r,lab,from:Math.random(),to:Math.random()});
      }
    }
    function ramp(t){
      const a=[22,22,42],b=[123,92,255],c=[0,224,198];
      let R,G,B;
      if(t<.5){const k=t/.5;R=a[0]+(b[0]-a[0])*k;G=a[1]+(b[1]-a[1])*k;B=a[2]+(b[2]-a[2])*k;}
      else{const k=(t-.5)/.5;R=b[0]+(c[0]-b[0])*k;G=b[1]+(c[1]-b[1])*k;B=b[2]+(c[2]-b[2])*k;}
      return 'rgb('+(R|0)+','+(G|0)+','+(B|0)+')';
    }
    function rr(px,py,w,h,rad){x.beginPath();x.moveTo(px+rad,py);x.arcTo(px+w,py,px+w,py+h,rad);x.arcTo(px+w,py+h,px,py+h,rad);x.arcTo(px,py+h,px,py,rad);x.arcTo(px,py,px+w,py,rad);x.closePath();}
    build();let t=0,raf,run=true,phase=0,hold=0;
    (function loop(){if(!run)return;
      const W=o.W(),H=o.H();
      const pad=12,gap=2,sz=Math.min((W-pad*2-gap*(cols-1))/cols,(H-pad*2-gap*(rows-1))/rows);
      const ox=(W-(sz*cols+gap*(cols-1)))/2,oy=(H-(sz*rows+gap*(rows-1)))/2;
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      if(phase===0){ // entrada
        t+=1;if(t>120){phase=1;hold=40;}
      }else if(phase===1){ // hold mostrando
        if(hold>0)hold--;else{phase=2;t=0;}
      }else{ // transición de valores
        t+=1;if(t>90){phase=1;hold=40;cells.forEach(cl=>{cl.from=cl.to;cl.to=Math.random();});}
      }
      cells.forEach(cl=>{
        let appear=1,val;
        if(phase===0){appear=Math.max(0,Math.min(1,(t*3-(cl.c+cl.r)*6)/24));val=cl.from;}
        else if(phase===1){val=cl.from;}
        else{const e=t/90;const k=e<.5?2*e*e:1-Math.pow(-2*e+2,2)/2;val=cl.from+(cl.to-cl.from)*k;cl._v=val;}
        if(phase===1&&cl._v!=null){cl.from=cl._v;val=cl._v;}
        if(appear<=.02)return;
        const s=sz*(.55+.45*appear);
        const px=ox+cl.c*(sz+gap)+(sz-s)/2,py=oy+cl.r*(sz+gap)+(sz-s)/2;
        x.globalAlpha=appear;x.fillStyle=ramp(val);rr(px,py,s,s,2);x.fill();
        if(sz>=18){x.globalAlpha=appear*.9;x.fillStyle=val>.55?'#0a0a14':'#dfe2ff';x.font='600 '+(sz*.32|0)+'px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(cl.lab,px+s/2,py+s/2+.5);}
      });
      x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
