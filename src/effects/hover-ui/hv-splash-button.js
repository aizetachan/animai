/** @type {import('../types.js').Effect} */
const effect = {
  id:'hv-splash-button', title:'Splash Button', cat:'Hover & UI',
  tags:['splash','button','botón','liquid','líquido','gotas','droplets','click'],
  desc:'Botón que al pulsar emite una salpicadura líquida con gotas radiales y una onda expansiva.',
  meta:['transform','particles','CSS+JS'],
  prompt:`Crea un botón con efecto de salpicadura líquida al hacer click.
Elementos: un botón pill con texto y, dentro, una onda expansiva (un círculo) más varias gotas pequeñas posicionadas en el centro con position:absolute.
Técnica: al pulsar, el botón hace un micro-rebote (scale 0.94 → 1) y se dispara la onda: un @keyframes que va de scale(0) opacity .5 a scale(2.4) opacity 0. En paralelo cada gota sale despedida en un ángulo distinto usando transform:rotate(var(--a)) translateY(-radio) con @keyframes que termina en scale(0) opacity 0; reduce el radio en gotas alternas para dar volumen.
Timings: rebote 250ms ease, onda 600ms ease-out, gotas 550ms cubic-bezier salida. Resetea las clases con offsetWidth para poder repetir el ciclo.`,
  code:`<button class="splash"><span>Splash</span><i class="ripple"></i><i class="drop"></i><i class="drop"></i><i class="drop"></i><i class="drop"></i><i class="drop"></i><i class="drop"></i></button>
<style>
.splash{position:relative;border:0;cursor:pointer;padding:14px 30px;border-radius:999px;font-weight:700;color:#fff;background:linear-gradient(135deg,#7b5cff,#00e0c6);overflow:visible;transition:transform .25s}
.splash.on{animation:spBounce .25s ease}
@keyframes spBounce{0%{transform:scale(.94)}100%{transform:scale(1)}}
.splash .ripple{position:absolute;top:50%;left:50%;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;background:radial-gradient(circle,#fff8,#fff0);opacity:0;pointer-events:none}
.splash.on .ripple{animation:spRipple .6s ease-out}
@keyframes spRipple{0%{transform:scale(0);opacity:.5}100%{transform:scale(2.4);opacity:0}}
.splash .drop{position:absolute;top:50%;left:50%;width:10px;height:10px;margin:-5px;border-radius:50%;background:#00e0c6;opacity:0;pointer-events:none}
.splash .drop:nth-child(3){--a:0deg;--r:46px;background:#7b5cff}
.splash .drop:nth-child(4){--a:60deg;--r:34px}
.splash .drop:nth-child(5){--a:120deg;--r:46px;background:#7b5cff}
.splash .drop:nth-child(6){--a:180deg;--r:34px}
.splash .drop:nth-child(7){--a:240deg;--r:46px;background:#7b5cff}
.splash .drop:nth-child(8){--a:300deg;--r:34px}
.splash.on .drop{animation:spDrop .55s cubic-bezier(.2,.7,.3,1)}
@keyframes spDrop{0%{transform:rotate(var(--a)) translateY(0) scale(1);opacity:1}100%{transform:rotate(var(--a)) translateY(calc(-1*var(--r))) scale(0);opacity:0}}
</style>
<script>
const b=document.querySelector('.splash');
b.addEventListener('click',()=>{b.classList.remove('on');void b.offsetWidth;b.classList.add('on');});
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes hsbBounce{0%{transform:scale(.94)}100%{transform:scale(1)}}'
      +'@keyframes hsbRipple{0%{transform:scale(0);opacity:.5}100%{transform:scale(2.4);opacity:0}}'
      +'@keyframes hsbDrop{0%{transform:rotate(var(--a)) translateY(0) scale(1);opacity:1}100%{transform:rotate(var(--a)) translateY(calc(-1*var(--r))) scale(0);opacity:0}}'
      +'.hsb{position:relative;border:0;padding:14px 30px;border-radius:999px;font-weight:700;color:#fff;background:linear-gradient(135deg,#7b5cff,#00e0c6);font-size:15px}'
      +'.hsb.on{animation:hsbBounce .25s ease}'
      +'.hsb .ripple{position:absolute;top:50%;left:50%;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;background:radial-gradient(circle,#ffffffcc,#ffffff00);opacity:0;pointer-events:none}'
      +'.hsb.on .ripple{animation:hsbRipple .6s ease-out}'
      +'.hsb .drop{position:absolute;top:50%;left:50%;width:10px;height:10px;margin:-5px;border-radius:50%;background:#00e0c6;opacity:0;pointer-events:none}'
      +'.hsb .drop:nth-child(3){--a:0deg;--r:46px;background:#7b5cff}.hsb .drop:nth-child(4){--a:60deg;--r:34px}.hsb .drop:nth-child(5){--a:120deg;--r:46px;background:#7b5cff}.hsb .drop:nth-child(6){--a:180deg;--r:34px}.hsb .drop:nth-child(7){--a:240deg;--r:46px;background:#7b5cff}.hsb .drop:nth-child(8){--a:300deg;--r:34px}'
      +'.hsb.on .drop{animation:hsbDrop .55s cubic-bezier(.2,.7,.3,1)}'
      +'</style>'
      +'<button class="hsb"><span>Splash</span><i class="ripple"></i><i class="drop"></i><i class="drop"></i><i class="drop"></i><i class="drop"></i><i class="drop"></i><i class="drop"></i></button>';
    el.appendChild(s);
    const b=s.querySelector('.hsb');
    const fire=()=>{b.classList.remove('on');void b.offsetWidth;b.classList.add('on');};
    fire();
    const t=setInterval(fire,1500);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
