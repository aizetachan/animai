/** @type {import('../types.js').Effect} */
const effect = {
  id:'mi-like-burst', title:'Like Burst', cat:'Micro-interacciones',
  tags:['like','corazon','heart','burst','particulas','particles','micro'],
  desc:'Corazón que escala con un rebote y lanza una ráfaga de partículas radiales al pulsar.',
  meta:['transform','particles','CSS+JS'],
  prompt:`Crea un botón de "like" con corazón que al activarse escala con rebote y emite una ráfaga de partículas.
Elementos: un contenedor central con un corazón (carácter ♥ o SVG) y varias partículas pequeñas posicionadas en el centro con position:absolute.
Técnica: al pulsar, añade una clase que dispara una animación @keyframes del corazón (scale de 0.6 → 1.3 → 1, color gris → rojo/acento). En paralelo, cada partícula se mueve hacia fuera en un ángulo distinto (usa custom properties --tx/--ty o transform:translate por ángulo) con @keyframes que va de translate(0) scale(1) opacity:1 a translate(radio) scale(0) opacity:0.
Timings: corazón ~450ms ease, partículas ~600ms ease-out. Resetea las clases para poder repetir.`,
  code:`<button class="like"><span class="heart">♥</span><i class="p"></i><i class="p"></i><i class="p"></i><i class="p"></i><i class="p"></i><i class="p"></i></button>
<style>
.like{position:relative;border:0;background:none;cursor:pointer;width:80px;height:80px;display:grid;place-items:center}
.heart{font-size:42px;color:#555;transition:color .2s}
.like.on .heart{color:#7b5cff;animation:lbPop .45s ease}
@keyframes lbPop{0%{transform:scale(.6)}40%{transform:scale(1.3)}100%{transform:scale(1)}}
.like .p{position:absolute;top:50%;left:50%;width:7px;height:7px;border-radius:50%;background:#00e0c6;opacity:0}
.like .p:nth-child(2){--a:0deg;background:#7b5cff}
.like .p:nth-child(3){--a:60deg}
.like .p:nth-child(4){--a:120deg;background:#7b5cff}
.like .p:nth-child(5){--a:180deg}
.like .p:nth-child(6){--a:240deg;background:#7b5cff}
.like .p:nth-child(7){--a:300deg}
.like.on .p{animation:lbBurst .6s ease-out}
@keyframes lbBurst{0%{transform:rotate(var(--a)) translateY(0) scale(1);opacity:1}100%{transform:rotate(var(--a)) translateY(-34px) scale(0);opacity:0}}
</style>
<script>
const btn=document.querySelector('.like');
btn.addEventListener('click',()=>{btn.classList.remove('on');void btn.offsetWidth;btn.classList.add('on');});
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes mibPop{0%{transform:scale(.6)}40%{transform:scale(1.3)}100%{transform:scale(1)}}'
      +'@keyframes mibBurst{0%{transform:rotate(var(--a)) translateY(0) scale(1);opacity:1}100%{transform:rotate(var(--a)) translateY(-34px) scale(0);opacity:0}}'
      +'.mib{position:relative;width:90px;height:90px;display:grid;place-items:center}'
      +'.mib .h{font-size:46px;color:#555;transition:color .2s}'
      +'.mib.on .h{color:#7b5cff;animation:mibPop .45s ease}'
      +'.mib .p{position:absolute;top:50%;left:50%;width:7px;height:7px;border-radius:50%;background:#00e0c6;opacity:0}'
      +'.mib .p:nth-child(2){--a:0deg;background:#7b5cff}.mib .p:nth-child(3){--a:60deg}.mib .p:nth-child(4){--a:120deg;background:#7b5cff}.mib .p:nth-child(5){--a:180deg}.mib .p:nth-child(6){--a:240deg;background:#7b5cff}.mib .p:nth-child(7){--a:300deg}'
      +'.mib.on .p{animation:mibBurst .6s ease-out}'
      +'</style>'
      +'<div class="mib"><span class="h">&#9829;</span><i class="p"></i><i class="p"></i><i class="p"></i><i class="p"></i><i class="p"></i><i class="p"></i></div>';
    el.appendChild(s);
    const box=s.querySelector('.mib');
    const fire=()=>{box.classList.remove('on');void box.offsetWidth;box.classList.add('on');};
    fire();
    const t=setInterval(fire,1600);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
