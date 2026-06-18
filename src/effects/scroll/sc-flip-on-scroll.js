/** @type {import('../types.js').Effect} */
const effect = {
  id:'sc-flip-on-scroll', title:'Flip on Scroll', cat:'Scroll',
  tags:['flip','scroll','3d','rotateY','tarjetas','cards','perspective'],
  desc:'Tarjetas que voltean en 3D a medida que avanza el scroll, revelando su cara trasera.',
  meta:['transform 3D','scroll %','rotateY'],
  prompt:`Crea una rejilla de tarjetas que voltean en 3D según el progreso de scroll.
Estructura: contenedor con perspective; cada tarjeta es un .card con transform-style:preserve-3d y dos caras (.front, .back) en position:absolute, la trasera con rotateY(180deg) y backface-visibility:hidden.
Algoritmo: calcula un progreso global 0->1 desde el scroll (scrollY / alto scrolleable). A cada tarjeta i le das un offset escalonado (stagger) restando i*0.12 al progreso y clampando a [0,1]. El ángulo de la tarjeta = clamp*180deg aplicado como rotateY.
Timing: usa easing suave (easeInOut) sobre el progreso para que el giro arranque y termine con calma. Para demo, anima el progreso en bucle ping-pong.`,
  code:`// Flip on scroll: rotateY por tarjeta según progreso escalonado
const ease = t => t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;
function onScroll(){
  const p = scrollY / (document.body.scrollHeight - innerHeight); // 0..1
  cards.forEach((card, i) => {
    const local = Math.min(1, Math.max(0, (p - i*0.12) / 0.5));
    card.style.transform = 'rotateY(' + (ease(local) * 180) + 'deg)';
  });
}
addEventListener('scroll', onScroll);`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='display:grid;place-items:center;background:#0a0a16';
    const N=4;
    let css='<style>@keyframes sc-flip-on-scroll-none{}</style>';
    s.innerHTML=css+'<div id="sfwrap" style="perspective:600px;display:flex;gap:10px"></div>';
    el.appendChild(s);
    const wrap=s.querySelector('#sfwrap');
    const cards=[];
    const faces=[['A','#7b5cff'],['B','#00e0c6'],['C','#7b5cff'],['D','#00e0c6']];
    for(let i=0;i<N;i++){
      const card=document.createElement('div');
      card.style.cssText='position:relative;width:42px;height:60px;transform-style:preserve-3d;transition:none';
      const front=document.createElement('div');
      front.style.cssText='position:absolute;inset:0;border-radius:9px;display:grid;place-items:center;color:#fff;font-weight:800;font-size:18px;background:linear-gradient(135deg,#231a44,#181230);border:1px solid #2e2256;backface-visibility:hidden;-webkit-backface-visibility:hidden';
      front.textContent=faces[i][0];
      const back=document.createElement('div');
      back.style.cssText='position:absolute;inset:0;border-radius:9px;display:grid;place-items:center;color:#06060e;font-weight:800;font-size:18px;background:'+faces[i][1]+';transform:rotateY(180deg);backface-visibility:hidden;-webkit-backface-visibility:hidden';
      back.textContent='★';
      card.appendChild(front);card.appendChild(back);
      wrap.appendChild(card);cards.push(card);
    }
    const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
    let p=0,dir=1,raf,run=true;
    (function loop(){if(!run)return;
      p+=dir*.006;
      if(p>=1){p=1;dir=-1;}
      if(p<=0){p=0;dir=1;}
      cards.forEach((card,i)=>{
        const local=Math.min(1,Math.max(0,(p-i*0.12)/0.5));
        card.style.transform='rotateY('+(ease(local)*180)+'deg)';
      });
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
