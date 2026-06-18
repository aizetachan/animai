/** @type {import('../types.js').Effect} */
const effect = {
  id:'tx-gradual-spacing', title:'Gradual Spacing', cat:'Texto',
  tags:['texto','text','stagger','spacing','letras','letters','reveal'],
  desc:'Las letras aparecen una a una, deslizando desde un espaciado cerrado hasta su posición final.',
  meta:['stagger','per-letter','CSS+JS'],
  prompt:`Crea una animación de texto "gradual spacing" donde cada letra entra de forma escalonada.
Elementos: separa el texto en spans, una por letra, con display:inline-block.
Técnica: cada span empieza con opacity:0 y translateX negativo (o margin/letter-spacing comprimido) y se anima a opacity:1 translateX(0) con un delay creciente por índice (stagger), usando una custom property --i para calcular el delay: animation-delay: calc(var(--i) * 60ms).
Keyframes: 0% { opacity:0; transform: translateX(-14px); } 100% { opacity:1; transform: translateX(0); }
Timings: cada letra ~500ms ease-out, stagger de ~60ms.
Para mostrar el ciclo en bucle, regenera los spans y reinicia cada ~2.6s.`,
  code:`<h1 class="gradual"></h1>
<style>
.gradual span{display:inline-block;opacity:0;transform:translateX(-14px);
  animation:gradIn .5s ease-out forwards;animation-delay:calc(var(--i) * 60ms);}
@keyframes gradIn{to{opacity:1;transform:translateX(0)}}
</style>
<script>
const txt='GRADUAL';const h=document.querySelector('.gradual');
h.innerHTML=[...txt].map((c,i)=>'<span style="--i:'+i+'">'+(c===' '?'&nbsp;':c)+'</span>').join('');
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#0b0b12';
    s.innerHTML='<style>'
      +'@keyframes txgsIn{to{opacity:1;transform:translateX(0)}}'
      +'.txgs{font:700 30px/1 system-ui,sans-serif;letter-spacing:.05em;white-space:nowrap}'
      +'.txgs span{display:inline-block;opacity:0;transform:translateX(-14px);color:#fff;animation:txgsIn .5s ease-out both;animation-delay:calc(var(--i) * 60ms)}'
      +'.txgs span:nth-child(odd){color:#00e0c6}.txgs span:nth-child(even){color:#7b5cff}'
      +'</style>'
      +'<h1 class="txgs"></h1>';
    el.appendChild(s);
    const h=s.querySelector('.txgs');
    const txt='GRADUAL';
    const build=()=>{h.innerHTML=[...txt].map((c,i)=>'<span style="--i:'+i+'">'+(c===' '?'&nbsp;':c)+'</span>').join('');};
    build();
    const iv=setInterval(build,2600);
    return{stop(){clearInterval(iv);el.innerHTML='';}};
  }
};
export default effect;
