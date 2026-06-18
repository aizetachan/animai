/** @type {import('../types.js').Effect} */
const effect = {
  id:'hv-swipe-cards', title:'Swipe Cards', cat:'Hover & UI',
  tags:['swipe','tinder','cards','deck','mazo','drag','stack'],
  desc:'Mazo de cartas tipo Tinder: la superior se desliza fuera y el resto reapila hacia delante.',
  meta:['transform','stack','z-index'],
  prompt:`Crea un mazo de cartas apilado estilo Tinder donde la carta superior se desliza fuera y las demás suben de posición.
Elementos: 3-4 cartas en position:absolute, una sobre otra, ligeramente escaladas y desplazadas hacia abajo según su profundidad (scale 1, .95, .9 y translateY 0, 10px, 20px) con z-index decreciente.
Técnica: para arrastre real, en pointerdown/move actualiza translateX y una pequeña rotación proporcional (rotate = x * 0.06deg). Si al soltar supera un umbral, anima la carta fuera de pantalla (translateX ±400px, rotate ±20deg, opacity 0) y luego reordena el mazo: mueve la carta lanzada al fondo y recalcula posiciones/escala de las restantes.
Timings: salida ~400ms ease-in; reacomodo del stack ~300ms ease-out. Para una demo automática alterna la dirección (izquierda/derecha) en cada ciclo.`,
  code:`<div class="deck"></div>
<style>
.deck{position:relative;width:150px;height:180px;margin:auto}
.swc{position:absolute;inset:0;border-radius:18px;display:grid;place-items:center;font-weight:800;color:#fff;border:1px solid rgba(255,255,255,.15);box-shadow:0 12px 30px rgba(0,0,0,.4);transition:transform .3s ease-out,opacity .3s}
</style>
<script>
const deck=document.querySelector('.deck');
const colors=['#7b5cff','#00e0c6','#ff5c8a','#ffb347'];
let cards=colors.map((c,i)=>{const d=document.createElement('div');d.className='swc';d.style.background=c;d.textContent=i+1;deck.appendChild(d);return d;});
function layout(){cards.forEach((c,i)=>{c.style.zIndex=cards.length-i;c.style.transform='translateY('+(i*10)+'px) scale('+(1-i*.05)+')';c.style.opacity=i<3?1:0;});}
layout();
function swipe(dir){const top=cards[0];top.style.transition='transform .4s ease-in,opacity .4s';top.style.transform='translateX('+(dir*400)+'px) rotate('+(dir*20)+'deg)';top.style.opacity=0;
  setTimeout(()=>{cards.push(cards.shift());top.style.transition='none';layout();setTimeout(()=>cards.forEach(c=>c.style.transition='transform .3s ease-out,opacity .3s'),20);},400);}
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='display:grid;place-items:center;background:#0a0a14;overflow:hidden';
    s.innerHTML='<style>'
      +'.hvswc-deck{position:relative;width:130px;height:160px}'
      +'.hvswc{position:absolute;inset:0;border-radius:18px;display:grid;place-items:center;font-weight:800;font-size:30px;color:#fff;border:1px solid rgba(255,255,255,.15);box-shadow:0 12px 30px rgba(0,0,0,.45);will-change:transform}'
      +'</style>'
      +'<div class="hvswc-deck"></div>';
    el.appendChild(s);
    const deck=s.querySelector('.hvswc-deck');
    const colors=['#7b5cff','#00e0c6','#ff5c8a','#ffb347'];
    let cards=colors.map((c,i)=>{
      const d=document.createElement('div');d.className='hvswc';
      d.style.background='linear-gradient(135deg,'+c+',rgba(0,0,0,.35))';
      d.textContent=i+1;deck.appendChild(d);return d;
    });
    function layout(){
      cards.forEach((c,i)=>{
        c.style.zIndex=cards.length-i;
        c.style.transform='translateX(0) translateY('+(i*10)+'px) scale('+(1-i*.05)+') rotate(0deg)';
        c.style.opacity=i<3?1:0;
      });
    }
    cards.forEach(c=>c.style.transition='transform .32s ease-out,opacity .32s');
    layout();
    let run=true,dir=1,t1,t2;
    function swipe(){
      if(!run)return;
      const top=cards[0];
      top.style.transition='transform .42s ease-in,opacity .42s';
      top.style.transform='translateX('+(dir*360)+'px) translateY(-20px) rotate('+(dir*22)+'deg)';
      top.style.opacity=0;
      t1=setTimeout(()=>{
        if(!run)return;
        cards.push(cards.shift());
        top.style.transition='none';
        layout();
        t2=setTimeout(()=>{
          if(!run)return;
          cards.forEach(c=>c.style.transition='transform .32s ease-out,opacity .32s');
        },30);
        dir*=-1;
      },420);
    }
    const tint=setInterval(swipe,1600);
    t1=setTimeout(swipe,400);
    return{stop(){run=false;clearInterval(tint);clearTimeout(t1);clearTimeout(t2);el.innerHTML='';}};
  }
};
export default effect;
