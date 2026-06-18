/** @type {import('../types.js').Effect} */
const effect = {
  id:'sc-marquee-rows', title:'Marquee Rows', cat:'Scroll',
  tags:['marquee','scroll','rows','filas','ticker','skew','opposite'],
  desc:'Filas de píldoras que se desplazan en direcciones opuestas según la velocidad de scroll.',
  meta:['transform','scroll velocity','marquee'],
  prompt:`Crea varias filas tipo marquee que se mueven en direcciones alternas controladas por el scroll.
Estructura: contenedor overflow:hidden con N filas (.row); cada fila contiene su contenido duplicado dos veces para un loop infinito sin costuras (translateX -50% reinicia visualmente).
Algoritmo: mantén un offset base que avanza con un loop autónomo (deriva constante). Suma la velocidad de scroll (deltaScroll) multiplicada por la dirección de la fila (filas pares +1, impares -1). Aplica translateX(offset % anchoFila) con módulo para reciclar.
Detalle: aplica un leve skewX cuando la velocidad de scroll es alta para dar sensación de inercia. Para demo, simula la velocidad de scroll con una onda seno en bucle.`,
  code:`// Marquee rows: dirección opuesta por fila + velocidad de scroll
let last = scrollY, offsets = rows.map(()=>0);
function tick(){
  const vel = scrollY - last; last = scrollY;
  rows.forEach((row, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    offsets[i] = (offsets[i] + 0.4*dir + vel*dir) % row.scrollWidth;
    const skew = Math.max(-8, Math.min(8, vel*dir*0.3));
    row.style.transform = 'translateX(' + offsets[i] + 'px) skewX(' + skew + 'deg)';
  });
  requestAnimationFrame(tick);
}
tick();`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='display:flex;flex-direction:column;justify-content:center;gap:8px;overflow:hidden;background:#0a0a16';
    el.appendChild(s);
    const words=['ANIMAI','SCROLL','MOTION','UI','WEB','FLUX','PIXEL','LOOP'];
    const rows=[];
    for(let r=0;r<3;r++){
      const row=document.createElement('div');
      row.style.cssText='display:flex;gap:8px;white-space:nowrap;will-change:transform';
      // duplicar contenido para loop sin costuras
      for(let k=0;k<2;k++){
        for(let i=0;i<8;i++){
          const pill=document.createElement('span');
          const c=(i+r)%2?'#7b5cff':'#00e0c6';
          pill.textContent=words[(i+r*3)%words.length];
          pill.style.cssText='flex:none;padding:5px 11px;border-radius:20px;font-weight:800;font-size:11px;letter-spacing:.5px;color:#06060e;background:'+c;
          row.appendChild(pill);
        }
      }
      s.appendChild(row);rows.push(row);
    }
    const offsets=rows.map(()=>0);
    let t=0,raf,run=true;
    (function loop(){if(!run)return;
      t+=.03;
      const vel=Math.sin(t)*4; // velocidad de scroll simulada
      rows.forEach((row,i)=>{
        const dir=i%2===0?1:-1;
        const half=row.scrollWidth/2||1;
        offsets[i]=(offsets[i]+0.4*dir+vel*dir)%half;
        const skew=Math.max(-8,Math.min(8,vel*dir*0.4));
        row.style.transform='translateX('+offsets[i]+'px) skewX('+skew+'deg)';
      });
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
