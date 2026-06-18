/** @type {import('../types.js').Effect} */
const effect = {
  id:'art-analog-clock', title:'Analog Clock', cat:'CSS Art',
  tags:['css','reloj','clock','analog','agujas','hands','time','js'],
  desc:'Reloj analógico real con hora actual: esfera, marcas horarias y tres agujas (hora, minuto, segundo) que avanzan con el tiempo.',
  meta:['transform rotate','date','js'],
  prompt:`Crea un reloj analógico que muestre la hora REAL.
Dibuja una esfera circular con borde, 12 marcas horarias colocadas con transform:rotate(i*30deg) translateY(-radio), y tres agujas (hora, minuto, segundo) absolutamente posicionadas en el centro con transform-origin:bottom.
En JS, cada segundo calcula con new Date() los ángulos: segundos = s*6deg, minutos = m*6 + s*0.1deg, horas = (h%12)*30 + m*0.5deg, y aplica transform:rotate(...) a cada aguja. La aguja de segundos es del color de acento. Limpia el intervalo al destruir.`,
  code:`/* Reloj analógico - HTML + JS */
.clock { width:200px; aspect-ratio:1; border-radius:50%; border:4px solid #7b5cff; position:relative; }
.hand { position:absolute; left:50%; bottom:50%; transform-origin:bottom; border-radius:4px; }
.hand.h { width:6px; height:28%; background:#e7e7f5; }
.hand.m { width:4px; height:38%; background:#bdbdda; }
.hand.s { width:2px; height:42%; background:#00e0c6; }

function tick(){
  const d=new Date(), s=d.getSeconds(), m=d.getMinutes(), h=d.getHours();
  clock.querySelector('.s').style.transform='translateX(-50%) rotate('+(s*6)+'deg)';
  clock.querySelector('.m').style.transform='translateX(-50%) rotate('+(m*6+s*0.1)+'deg)';
  clock.querySelector('.h').style.transform='translateX(-50%) rotate('+((h%12)*30+m*0.5)+'deg)';
}
setInterval(tick,1000); tick();`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    let marks='';
    for(let i=0;i<12;i++){
      marks+=`<span class="acMark" style="transform:rotate(${i*30}deg) translateY(-84px)"></span>`;
    }
    s.innerHTML=`<style>
      .acClock{width:180px;aspect-ratio:1;border-radius:50%;border:4px solid #7b5cff;position:relative;background:radial-gradient(circle at 50% 50%,#12121e,#0a0a14);box-shadow:0 0 24px rgba(123,92,255,.25)}
      .acMark{position:absolute;left:calc(50% - 1.5px);top:50%;width:3px;height:9px;background:#6b6b8a;transform-origin:50% 0;border-radius:2px}
      .acHand{position:absolute;left:50%;bottom:50%;transform-origin:bottom;border-radius:4px}
      .acHand.h{width:6px;height:27%;background:#e7e7f5}
      .acHand.m{width:4px;height:37%;background:#bdbdda}
      .acHand.s{width:2px;height:42%;background:#00e0c6}
      .acDot{position:absolute;left:50%;top:50%;width:10px;height:10px;border-radius:50%;background:#00e0c6;transform:translate(-50%,-50%);box-shadow:0 0 8px #00e0c6}
    </style>
    <div class="acClock">${marks}
      <i class="acHand h"></i><i class="acHand m"></i><i class="acHand s"></i>
      <span class="acDot"></span>
    </div>`;
    el.appendChild(s);
    const clock=s.querySelector('.acClock');
    const hH=clock.querySelector('.h'), hM=clock.querySelector('.m'), hS=clock.querySelector('.s');
    function tick(){
      const d=new Date(), sec=d.getSeconds(), min=d.getMinutes(), hr=d.getHours();
      hS.style.transform='translateX(-50%) rotate('+(sec*6)+'deg)';
      hM.style.transform='translateX(-50%) rotate('+(min*6+sec*0.1)+'deg)';
      hH.style.transform='translateX(-50%) rotate('+(((hr%12)*30)+min*0.5)+'deg)';
    }
    tick();
    const id=setInterval(tick,1000);
    return{stop(){clearInterval(id);el.innerHTML='';}};
  }
};
export default effect;
