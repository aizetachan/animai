/** @type {import('../types.js').Effect} */
const effect = {
  id:'tex-shuffle', title:'Shuffle Letters', cat:'Texto',
  tags:['shuffle','barajar','letras','hover','random','reordenar'],
  desc:'Al pasar el ratón las letras se barajan y recolocan en su sitio. Distinto del scramble.',
  meta:['per-letter','swap','Hover'],
  prompt:`Crea el efecto "Shuffle Letters": al hover, las letras de la palabra cambian de posición (se barajan visualmente con translate/orden) y luego vuelven a recolocarse en el orden correcto.
A diferencia del scramble (que cambia los caracteres), aquí los caracteres son siempre los mismos pero saltan de posición y se reordenan. Da una sensación lúdica de "ordenarse".
Para logos de texto o navegación juguetona.`,
  code:`// Shuffle Letters — las letras saltan de posición y se reordenan
function shuffle(letters) {
  const order = [...Array(letters.length).keys()].sort(() => Math.random() - 0.5)
  letters.forEach((span, i) => {
    span.style.transform = \`translateX(\${(order[i]-i) * 100}%) translateY(\${(Math.random()-0.5)*20}px)\`
  })
  setTimeout(() => letters.forEach(s => s.style.transform = ''), 400) // vuelven a su sitio
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<div id="sh" style="font-size:28px;font-weight:800;color:#eef0f7;display:flex"></div>';
    el.appendChild(s);const sh=s.querySelector('#sh');const sp=[];'SHUFFLE'.split('').forEach(ch=>{const e=document.createElement('span');e.textContent=ch;e.style.cssText='display:inline-block;transition:transform .35s cubic-bezier(.5,1.5,.5,1)';sh.appendChild(e);sp.push(e);});
    let to,run=true;
    function go(){if(!run)return;const ord=[...sp.keys()].sort(()=>Math.random()-.5);sp.forEach((e,i)=>{e.style.transform='translateX('+((ord[i]-i)*60)+'%) translateY('+((Math.random()-.5)*16)+'px)';e.style.color=i%2?'#00e0c6':'#7b5cff';});setTimeout(()=>sp.forEach(e=>{e.style.transform='';e.style.color='#eef0f7';}),420);to=setTimeout(go,1800);}
    go();return{stop(){run=false;clearTimeout(to);el.innerHTML='';}};
  }
};
export default effect;
