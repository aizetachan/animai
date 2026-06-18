/** @type {import('../types.js').Effect} */
const effect = {
  id:'mi-download-progress', title:'Download Progress', cat:'Micro-interacciones',
  tags:['button','download','progress','circular','check','loading','micro'],
  desc:'Botón que se contrae a un anillo de progreso circular y al terminar muestra un check (auto-demo).',
  meta:['conic-gradient','transition','JS demo'],
  prompt:`Crea un botón de descarga que muta en tres estados.
1) Estado idle: botón pill ancho con texto "Descargar".
2) Al pulsar, el botón se contrae a un círculo (width igual al height, border-radius:50%) ocultando el texto, y muestra un anillo de progreso usando background:conic-gradient(color 0%..N%, pista) recortado por mask:radial-gradient para dejar solo el aro. El porcentaje sube de 0 a 100 con un setInterval.
3) Al llegar a 100% el anillo se llena de color sólido y aparece un check (✓) con un pop (scale 0->1, cubic-bezier de rebote).
Después vuelve al estado idle para repetir. Usa transition para morphing de tamaño/forma y un contador JS para el progreso.`,
  code:`<button class="dlbtn"><span class="lbl">Descargar</span><span class="ring"></span><span class="check">✓</span></button>
<style>
.dlbtn{position:relative;width:160px;height:48px;border:0;border-radius:999px;
  background:#7b5cff;color:#fff;font-weight:700;cursor:pointer;overflow:hidden;
  transition:width .4s cubic-bezier(.65,0,.35,1),border-radius .4s,background .3s;}
.dlbtn.loading{width:48px;border-radius:50%;background:#161622;}
.dlbtn.done{background:#00e0c6;}
.lbl{transition:opacity .2s;}
.dlbtn.loading .lbl,.dlbtn.done .lbl{opacity:0;}
.ring{position:absolute;inset:6px;border-radius:50%;opacity:0;
  background:conic-gradient(#7b5cff var(--p,0%),#2a2a3a 0);
  -webkit-mask:radial-gradient(farthest-side,#0000 calc(100% - 4px),#000 0);
          mask:radial-gradient(farthest-side,#0000 calc(100% - 4px),#000 0);}
.dlbtn.loading .ring{opacity:1;}
.check{position:absolute;inset:0;display:grid;place-items:center;font-size:22px;color:#07070d;
  transform:scale(0);transition:transform .4s cubic-bezier(.34,1.56,.64,1);}
.dlbtn.done .check{transform:scale(1);}
</style>
<script>
const b=document.querySelector('.dlbtn'),ring=b.querySelector('.ring');
b.addEventListener('click',()=>{
  b.classList.add('loading');let p=0;
  const id=setInterval(()=>{p+=4;ring.style.setProperty('--p',p+'%');
    if(p>=100){clearInterval(id);b.classList.remove('loading');b.classList.add('done');}},40);
});
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'.miDlBtn{position:relative;width:150px;height:46px;border:0;border-radius:999px;background:#7b5cff;color:#fff;font-weight:700;font-size:14px;cursor:pointer;overflow:hidden;transition:width .4s cubic-bezier(.65,0,.35,1),border-radius .4s,background .3s}'
      +'.miDlBtn.loading{width:46px;border-radius:50%;background:#161622}'
      +'.miDlBtn.done{background:#00e0c6}'
      +'.miDlLbl{transition:opacity .2s}'
      +'.miDlBtn.loading .miDlLbl,.miDlBtn.done .miDlLbl{opacity:0}'
      +'.miDlRing{position:absolute;inset:6px;border-radius:50%;opacity:0;background:conic-gradient(#7b5cff var(--p,0%),#2a2a3a 0);-webkit-mask:radial-gradient(farthest-side,#0000 calc(100% - 4px),#000 0);mask:radial-gradient(farthest-side,#0000 calc(100% - 4px),#000 0)}'
      +'.miDlBtn.loading .miDlRing{opacity:1}'
      +'.miDlChk{position:absolute;inset:0;display:grid;place-items:center;font-size:22px;color:#07070d;transform:scale(0);transition:transform .4s cubic-bezier(.34,1.56,.64,1)}'
      +'.miDlBtn.done .miDlChk{transform:scale(1)}'
      +'</style>'
      +'<button class="miDlBtn"><span class="miDlLbl">Descargar</span><span class="miDlRing"></span><span class="miDlChk">✓</span></button>';
    el.appendChild(s);
    const b=s.querySelector('.miDlBtn'),ring=s.querySelector('.miDlRing');
    let prog,reset,start;
    function run(){
      b.classList.remove('done');b.classList.add('loading');
      ring.style.setProperty('--p','0%');let p=0;
      prog=setInterval(()=>{
        p+=4;ring.style.setProperty('--p',p+'%');
        if(p>=100){
          clearInterval(prog);
          b.classList.remove('loading');b.classList.add('done');
          reset=setTimeout(()=>{b.classList.remove('done');start=setTimeout(run,500);},1200);
        }
      },35);
    }
    start=setTimeout(run,500);
    return{stop(){clearInterval(prog);clearTimeout(reset);clearTimeout(start);el.innerHTML='';}};
  }
};
export default effect;
