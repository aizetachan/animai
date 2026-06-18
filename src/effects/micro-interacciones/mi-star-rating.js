/** @type {import('../types.js').Effect} */
const effect = {
  id:'mi-star-rating', title:'Star Rating', cat:'Micro-interacciones',
  tags:['estrellas','stars','rating','valoracion','review','micro'],
  desc:'Cinco estrellas que se rellenan secuencialmente con un pequeño rebote, en bucle.',
  meta:['transform','transition','CSS+JS'],
  prompt:`Crea un control de valoración con 5 estrellas que se rellenan una a una.
Elementos: una fila de 5 estrellas (carácter ★ o SVG). Cada estrella tiene un color base apagado (gris) y al activarse pasa al color de acento dorado/acento.
Técnica: añade la clase .on a las estrellas hasta el índice seleccionado. Al activarse, la estrella hace un micro-rebote con @keyframes (scale 1 → 1.35 → 1) y cambia de color con transition.
Animación demo: con un timer, incrementa el rating de 0 a 5 y luego reinicia, para mostrar el llenado secuencial en bucle.`,
  code:`<div class="stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
<style>
.stars{display:flex;gap:6px;font-size:34px}
.stars span{color:#444;cursor:pointer;transition:color .2s}
.stars span.on{color:#ffce4d;animation:srPop .3s ease}
@keyframes srPop{0%{transform:scale(1)}50%{transform:scale(1.35)}100%{transform:scale(1)}}
</style>
<script>
const stars=[...document.querySelectorAll('.stars span')];
stars.forEach((s,i)=>s.addEventListener('mouseenter',()=>{
  stars.forEach((x,j)=>x.classList.toggle('on',j<=i));
}));
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes misrPop{0%{transform:scale(1)}50%{transform:scale(1.4)}100%{transform:scale(1)}}'
      +'.misr{display:flex;gap:7px;font-size:36px}'
      +'.misr span{color:#3a3a48;transition:color .25s}'
      +'.misr span.on{color:#ffce4d;animation:misrPop .32s ease}'
      +'</style>'
      +'<div class="misr"><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span></div>';
    el.appendChild(s);
    const stars=[...s.querySelectorAll('.misr span')];
    let n=0;
    const tick=()=>{
      if(n>5){n=0;stars.forEach(x=>x.classList.remove('on'));return;}
      stars.forEach((x,j)=>x.classList.toggle('on',j<n));
      n++;
    };
    tick();
    const t=setInterval(tick,520);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
