/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-svg-morph', title:'SVG Shape Morph', cat:'SVG',
  tags:['morph','svg','forma','anime.js','path','transformar','interpolar'],
  desc:'Una forma SVG se transforma fluidamente en otra distinta en bucle. Morphing de paths real.',
  meta:['Anime.js','morphTo','SVG'],
  prompt:`Anima el morphing de una forma SVG en otra con Anime.js (morphTo): un <path> que transiciona suavemente su atributo "d" entre varias siluetas (ej. estrella → corazón → blob → estrella).
Los paths deben tener un número compatible de puntos; Anime.js interpola entre ellos. Encadena varias formas en un timeline con loop.
Para logos vivos, iconos que cambian de estado o decoración hero.`,
  code:`// npm install animejs
import { animate } from 'animejs'
animate('.shape', {
  d: [
    { value: morphTo('#star') },
    { value: morphTo('#heart') },
    { value: morphTo('#blob') },
  ],
  loop: true, duration: 1200, ease: 'inOutQuad',
})`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<svg viewBox="-50 -50 100 100" width="55%"><path id="mp" fill="url(#mpg)"/><defs><linearGradient id="mpg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b5cff"/><stop offset="1" stop-color="#00e0c6"/></linearGradient></defs></svg>';
    el.appendChild(s);const path=s.querySelector('#mp');
    // tres formas como arrays de puntos (mismo nº)
    const star=[],heart=[],blob=[];const n=24;
    for(let i=0;i<n;i++){const a=i/n*6.283;const rs=(i%2===0?38:18);star.push([Math.cos(a)*rs,Math.sin(a)*rs]);const t=a;heart.push([16*Math.pow(Math.sin(t),3)*2.1,-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*2.1]);blob.push([Math.cos(a)*(34+Math.sin(a*3)*8),Math.sin(a)*(34+Math.cos(a*2)*8)]);}
    const shapes=[star,heart,blob];let idx=0,t=0,raf,run=true;
    function toPath(p){let d='M'+p[0][0].toFixed(1)+' '+p[0][1].toFixed(1);for(let i=0;i<p.length;i++){const c=p[i],nx=p[(i+1)%p.length];const mx=(c[0]+nx[0])/2,my=(c[1]+nx[1])/2;d+=' Q'+c[0].toFixed(1)+' '+c[1].toFixed(1)+' '+mx.toFixed(1)+' '+my.toFixed(1);}return d+'Z';}
    (function loop(){if(!run)return;t+=.012;if(t>=1){t=0;idx=(idx+1)%shapes.length;}const a=shapes[idx],b=shapes[(idx+1)%shapes.length];const e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;const cur=a.map((p,i)=>[p[0]+(b[i][0]-p[0])*e,p[1]+(b[i][1]-p[1])*e]);path.setAttribute('d',toPath(cur));raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
