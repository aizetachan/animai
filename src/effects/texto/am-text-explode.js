/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-text-explode', title:'Text Explode 3D', cat:'Texto',
  tags:['explode','3d','texto','anime.js','split','letras','rotar'],
  desc:'Las letras explotan en 3D con rotación y vuelven a montarse. Text split 3D de Anime.js v4.',
  meta:['splitText','3d','Anime.js'],
  prompt:`Crea un efecto de texto que explota en 3D: las letras se dispersan con rotación en los ejes X/Y/Z y translaciones aleatorias, y luego vuelven a ensamblarse en la palabra.
Con Anime.js v4 usa splitText para separar caracteres y anímalos con rotateX/rotateY/translateZ aleatorios y perspectiva en el contenedor; revierte para reconstruir.
Para intros impactantes y titulares dramáticos.`,
  code:`// Anime.js v4 — split text + explosión 3D
import { animate, text, stagger } from 'animejs'
const { chars } = text.split('.title', { chars: true })
animate(chars, {
  rotateX: () => anime.random(-180, 180),
  rotateY: () => anime.random(-180, 180),
  translateZ: () => anime.random(-100, 100),
  delay: stagger(30), loop: true, alternate: true,
})`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;perspective:500px';
    s.innerHTML='<div id=" te" style="font-size:30px;font-weight:900;color:#eef0f7;display:flex;transform-style:preserve-3d"></div>';
    const cont=s.querySelector('#te')||s.querySelector('div[id]');el.appendChild(s);const te=s.querySelector('div');
    const wrap=document.createElement('div');wrap.style.cssText='font-size:30px;font-weight:900;color:#eef0f7;display:flex;transform-style:preserve-3d';s.innerHTML='';s.appendChild(wrap);
    const sp=[];'EXPLODE'.split('').forEach((ch,i)=>{const e=document.createElement('span');e.textContent=ch;e.style.cssText='display:inline-block;transition:transform .9s cubic-bezier(.5,1.4,.4,1),color .9s';e.dataset.rx=(Math.random()-.5)*360;e.dataset.ry=(Math.random()-.5)*360;e.dataset.tz=(Math.random()-.5)*120;wrap.appendChild(e);sp.push(e);});
    let exploded=false,raf,run=true,t=0;
    function set(){sp.forEach((e,i)=>{if(exploded){e.style.transform='rotateX('+e.dataset.rx+'deg) rotateY('+e.dataset.ry+'deg) translateZ('+e.dataset.tz+'px)';e.style.color=i%2?'#7b5cff':'#00e0c6';}else{e.style.transform='';e.style.color='#eef0f7';}});}
    (function loop(){if(!run)return;t++;if(t%70===0){exploded=!exploded;set();}raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
