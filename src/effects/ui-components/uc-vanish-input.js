import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'uc-vanish-input', title:'Vanish Input', cat:'UI Components',
  tags:['input','vanish','particles','partículas','disolver','aceternity','placeholder'],
  desc:'Texto de input que se desintegra en partículas al enviar, como el Placeholders And Vanish Input de Aceternity.',
  meta:['Aceternity UI','canvas','Partículas'],
  prompt:`Recrea el efecto Vanish Input de Aceternity: el texto escrito en un input se desintegra en una nube de partículas que se alejan hacia la derecha y se desvanecen al pulsar enviar.
Técnica: pinta el texto en un canvas oculto, lee los píxeles con getImageData y por cada píxel con alpha>0 crea una partícula en esa posición (con su color). Anímalas: empuja cada partícula hacia la derecha con velocidad aleatoria, suma algo de dispersión vertical, reduce su tamaño/alpha hasta desaparecer. Mientras tanto el texto real se borra.
Para la demo en bucle: muestra un campo con texto, espera, dispara la desintegración, y vuelve a "escribir" el texto carácter a carácter para repetir el ciclo.`,
  code:`// Aceternity UI — Placeholders And Vanish Input (canvas + getImageData)
// 1) pinta el texto en canvas y muestrea los píxeles -> partículas
ctx.fillText(value, 16, 40)
const { data, width } = ctx.getImageData(0,0,w,h)
const parts = []
for (let y=0;y<h;y++) for (let x=0;x<width;x++){
  const i = (y*width+x)*4
  if (data[i+3] > 0) parts.push({ x, y, r:data[i], g:data[i+1], b:data[i+2] })
}
// 2) anima: empuja a la derecha y desvanece
parts.forEach(p => { p.x += Math.random()*3; p.size *= 0.96; p.life -= 0.02 })`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;display:grid;place-items:center;background:#0a0a12;overflow:hidden';
    s.innerHTML='<style>'
      +'.uvi-wrap{position:relative;width:200px;height:42px}'
      +'.uvi-field{position:absolute;inset:0;border-radius:21px;background:#13131f;border:1px solid #26263a;box-shadow:0 2px 12px #0006}'
      +'.uvi-cv{position:absolute;left:18px;top:50%;transform:translateY(-50%)}'
      +'.uvi-btn{position:absolute;right:6px;top:50%;transform:translateY(-50%);width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#7b5cff,#00e0c6);display:grid;place-items:center;color:#fff;font-size:14px}'
      +'</style>'
      +'<div class="uvi-wrap"><div class="uvi-field"></div><canvas class="uvi-cv"></canvas><div class="uvi-btn">&#8594;</div></div>';
    el.appendChild(s);
    const cv=s.querySelector('.uvi-cv'),x=cv.getContext('2d');
    const dpr=Math.min(devicePixelRatio,2),W=158,H=30;
    cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';x.scale(dpr,dpr);
    const full='Animai effects...';
    let parts=[],raf,run=true,mode='type',typed=0,timer=0;
    function paintText(str){x.clearRect(0,0,W,H);x.font='600 16px system-ui,sans-serif';x.textBaseline='middle';x.fillStyle='#cfcfe8';x.fillText(str,2,H/2);}
    function explode(){
      x.font='600 16px system-ui,sans-serif';x.textBaseline='middle';x.fillStyle='#9d86ff';x.clearRect(0,0,W,H);x.fillText(full,2,H/2);
      const img=x.getImageData(0,0,W*dpr,H*dpr).data,iw=W*dpr;parts=[];
      for(let yy=0;yy<H*dpr;yy+=2)for(let xx=0;xx<W*dpr;xx+=2){const i=(yy*iw+xx)*4;if(img[i+3]>128){parts.push({x:xx/dpr,y:yy/dpr,vx:1+Math.random()*3,vy:(Math.random()-.5)*1.6,size:1.4,life:1});}}
      x.clearRect(0,0,W,H);
    }
    function loop(){if(!run)return;timer++;
      if(mode==='type'){
        if(timer%6===0&&typed<full.length){typed++;paintText(full.slice(0,typed));}
        if(typed>=full.length&&timer%6===0){if(timer>full.length*6+50){mode='vanish';explode();}}
      } else {
        x.clearRect(0,0,W,H);let alive=0;
        parts.forEach(p=>{if(p.life<=0)return;alive++;p.x+=p.vx;p.vx*=1.01;p.y+=p.vy;p.size*=.965;p.life-=.018;x.globalAlpha=Math.max(0,p.life);x.fillStyle='#9d86ff';x.fillRect(p.x,p.y,Math.max(0,p.size),Math.max(0,p.size));});
        x.globalAlpha=1;
        if(alive===0){mode='type';typed=0;timer=0;}
      }
      raf=requestAnimationFrame(loop);
    }
    loop();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
