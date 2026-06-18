/** @type {import('../types.js').Effect} */
const effect = {
  id:'tx-letter-3d-swap', title:'Letter 3D Swap', cat:'Texto',
  tags:['3d','flip','letras','swap','rotateX','typography','loop'],
  desc:'Cada letra voltea en 3D para intercambiarse por otra en bucle infinito.',
  meta:['rotateX','preserve-3d','CSS+JS'],
  prompt:`Crea un texto donde cada letra es una "tarjeta" 3D de dos caras que voltea sobre el eje X para revelar una letra distinta, en bucle.
Elementos: un contenedor con perspective; por cada carácter un wrapper con transform-style:preserve-3d que contiene dos caras (.front y .back) posicionadas con position:absolute, una sin rotar y otra con rotateX(180deg) y backface-visibility:hidden.
Técnica: al voltear, el wrapper aplica rotateX(180deg) con transition ~500ms cubic-bezier; en el punto medio se sincroniza el cambio de texto de la cara visible. Aplica un stagger por índice (delay = i * 60ms) para que las letras volteen en cascada.
Timings: flip ~500ms, ciclo completo (palabra A -> palabra B -> A) ~2200ms. Acentos #7b5cff y #00e0c6 sobre fondo oscuro.`,
  code:`<div class="swap" style="perspective:600px;display:flex;gap:2px;font:900 40px system-ui;color:#eef0f7">
  <!-- por cada letra: --></div>
<style>
.swap .cell{position:relative;width:.7em;height:1.1em;transform-style:preserve-3d;transition:transform .5s cubic-bezier(.6,0,.3,1)}
.swap .cell.flip{transform:rotateX(180deg)}
.swap .face{position:absolute;inset:0;display:grid;place-items:center;backface-visibility:hidden}
.swap .back{transform:rotateX(180deg);color:#7b5cff}
</style>
<script>
const wrap=document.querySelector('.swap');
const A='ANIMAI',B='MOTION!';
const cells=[...A].map(()=>{const c=document.createElement('div');c.className='cell';c.innerHTML='<span class="face front"></span><span class="face back"></span>';wrap.appendChild(c);return c;});
let on=false;
function render(){const t=on?B:A;cells.forEach((c,i)=>{setTimeout(()=>{c.classList.toggle('flip');const cur=on?c.querySelector('.back'):c.querySelector('.front');setTimeout(()=>{cur.textContent=on? (A[i]||' '):(B[i]||' ');},250);},i*60);});on=!on;}
render();setInterval(render,2200);
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;perspective:600px;background:#0e0e16';
    s.innerHTML='<style>'
      +'.l3s{display:flex;gap:1px;font:900 34px system-ui,sans-serif}'
      +'.l3s .cell{position:relative;width:.66em;height:1.15em;transform-style:preserve-3d;transition:transform .5s cubic-bezier(.6,0,.3,1)}'
      +'.l3s .cell.flip{transform:rotateX(180deg)}'
      +'.l3s .face{position:absolute;inset:0;display:grid;place-items:center;backface-visibility:hidden}'
      +'.l3s .front{color:#eef0f7}'
      +'.l3s .back{transform:rotateX(180deg);color:#7b5cff}'
      +'</style><div class="l3s"></div>';
    el.appendChild(s);
    const wrap=s.querySelector('.l3s');
    const A='ANIMAI',B='MOTION';
    const cells=[...A].map((ch)=>{const c=document.createElement('div');c.className='cell';c.innerHTML='<span class="face front">'+ch+'</span><span class="face back"></span>';wrap.appendChild(c);return c;});
    let on=false;const timers=[];
    function clearLocal(){timers.splice(0).forEach(clearTimeout);}
    function render(){
      const next=on?A:B;
      cells.forEach((c,i)=>{
        timers.push(setTimeout(()=>{
          const flipping=!c.classList.contains('flip');
          c.classList.toggle('flip');
          const target=flipping?c.querySelector('.back'):c.querySelector('.front');
          timers.push(setTimeout(()=>{target.textContent=next[i]||' ';},250));
        },i*60));
      });
      on=!on;
    }
    render();
    const t=setInterval(render,2200);
    return{stop(){clearInterval(t);clearLocal();el.innerHTML='';}};
  }
};
export default effect;
