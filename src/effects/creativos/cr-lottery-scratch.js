import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cr-lottery-scratch', title:'Scratch Card', cat:'Creativos',
  tags:['scratch','刮刮乐','rasca','lottery','reveal','premio','canvas'],
  desc:'Tarjeta de rasca-y-gana: una capa metálica se borra al rascar revelando el premio. Auto-demo en bucle.',
  meta:['canvas','globalCompositeOperation','刮刮乐'],
  prompt:`Crea una tarjeta de rasca-y-gana (刮刮乐 / scratch card).
Estructura en dos capas sobre un canvas: (1) el premio dibujado al fondo (texto/figura sobre un panel), (2) una capa de "pintura" gris metálica encima que la cubre. Al rascar se borra la capa superior.
Técnica: dibuja la capa de cobertura y usa ctx.globalCompositeOperation='destination-out' para "borrar" con un pincel circular (arc relleno) por donde pasa el dedo/cursor. Calcula el porcentaje de píxeles transparentes con getImageData; al superar ~55% revela todo (fade del resto de la capa).
Auto-demo: simula una trayectoria de rascado (sweeps en zig-zag con un valor de progreso animado), revela el premio, hace hold y repite reponiendo la capa.`,
  code:`// Scratch card: borrar la capa superior con destination-out
ctx.fillStyle = '#9aa0b5';            // capa metálica
ctx.fillRect(0,0,W,H);
function scratch(x,y){
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath(); ctx.arc(x,y,18,0,Math.PI*2); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
}
// % revelado -> si > 0.55, limpia toda la capa y muestra el premio`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    let raf,run=true;
    // capa de cobertura en canvas offscreen
    let cover=document.createElement('canvas'), cx=cover.getContext('2d');
    let prog,phase,holdUntil,path,W0,H0;
    function buildPath(W,H){
      const pts=[]; const rows=4;
      for(let r=0;r<rows;r++){
        const y=H*(0.28+0.46*(r/(rows-1)));
        const ltr=r%2===0;
        for(let s=0;s<=20;s++){
          const u=s/20; const px=ltr? W*(0.12+0.76*u) : W*(0.88-0.76*u);
          pts.push({x:px,y});
        }
      }
      return pts;
    }
    function buildCover(W,H){
      cover.width=W;cover.height=H;
      const g=cx.createLinearGradient(0,0,W,H);
      g.addColorStop(0,'#b9bed0');g.addColorStop(.5,'#8b90a8');g.addColorStop(1,'#aeb3c7');
      cx.globalCompositeOperation='source-over';
      cx.fillStyle=g;cx.fillRect(0,0,W,H);
      // textura diagonal sutil
      cx.strokeStyle='rgba(255,255,255,.08)';cx.lineWidth=2;
      for(let i=-H;i<W;i+=10){cx.beginPath();cx.moveTo(i,0);cx.lineTo(i+H,H);cx.stroke();}
      cx.fillStyle='#5c6076';cx.font='700 '+(H*.12)+'px Inter';cx.textAlign='center';cx.textBaseline='middle';
      cx.fillText('RASCA AQUÍ',W/2,H/2);
    }
    function reset(){
      W0=o.W();H0=o.H();
      buildCover(W0,H0);
      path=buildPath(W0,H0);
      prog=0;phase='scratch';holdUntil=0;
    }
    reset();
    function loop(now){
      if(!run)return;
      const W=o.W(),H=o.H();
      if(W!==W0||H!==H0) reset();
      // fondo + premio
      x.fillStyle='#0a0a16';x.fillRect(0,0,W,H);
      const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#1a1430');g.addColorStop(1,'#102a2a');
      x.fillStyle=g;x.fillRect(0,0,W,H);
      x.fillStyle='#00e0c6';x.font='800 '+(H*.2)+'px Inter';x.textAlign='center';x.textBaseline='middle';
      x.fillText('¡GANASTE!',W/2,H*0.4);
      x.fillStyle='#7b5cff';x.font='800 '+(H*.16)+'px Inter';
      x.fillText('$500',W/2,H*0.66);

      if(phase==='scratch'){
        prog+=0.012;
        const idx=Math.min(path.length-1, Math.floor(prog*path.length));
        // rascar hasta el punto actual
        cx.globalCompositeOperation='destination-out';
        const from=Math.max(0, idx-3);
        for(let k=from;k<=idx;k++){const p=path[k];cx.beginPath();cx.arc(p.x,p.y,H*0.11,0,6.28);cx.fill();}
        cx.globalCompositeOperation='source-over';
        if(prog>=1){phase='reveal';prog=1;holdUntil=0;}
      } else if(phase==='reveal'){
        // desvanece el resto de la capa
        cx.globalCompositeOperation='destination-out';
        cx.fillStyle='rgba(0,0,0,.08)';cx.fillRect(0,0,W0,H0);
        cx.globalCompositeOperation='source-over';
        if(!holdUntil)holdUntil=now+1200;
        if(now>=holdUntil) reset();
      }
      // pinta la capa de cobertura encima
      x.drawImage(cover,0,0,W,H);
      raf=requestAnimationFrame(loop);
    }
    raf=requestAnimationFrame(loop);
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();cover=null;cx=null;el.innerHTML='';}};
  }
};
export default effect;
