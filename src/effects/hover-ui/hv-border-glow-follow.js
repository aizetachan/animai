/** @type {import('../types.js').Effect} */
const effect = {
  id:'hv-border-glow-follow', title:'Border Glow Follow', cat:'Hover & UI',
  tags:['border','glow','resplandor','follow','cursor','radial','card','tarjeta'],
  desc:'Resplandor que ilumina el borde de la tarjeta y persigue al cursor con un degradado radial enmascarado.',
  meta:['radial-gradient','mask','cursor'],
  prompt:`Crea una tarjeta cuyo borde se ilumina siguiendo al cursor.
Estructura: una tarjeta con position:relative y una pseudo-capa (o div ::before) en inset:0, border-radius igual, padding de 1.5px que actúa de borde.
Técnica: la capa de borde tiene background:radial-gradient(circle Npx at MOUSEx MOUSEy, color acento, transparent) y se recorta a "solo borde" con mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite:exclude (técnica del marco). Actualiza las variables --mx/--my en mousemove con la posición relativa del cursor para que el punto de luz recorra el perímetro.
Añade un glow externo opcional con box-shadow. El brillo aparece al hover y desaparece al salir.`,
  code:`<div class="glowcard"><div class="content">Hover me</div></div>
<style>
.glowcard{position:relative;border-radius:16px;background:#12121c;padding:1.5px}
.glowcard::before{content:'';position:absolute;inset:0;border-radius:16px;padding:1.5px;
  background:radial-gradient(140px circle at var(--mx,50%) var(--my,50%),#7b5cff,transparent 60%);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:opacity .3s}
.glowcard:hover::before{opacity:1}
.glowcard .content{border-radius:15px;background:#0e0e16;padding:28px}
</style>
<script>
const c=document.querySelector('.glowcard');
c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();
  c.style.setProperty('--mx',(e.clientX-r.left)+'px');
  c.style.setProperty('--my',(e.clientY-r.top)+'px');});
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#08080f';
    s.innerHTML='<style>'
      +'.hbg{position:relative;width:190px;border-radius:16px;background:#12121c;padding:1.5px}'
      +'.hbg::before{content:"";position:absolute;inset:0;border-radius:16px;padding:1.5px;background:radial-gradient(120px circle at var(--mx,50%) var(--my,50%),#7b5cff,#00e0c6 35%,transparent 62%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:opacity .3s}'
      +'.hbg.on::before{opacity:1}'
      +'.hbg .content{position:relative;border-radius:15px;background:#0e0e16;padding:26px 22px;color:#cfcfe6;font-weight:600;text-align:center;font-size:14px}'
      +'</style>'
      +'<div class="hbg"><div class="content">Border Glow</div></div>';
    el.appendChild(s);
    const c=s.querySelector('.hbg');c.classList.add('on');
    let a=0,raf,run=true;
    (function loop(){if(!run)return;a+=.04;
      const w=c.offsetWidth,h=c.offsetHeight;
      // recorre el perímetro: parametrización por el ángulo proyectada al borde
      const cx=w/2,cy=h/2,rx=w/2+10,ry=h/2+10;
      let px=cx+Math.cos(a)*rx,py=cy+Math.sin(a)*ry;
      px=Math.max(0,Math.min(w,px));py=Math.max(0,Math.min(h,py));
      c.style.setProperty('--mx',px+'px');c.style.setProperty('--my',py+'px');
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
