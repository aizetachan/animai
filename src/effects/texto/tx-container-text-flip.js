/** @type {import('../types.js').Effect} */
const effect = {
  id:'tx-container-text-flip', title:'Container Text Flip', cat:'Texto',
  tags:['flip','container','width','word','rotate','typography','loop'],
  desc:'Contenedor con pildora que ajusta su ancho mientras voltea para cambiar de palabra.',
  meta:['width transition','rotateX','CSS+JS'],
  prompt:`Crea una "pildora" o badge que muestra una palabra y, en bucle, voltea en 3D para mostrar la siguiente, ajustando suavemente su ancho a la longitud de la nueva palabra (como el ContainerTextFlip de Aceternity).
Elementos: un span con fondo de pildora (border-radius alto, padding, fondo semitransparente con acento) y una capa interior que contiene la palabra.
Técnica: mide el ancho de la nueva palabra (con un elemento oculto o scrollWidth) y aplica width animada con transition. En paralelo, voltea la palabra con rotateX 0 -> -90deg (oculta), cambia el texto, y vuelve de 90deg -> 0. Usa transform-origin y backface si quieres.
Timings: cambio de ancho ~350ms ease, flip ~400ms, palabra visible ~1600ms. Lista de palabras como datos. Acento #7b5cff.`,
  code:`<span class="ctf"><span class="w">design</span></span>
<style>
.ctf{display:inline-block;background:rgba(123,92,255,.18);border:1px solid rgba(123,92,255,.5);color:#cfc6ff;padding:8px 16px;border-radius:14px;font:800 24px system-ui;overflow:hidden;transition:width .35s ease;perspective:300px}
.ctf .w{display:inline-block;transition:transform .4s ease,opacity .4s ease;transform-origin:center}
.ctf .w.out{transform:rotateX(-90deg);opacity:0}
.ctf .w.in{transform:rotateX(90deg);opacity:0}
</style>
<script>
const box=document.querySelector('.ctf'),w=box.querySelector('.w');
const words=['design','motion','flip','code'];let i=0;
const ghost=document.createElement('span');ghost.style.cssText='position:absolute;visibility:hidden;font:800 24px system-ui;padding:0 16px';document.body.appendChild(ghost);
function next(){i=(i+1)%words.length;ghost.textContent=words[i];box.style.width=ghost.offsetWidth+'px';w.classList.add('out');
  setTimeout(()=>{w.textContent=words[i];w.classList.remove('out');w.classList.add('in');requestAnimationFrame(()=>w.classList.remove('in'));},400);}
setInterval(next,2000);
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#0e0e16';
    s.innerHTML='<style>'
      +'.ctf-box{display:inline-flex;align-items:center;justify-content:center;background:rgba(123,92,255,.18);border:1px solid rgba(123,92,255,.5);color:#cfc6ff;padding:9px 18px;border-radius:14px;font:800 26px system-ui,sans-serif;overflow:hidden;transition:width .35s ease;perspective:320px}'
      +'.ctf-box .w{display:inline-block;white-space:nowrap;transition:transform .4s ease,opacity .4s ease;transform-origin:center}'
      +'.ctf-box .w.out{transform:rotateX(-90deg);opacity:0}'
      +'.ctf-box .w.in{transform:rotateX(90deg);opacity:0}'
      +'</style><span class="ctf-box"><span class="w">design</span></span>';
    el.appendChild(s);
    const box=s.querySelector('.ctf-box'),w=box.querySelector('.w');
    const words=['design','motion','flip','catalog'];let i=0;
    const ghost=document.createElement('span');
    ghost.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:800 26px system-ui,sans-serif;padding:0 18px;left:-9999px';
    s.appendChild(ghost);
    ghost.textContent=words[0];box.style.width=(ghost.offsetWidth+2)+'px';
    let timer=null;const inner=[];
    function clearInner(){inner.splice(0).forEach(clearTimeout);}
    function next(){
      i=(i+1)%words.length;
      ghost.textContent=words[i];
      box.style.width=(ghost.offsetWidth+2)+'px';
      w.classList.add('out');
      inner.push(setTimeout(()=>{
        w.textContent=words[i];
        w.classList.remove('out');w.classList.add('in');
        inner.push(setTimeout(()=>w.classList.remove('in'),20));
      },400));
    }
    timer=setInterval(next,2000);
    return{stop(){clearInterval(timer);clearInner();el.innerHTML='';}};
  }
};
export default effect;
