/** @type {import('../types.js').Effect} */
const effect = {
  id:'nv-speed-dial', title:'Speed Dial FAB', cat:'Navegación',
  tags:['fab','speed dial','arco','arc','acciones','floating','botón'],
  desc:'Botón de acción flotante que despliega varias acciones en arco con stagger y rota su icono a una X.',
  meta:['translate polar','stagger','FAB'],
  prompt:`Crea un Speed Dial (FAB con menú de acciones): un botón flotante circular en una esquina que, al activarse, despliega 3-4 mini-botones de acción en un arco/cuarto de círculo, cada uno con su icono.
Elementos: .fab principal (acento #7b5cff) con un icono "+" centrado, y N .action posicionados con position:absolute en el mismo origen que el FAB.
Técnica: al abrir, calcula posición polar de cada acción con ángulo y radio (translate(cos*r, sin*r)); anímalos con transition y transitionDelay creciente (stagger ~50ms) para que salgan en cascada. El icono "+" del FAB rota 135deg (a una X) y cada acción hace fade+scale desde 0.
Opcional: backdrop semitransparente que aparece al abrir. Timings: 320ms cubic-bezier(.34,1.56,.64,1). Auto-demo: abre, espera, cierra en bucle.`,
  code:`<div class="sd">
  <button class="fab">+</button>
  <button class="action">A</button>
  <button class="action">B</button>
  <button class="action">C</button>
</div>
<style>
.sd{position:absolute;right:20px;bottom:20px}
.fab{width:48px;height:48px;border-radius:50%;border:0;background:#7b5cff;color:#fff;font-size:26px;
  transition:transform .32s cubic-bezier(.34,1.56,.64,1)}
.sd.open .fab{transform:rotate(135deg)}
.action{position:absolute;left:6px;bottom:6px;width:36px;height:36px;border-radius:50%;border:0;
  background:#00e0c6;opacity:0;transform:scale(0);
  transition:transform .32s cubic-bezier(.34,1.56,.64,1),opacity .3s}
.sd.open .action{opacity:1;transform:translate(var(--x),var(--y)) scale(1)}
</style>
<script>
const sd=document.querySelector('.sd');
const acts=[...document.querySelectorAll('.action')];
const r=70;
acts.forEach((a,i)=>{ const ang=-Math.PI/2 - i*(Math.PI/2)/(acts.length-1);
  a.style.setProperty('--x', Math.cos(ang)*r+'px');
  a.style.setProperty('--y', Math.sin(ang)*r+'px');
  a.style.transitionDelay=(i*0.05)+'s'; });
sd.querySelector('.fab').addEventListener('click',()=>sd.classList.toggle('open'));
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='position:relative;width:100%;height:100%;background:#0a0a14;overflow:hidden';
    const icons=['&#9733;','&#9829;','&#9993;','&#9881;'];
    let actHtml='';for(let i=0;i<4;i++)actHtml+='<button class="nsd-a">'+icons[i]+'</button>';
    s.innerHTML='<style>'
      +'.nsd{position:absolute;right:26px;bottom:26px}'
      +'.nsd-fab{width:50px;height:50px;border-radius:50%;border:0;background:#7b5cff;color:#fff;font:300 30px/1 system-ui,sans-serif;cursor:default;box-shadow:0 8px 22px rgba(123,92,255,.45);transition:transform .32s cubic-bezier(.34,1.56,.64,1);display:grid;place-items:center}'
      +'.nsd.open .nsd-fab{transform:rotate(135deg)}'
      +'.nsd-a{position:absolute;left:7px;bottom:7px;width:36px;height:36px;border-radius:50%;border:0;background:#13131f;color:#00e0c6;font-size:15px;display:grid;place-items:center;opacity:0;transform:scale(0);box-shadow:0 4px 14px rgba(0,0,0,.5);transition:transform .32s cubic-bezier(.34,1.56,.64,1),opacity .3s}'
      +'.nsd.open .nsd-a{opacity:1;transform:translate(var(--x),var(--y)) scale(1)}'
      +'.nsd-bd{position:absolute;inset:0;background:rgba(5,5,12,.0);transition:background .3s;pointer-events:none}'
      +'.nsd.open .nsd-bd{background:rgba(5,5,12,.45)}'
      +'</style>'
      +'<div class="nsd-bd"></div>'
      +'<div class="nsd"><button class="nsd-fab">+</button>'+actHtml+'</div>';
    el.appendChild(s);
    const sd=s.querySelector('.nsd');
    const acts=[...s.querySelectorAll('.nsd-a')];
    const R=72;
    acts.forEach((a,i)=>{const ang=-Math.PI/2 - i*(Math.PI/2)/(acts.length-1);
      a.style.setProperty('--x',Math.cos(ang)*R+'px');
      a.style.setProperty('--y',Math.sin(ang)*R+'px');
      a.style.transitionDelay=(i*0.05)+'s';});
    let open=false;const toggle=()=>{open=!open;sd.classList.toggle('open',open);};
    toggle();
    const t=setInterval(toggle,1900);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
