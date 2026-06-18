/** @type {import('../types.js').Effect} */
const effect = {
  id:'nv-tab-bar-morph', title:'Tab Bar Morph', cat:'Navegación',
  tags:['tab bar','mobile','indicator','morph','indicador','tabs','móvil'],
  desc:'Barra de tabs móvil con un indicador que se desliza y muta de forma entre los iconos activos.',
  meta:['transform','clip-path','CSS+JS'],
  prompt:`Crea una barra de navegación inferior móvil (tab bar) con 4 iconos y un indicador que muta de forma al cambiar de tab.
Elementos: un contenedor redondeado con position:relative; 4 botones de tab en fila (cada uno con un icono SVG/emoji y opcionalmente label). Un elemento .indicador con position:absolute detrás de los iconos.
Técnica: el indicador es un pill/blob de fondo con el color de acento. Al activarse un tab, el indicador anima su transform:translateX hasta centrarse bajo el icono activo y, en paralelo, muta su forma usando border-radius o un cambio de width/height (ej. de pill ancho a círculo) con una transición spring (cubic-bezier(.5,1.6,.4,1)). El icono activo sube ligeramente (translateY) y cambia de color.
Timings: indicador ~450ms con rebote; icono ~300ms. Para auto-demo, recorre los tabs en bucle con setInterval cada ~1.4s.`,
  code:`<nav class="tabbar">
  <span class="ind"></span>
  <button class="tab on">🏠</button>
  <button class="tab">🔍</button>
  <button class="tab">♥</button>
  <button class="tab">👤</button>
</nav>
<style>
.tabbar{position:relative;display:flex;gap:8px;padding:8px;border-radius:22px;background:#16162a}
.tab{position:relative;z-index:1;width:48px;height:48px;border:0;background:none;font-size:20px;color:#8a8ca3;cursor:pointer;transition:transform .3s,color .3s}
.tab.on{color:#fff;transform:translateY(-3px)}
.ind{position:absolute;top:8px;left:8px;width:48px;height:48px;border-radius:16px;background:linear-gradient(135deg,#7b5cff,#00e0c6);transition:transform .45s cubic-bezier(.5,1.6,.4,1),border-radius .45s,width .45s,height .45s}
</style>
<script>
const tabs=[...document.querySelectorAll('.tab')],ind=document.querySelector('.ind');
function go(i){tabs.forEach((t,n)=>t.classList.toggle('on',n===i));
  ind.style.transform='translateX('+(i*56)+'px)';
  ind.style.borderRadius=i%2?'50%':'16px';}
tabs.forEach((t,i)=>t.addEventListener('click',()=>go(i)));
<\/script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'.nvtbm{position:relative;display:flex;gap:8px;padding:8px;border-radius:22px;background:#16162a}'
      +'.nvtbm .tab{position:relative;z-index:1;width:46px;height:46px;border:0;background:none;font-size:19px;color:#8a8ca3;cursor:pointer;display:grid;place-items:center;transition:transform .3s,color .3s}'
      +'.nvtbm .tab.on{color:#fff;transform:translateY(-3px)}'
      +'.nvtbm .ind{position:absolute;top:8px;left:8px;width:46px;height:46px;border-radius:15px;background:linear-gradient(135deg,#7b5cff,#00e0c6);transition:transform .45s cubic-bezier(.5,1.6,.4,1),border-radius .45s}'
      +'</style>'
      +'<nav class="nvtbm"><span class="ind"></span>'
      +'<button class="tab on">&#127968;</button>'
      +'<button class="tab">&#128269;</button>'
      +'<button class="tab">&#9829;</button>'
      +'<button class="tab">&#128100;</button>'
      +'</nav>';
    el.appendChild(s);
    const tabs=[...s.querySelectorAll('.tab')],ind=s.querySelector('.ind');
    const step=54;let i=0;
    function go(n){tabs.forEach((t,k)=>t.classList.toggle('on',k===n));
      ind.style.transform='translateX('+(n*step)+'px)';
      ind.style.borderRadius=n%2?'50%':'15px';}
    go(0);
    const tmr=setInterval(()=>{i=(i+1)%tabs.length;go(i);},1400);
    return{stop(){clearInterval(tmr);el.innerHTML='';}};
  }
};
export default effect;
