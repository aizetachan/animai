/** @type {import('../types.js').Effect} */
const effect = {
  id:'mi-otp-input', title:'OTP Input', cat:'Micro-interacciones',
  tags:['otp','codigo','code','input','caret','verificacion','pin'],
  desc:'Cuatro cajas de codigo OTP que se rellenan una a una con un caret parpadeante y resaltado de la caja activa.',
  meta:['CSS+JS','caret'],
  prompt:`Crea un campo OTP de 4 cajas cuadradas.
Estructura: un contenedor flex con 4 divs .box; cada caja con borde, esquinas redondeadas y la cifra centrada.
La caja activa tiene borde de color de acento (#7b5cff), un glow box-shadow y un caret: un pseudo-elemento o div fino vertical que parpadea con @keyframes (opacity 1->0) cada ~1s.
Logica JS: rellena las cajas una a una con un digito; mueve la caja activa a la siguiente; al completar las 4, marca todas en color secundario (#00e0c6) por un momento y reinicia el ciclo. Usa setTimeout encadenado o un indice incremental.`,
  code:`<div class="otp">
  <div class="box"></div><div class="box"></div>
  <div class="box"></div><div class="box"></div>
</div>
<style>
.otp{display:flex;gap:10px}
.otp .box{width:46px;height:56px;display:grid;place-items:center;
  border:2px solid #2a2a3a;border-radius:10px;color:#fff;font:700 26px system-ui;
  background:#101018;transition:border-color .2s,box-shadow .2s}
.otp .box.active{border-color:#7b5cff;box-shadow:0 0 0 3px rgba(123,92,255,.25)}
.otp .box.active::after{content:'';width:2px;height:26px;background:#7b5cff;
  animation:otpCaret 1s steps(1,end) infinite}
.otp .box.done{border-color:#00e0c6}
@keyframes otpCaret{50%{opacity:0}}
</style>
<script>
const boxes=[...document.querySelectorAll('.otp .box')];
const digits=['4','9','2','7'];let i=0;
function step(){
  boxes.forEach((b,k)=>b.classList.toggle('active',k===i));
  if(i<digits.length){boxes[i].textContent=digits[i];i++;setTimeout(step,650);}
  else{boxes.forEach(b=>{b.classList.remove('active');b.classList.add('done')});
    setTimeout(()=>{boxes.forEach(b=>{b.textContent='';b.classList.remove('done')});i=0;step();},1200);}
}
step();
</scr` + `ipt>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'.otpWrap{display:flex;gap:10px}'
      +'.otpWrap .box{width:42px;height:52px;display:grid;place-items:center;border:2px solid #2a2a3a;border-radius:10px;color:#fff;font:700 24px system-ui;background:#101018;transition:border-color .2s,box-shadow .2s}'
      +'.otpWrap .box.active{border-color:#7b5cff;box-shadow:0 0 0 3px rgba(123,92,255,.25)}'
      +'.otpWrap .box.active::after{content:"";width:2px;height:24px;background:#7b5cff;animation:miOtpCaret 1s steps(1,end) infinite}'
      +'.otpWrap .box.done{border-color:#00e0c6}'
      +'@keyframes miOtpCaret{50%{opacity:0}}'
      +'</style><div class="otpWrap"><div class="box"></div><div class="box"></div><div class="box"></div><div class="box"></div></div>';
    el.appendChild(s);
    const boxes=[...s.querySelectorAll('.box')];
    const digits=['4','9','2','7'];let i=0;let t=null;
    function step(){
      boxes.forEach((b,k)=>b.classList.toggle('active',k===i));
      if(i<digits.length){boxes[i].textContent=digits[i];i++;t=setTimeout(step,650);}
      else{boxes.forEach(b=>{b.classList.remove('active');b.classList.add('done')});
        t=setTimeout(()=>{boxes.forEach(b=>{b.textContent='';b.classList.remove('done')});i=0;step();},1200);}
    }
    step();
    return{stop(){if(t)clearTimeout(t);el.innerHTML='';}};
  }
};
export default effect;
