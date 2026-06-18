/** @type {import('../types.js').Effect} */
const effect = {
  id:'mi-password-meter', title:'Password Strength', cat:'Micro-interacciones',
  tags:['password','contraseña','meter','fuerza','strength','barra','micro'],
  desc:'Barra de fortaleza de contraseña que se rellena y cambia de color de débil a fuerte en bucle.',
  meta:['transition','width','CSS+JS'],
  prompt:`Crea un medidor de fortaleza de contraseña.
Elementos: una pista (track) con bordes redondeados y dentro una barra de relleno (fill) cuyo ancho representa la fortaleza (0-100%). Debajo, una etiqueta de texto con el nivel.
Técnica: clases por nivel (.weak/.medium/.strong) o variables que ajustan el width y el background del fill con transition de ~.4s. Débil = rojo y ~33%, medio = naranja/amarillo y ~66%, fuerte = verde/acento y 100%. La etiqueta cambia de texto y color acorde.
Demo: con un timer recorre los niveles 0→débil→medio→fuerte y reinicia, mostrando el cambio gradual de ancho y color.`,
  code:`<div class="pw">
  <div class="track"><div class="fill"></div></div>
  <span class="label">—</span>
</div>
<style>
.pw{width:200px;font:13px system-ui}
.track{height:8px;border-radius:6px;background:#222;overflow:hidden}
.fill{height:100%;width:0;border-radius:6px;transition:width .4s,background .4s}
.pw.weak .fill{width:33%;background:#ff5d6c}
.pw.medium .fill{width:66%;background:#ffce4d}
.pw.strong .fill{width:100%;background:#00e0c6}
.label{display:block;margin-top:8px;color:#888;transition:color .3s}
.pw.weak .label{color:#ff5d6c}.pw.medium .label{color:#ffce4d}.pw.strong .label{color:#00e0c6}
</style>
<script>
const pw=document.querySelector('.pw'),lbl=pw.querySelector('.label');
const steps=[['','—'],['weak','Débil'],['medium','Media'],['strong','Fuerte']];let i=0;
setInterval(()=>{pw.className='pw '+steps[i][0];lbl.textContent=steps[i][1];i=(i+1)%steps.length;},900);
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'.mipw{width:200px;font:13px system-ui;text-align:center}'
      +'.mipw .track{height:9px;border-radius:6px;background:#1b1b26;overflow:hidden}'
      +'.mipw .fill{height:100%;width:0;border-radius:6px;transition:width .42s,background .42s}'
      +'.mipw.weak .fill{width:33%;background:#ff5d6c}'
      +'.mipw.medium .fill{width:66%;background:#ffce4d}'
      +'.mipw.strong .fill{width:100%;background:#00e0c6}'
      +'.mipw .label{display:block;margin-top:9px;color:#888;transition:color .3s}'
      +'.mipw.weak .label{color:#ff5d6c}.mipw.medium .label{color:#ffce4d}.mipw.strong .label{color:#00e0c6}'
      +'</style>'
      +'<div class="mipw"><div class="track"><div class="fill"></div></div><span class="label">&mdash;</span></div>';
    el.appendChild(s);
    const pw=s.querySelector('.mipw'),lbl=pw.querySelector('.label');
    const steps=[['','—'],['weak','Débil'],['medium','Media'],['strong','Fuerte']];
    let i=0;
    const tick=()=>{pw.className='mipw '+steps[i][0];lbl.textContent=steps[i][1];i=(i+1)%steps.length;};
    tick();
    const t=setInterval(tick,950);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
