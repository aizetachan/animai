/** @type {import('../types.js').Effect} */
const effect = {
  id:'hv-dot-expand-button', title:'Dot Expand Button', cat:'Hover & UI',
  tags:['button','botón','expand','fill','relleno','circle','hover'],
  desc:'Botón con un relleno circular de color que crece desde el punto exacto donde entra el cursor.',
  meta:['clip','scale','CSS+JS'],
  prompt:`Crea un botón con un relleno circular que crece desde el punto donde el cursor entra al botón.
Elementos: un .btn con position:relative y overflow:hidden, dentro un .fill circular (border-radius:50%) en position:absolute con scale(0), y el texto encima (z-index mayor).
Técnica: al entrar el cursor (mouseenter), lee la posición relativa del ratón y coloca el centro del .fill ahí (left/top); luego anima scale de 0 a un valor grande (que cubra todo el botón) con transition. Al salir (mouseleave), coloca el .fill en el punto de salida y vuelve a scale(0). El texto cambia de color al estar cubierto.
Timings: transición de scale ~450ms ease. El .fill debe ser un cuadrado de lado >= diagonal del botón para cubrirlo entero al escalar.`,
  code:`<button class="dbtn"><span class="fill"></span><span class="txt">Hover</span></button>
<style>
.dbtn{position:relative;overflow:hidden;border:0;border-radius:12px;padding:16px 40px;background:#1a1a2e;cursor:pointer;isolation:isolate}
.dbtn .txt{position:relative;z-index:2;color:#fff;font-weight:800;transition:color .3s}
.dbtn .fill{position:absolute;width:260px;height:260px;border-radius:50%;background:#7b5cff;transform:translate(-50%,-50%) scale(0);transition:transform .45s ease;z-index:1}
</style>
<script>
const b=document.querySelector('.dbtn'),f=b.querySelector('.fill');
b.addEventListener('mouseenter',e=>{const r=b.getBoundingClientRect();f.style.left=(e.clientX-r.left)+'px';f.style.top=(e.clientY-r.top)+'px';f.style.transform='translate(-50%,-50%) scale(1)';});
b.addEventListener('mouseleave',e=>{const r=b.getBoundingClientRect();f.style.left=(e.clientX-r.left)+'px';f.style.top=(e.clientY-r.top)+'px';f.style.transform='translate(-50%,-50%) scale(0)';});
<\/script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'.hvde{position:relative;overflow:hidden;border:0;border-radius:12px;padding:17px 42px;background:#1a1a2e;isolation:isolate}'
      +'.hvde .hvde-txt{position:relative;z-index:2;color:#fff;font-weight:800;letter-spacing:.5px;transition:color .3s}'
      +'.hvde .hvde-fill{position:absolute;width:280px;height:280px;border-radius:50%;background:linear-gradient(135deg,#7b5cff,#00e0c6);transform:translate(-50%,-50%) scale(0);transition:transform .45s ease;z-index:1}'
      +'</style>'
      +'<div class="hvde"><span class="hvde-fill"></span><span class="hvde-txt">Pasa el cursor</span></div>';
    el.appendChild(s);
    const b=s.querySelector('.hvde'),f=s.querySelector('.hvde-fill');
    let on=false;
    function tick(){
      const r=b.getBoundingClientRect();
      // simula entrada/salida del cursor por bordes distintos
      const px=on?r.width*0.15:r.width*0.85;
      const py=on?r.height*0.2:r.height*0.8;
      f.style.left=px+'px';f.style.top=py+'px';
      on=!on;
      f.style.transform='translate(-50%,-50%) scale('+(on?1:0)+')';
    }
    tick();
    const t=setInterval(tick,1500);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
