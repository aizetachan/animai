/** @type {import('../types.js').Effect} */
const effect = {
  id:'hv-sticker-peel', title:'Sticker Peel', cat:'Hover & UI',
  tags:['sticker','peel','pegatina','despegar','curl','sombra','hover'],
  desc:'Pegatina cuya esquina se despega del fondo al hover, con sombra y reverso curvado realista.',
  meta:['clip-path','transform','box-shadow'],
  prompt:`Crea una pegatina cuya esquina superior derecha se despega al hacer hover, simulando que se levanta del papel.
Elementos: un contenedor ".sticker" con la cara frontal y una capa ".peel" que representa la esquina levantada (el reverso del papel).
Técnica: la cara frontal usa clip-path:polygon para recortar la esquina que se va a levantar. La capa ".peel" es esa misma esquina, posicionada con transform-origin en la diagonal y rotada/escalada en hover para simular el curl; su color es más claro (reverso del papel) con un gradiente para el sombreado del doblez.
Añade una sombra proyectada (drop-shadow o box-shadow) que crece cuando la esquina se levanta, dando profundidad.
Timings: transición ~.45s ease para el peel y la sombra. En reposo la pegatina está plana.`,
  code:`<div class="sticker">
  <div class="face">NEW</div>
  <div class="peel"></div>
</div>
<style>
.sticker{position:relative;width:130px;height:130px;border-radius:16px;transition:filter .45s}
.face{position:absolute;inset:0;border-radius:16px;background:linear-gradient(135deg,#7b5cff,#00e0c6);display:grid;place-items:center;font:900 26px system-ui;color:#fff;clip-path:polygon(0 0,100% 0,100% 70%,70% 100%,0 100%)}
.peel{position:absolute;top:0;right:0;width:42%;height:42%;border-radius:0 16px 0 60%;background:linear-gradient(225deg,#e9e6ff,#b9b2e8);transform-origin:bottom left;transform:rotate(0) scale(0);transition:transform .45s ease;box-shadow:-6px 6px 12px rgba(0,0,0,.35)}
.sticker:hover .peel{transform:rotate(-12deg) scale(1)}
.sticker:hover{filter:drop-shadow(-8px 10px 14px rgba(0,0,0,.45))}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#06060c';
    s.innerHTML='<style>'
      +'.hvsp{position:relative;width:120px;height:120px;transition:filter .45s ease}'
      +'.hvsp.on{filter:drop-shadow(-9px 11px 15px rgba(0,0,0,.5))}'
      +'.hvsp .face{position:absolute;inset:0;border-radius:18px;background:linear-gradient(135deg,#7b5cff,#00e0c6);display:grid;place-items:center;font:900 24px/1 system-ui,sans-serif;color:#fff;letter-spacing:1px;clip-path:polygon(0 0,100% 0,100% 64%,64% 100%,0 100%)}'
      +'.hvsp .peel{position:absolute;top:0;right:0;width:44%;height:44%;border-radius:0 18px 0 70%;background:linear-gradient(225deg,#efecff,#b3aae6);transform-origin:bottom left;transform:rotate(0deg) scale(.2);opacity:0;transition:transform .45s cubic-bezier(.34,1.4,.5,1),opacity .3s;box-shadow:-7px 7px 13px rgba(0,0,0,.4)}'
      +'.hvsp.on .peel{transform:rotate(-13deg) scale(1);opacity:1}'
      +'</style>'
      +'<div class="hvsp"><div class="face">NEW</div><div class="peel"></div></div>';
    el.appendChild(s);
    const box=s.querySelector('.hvsp');
    let on=false;
    const toggle=()=>{on=!on;box.classList.toggle('on',on);};
    toggle();
    const t=setInterval(toggle,1500);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
