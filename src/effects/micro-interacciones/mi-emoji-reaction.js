/** @type {import('../types.js').Effect} */
const effect = {
  id:'mi-emoji-reaction', title:'Emoji Reaction', cat:'Micro-interacciones',
  tags:['reaction','emoji','facebook','pop','like','hover','micro'],
  desc:'Selector de reacciones estilo Facebook: los emojis aparecen escalonados con un pop al posar el cursor.',
  meta:['transform','transition','JS demo'],
  prompt:`Crea un selector de reacciones tipo Facebook. Una barra contenedor redondeada (pill) con varios emojis en fila (👍 ❤️ 😆 😮 😢 😡).
Cada emoji parte invisible (opacity:0, transform:translateY(8px) scale(.4)) y al abrir el selector aparece con un pop: anima a opacity:1, translateY(0) scale(1) usando una transition con cubic-bezier de rebote (cubic-bezier(.34,1.56,.64,1)) y un transition-delay escalonado por índice (i*45ms).
Al pasar el cursor sobre un emoji, este escala a 1.5 y los vecinos se reducen ligeramente. Usa @keyframes solo si hace falta; lo esencial son transitions con delay escalonado.`,
  code:`<div class="reactbar">
  <span>👍</span><span>❤️</span><span>😆</span><span>😮</span><span>😢</span><span>😡</span>
</div>
<style>
.reactbar{display:inline-flex;gap:6px;padding:8px 12px;border-radius:999px;
  background:#161622;box-shadow:0 8px 24px rgba(0,0,0,.5);}
.reactbar span{font-size:26px;cursor:pointer;
  opacity:0;transform:translateY(8px) scale(.4);
  transition:transform .35s cubic-bezier(.34,1.56,.64,1),opacity .25s;}
.reactbar.open span{opacity:1;transform:translateY(0) scale(1);}
.reactbar span:nth-child(1){transition-delay:0ms}
.reactbar span:nth-child(2){transition-delay:45ms}
.reactbar span:nth-child(3){transition-delay:90ms}
.reactbar span:nth-child(4){transition-delay:135ms}
.reactbar span:nth-child(5){transition-delay:180ms}
.reactbar span:nth-child(6){transition-delay:225ms}
.reactbar span:hover{transform:translateY(-8px) scale(1.5)}
</style>
<script>
// abrir al pasar el cursor
const bar=document.querySelector('.reactbar');
bar.addEventListener('mouseenter',()=>bar.classList.add('open'));
bar.addEventListener('mouseleave',()=>bar.classList.remove('open'));
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'.miErBar{display:inline-flex;gap:6px;padding:8px 12px;border-radius:999px;background:#161622;box-shadow:0 8px 24px rgba(0,0,0,.5)}'
      +'.miErBar span{font-size:24px;cursor:pointer;opacity:0;transform:translateY(8px) scale(.4);transition:transform .35s cubic-bezier(.34,1.56,.64,1),opacity .25s}'
      +'.miErBar.open span{opacity:1;transform:translateY(0) scale(1)}'
      +'.miErBar span:nth-child(1){transition-delay:0ms}.miErBar span:nth-child(2){transition-delay:45ms}'
      +'.miErBar span:nth-child(3){transition-delay:90ms}.miErBar span:nth-child(4){transition-delay:135ms}'
      +'.miErBar span:nth-child(5){transition-delay:180ms}.miErBar span:nth-child(6){transition-delay:225ms}'
      +'.miErBar span.hot{transform:translateY(-8px) scale(1.5)}'
      +'</style>'
      +'<div class="miErBar"><span>👍</span><span>❤️</span><span>😆</span><span>😮</span><span>😢</span><span>😡</span></div>';
    el.appendChild(s);
    const bar=s.querySelector('.miErBar');
    const spans=[...bar.querySelectorAll('span')];
    let t1,t2,t3,hi=-1;
    function cycle(){
      bar.classList.add('open');
      let i=0;
      t2=setInterval(()=>{
        spans.forEach(sp=>sp.classList.remove('hot'));
        if(i<spans.length){spans[i].classList.add('hot');i++;}
        else{
          clearInterval(t2);
          t3=setTimeout(()=>{
            spans.forEach(sp=>sp.classList.remove('hot'));
            bar.classList.remove('open');
            t1=setTimeout(cycle,900);
          },500);
        }
      },420);
    }
    t1=setTimeout(cycle,400);
    return{stop(){clearTimeout(t1);clearTimeout(t3);clearInterval(t2);el.innerHTML='';}};
  }
};
export default effect;
