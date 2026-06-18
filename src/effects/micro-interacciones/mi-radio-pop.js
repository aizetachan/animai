/** @type {import('../types.js').Effect} */
const effect = {
  id:'mi-radio-pop', title:'Radio Pop', cat:'Micro-interacciones',
  tags:['radio','select','pop','ripple','form','toggle','micro'],
  desc:'Lista de radios donde la selección hace pop del punto interior y emite un ripple expansivo (auto-demo).',
  meta:['transform','keyframes','JS demo'],
  prompt:`Crea un grupo de radio buttons custom. Cada opción es una fila con un círculo (radio) y una etiqueta.
El radio es un div redondo con borde; dentro lleva un punto (dot) en scale(0). Al seleccionar, el borde pasa al color de acento, el dot hace pop (scale 0 -> 1.2 -> 1 con cubic-bezier de rebote) y se dispara un ripple: un círculo absoluto que parte en scale(0) opacity .5 y crece a scale(2.4) opacity 0 mediante @keyframes.
Solo un radio activo a la vez. Anima con transitions para el borde y @keyframes para dot y ripple.`,
  code:`<div class="radios">
  <label class="ro"><span class="dot"></span>Mensual</label>
  <label class="ro"><span class="dot"></span>Anual</label>
  <label class="ro"><span class="dot"></span>Vitalicio</label>
</div>
<style>
.radios{display:flex;flex-direction:column;gap:14px;color:#cfcfe6;font-weight:600;}
.ro{display:flex;align-items:center;gap:10px;cursor:pointer;}
.dot{position:relative;width:22px;height:22px;border-radius:50%;border:2px solid #44445e;
  transition:border-color .25s;display:grid;place-items:center;}
.dot::before{content:"";width:11px;height:11px;border-radius:50%;background:#7b5cff;transform:scale(0);}
.ro.on .dot{border-color:#7b5cff;}
.ro.on .dot::before{animation:rpPop .4s cubic-bezier(.34,1.56,.64,1) forwards;}
.ro.on .dot::after{content:"";position:absolute;inset:-2px;border-radius:50%;background:#7b5cff;
  animation:rpRipple .55s ease-out;}
@keyframes rpPop{0%{transform:scale(0)}60%{transform:scale(1.25)}100%{transform:scale(1)}}
@keyframes rpRipple{0%{transform:scale(0);opacity:.5}100%{transform:scale(2.4);opacity:0}}
</style>
<script>
const ros=[...document.querySelectorAll('.ro')];
ros.forEach(r=>r.onclick=()=>{ros.forEach(x=>x.classList.remove('on'));r.classList.add('on');});
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'.miRp{display:flex;flex-direction:column;gap:14px;color:#cfcfe6;font-weight:600;font-size:14px}'
      +'.miRpRo{display:flex;align-items:center;gap:10px;cursor:pointer}'
      +'.miRpDot{position:relative;width:22px;height:22px;border-radius:50%;border:2px solid #44445e;transition:border-color .25s;display:grid;place-items:center}'
      +'.miRpDot::before{content:"";width:11px;height:11px;border-radius:50%;background:#7b5cff;transform:scale(0)}'
      +'.miRpRo.on .miRpDot{border-color:#7b5cff}'
      +'.miRpRo.on .miRpDot::before{animation:miRpPop .4s cubic-bezier(.34,1.56,.64,1) forwards}'
      +'.miRpRo.on .miRpDot::after{content:"";position:absolute;inset:-2px;border-radius:50%;background:#7b5cff;animation:miRpRipple .55s ease-out}'
      +'@keyframes miRpPop{0%{transform:scale(0)}60%{transform:scale(1.25)}100%{transform:scale(1)}}'
      +'@keyframes miRpRipple{0%{transform:scale(0);opacity:.5}100%{transform:scale(2.4);opacity:0}}'
      +'</style>'
      +'<div class="miRp">'
      +'<label class="miRpRo"><span class="miRpDot"></span>Mensual</label>'
      +'<label class="miRpRo"><span class="miRpDot"></span>Anual</label>'
      +'<label class="miRpRo"><span class="miRpDot"></span>Vitalicio</label>'
      +'</div>';
    el.appendChild(s);
    const ros=[...s.querySelectorAll('.miRpRo')];
    let i=0,timer;
    function pick(){
      ros.forEach(x=>x.classList.remove('on'));
      const r=ros[i%ros.length];
      // force reflow para reiniciar keyframes
      void r.offsetWidth;
      r.classList.add('on');
      i++;
    }
    pick();
    timer=setInterval(pick,1400);
    return{stop(){clearInterval(timer);el.innerHTML='';}};
  }
};
export default effect;
