/** @type {import('../types.js').Effect} */
const effect = {
  id:'tx-vf-proximity', title:'Variable Proximity', cat:'Texto',
  tags:['variable font','proximity','proximidad','cursor','wght','tipografía','hover'],
  desc:'El peso variable de cada letra reacciona a la cercanía del cursor, creando una ola tipográfica que sigue al puntero.',
  meta:['font-variation-settings','pointer distance','JS+Loop'],
  prompt:`Crea un efecto de "proximidad" sobre un texto con variable font.
Elementos: divide la palabra en <span> por letra. Cada span usa una variable font con font-variation-settings 'wght'.
Técnica: en mousemove calcula la distancia entre el cursor y el centro de cada letra. Mapea esa distancia (0..radio) a un peso (900 cerca → 100 lejos) con una caída suave, p.ej. wght = 100 + (1 - clamp(dist/radio,0,1)) * 800. Aplica font-variation-settings:'wght' valor a cada letra cada frame (o en rAF para suavizar).
Para la auto-demo, simula un cursor que recorre el texto de izquierda a derecha y vuelve con un seno, mostrando la ola de pesos.
Timings: lerp suave hacia el peso objetivo (~0.15 por frame) para que el cambio no sea brusco. Radio de influencia ~120px.`,
  code:`<p class="vp">PROXIMITY</p>
<style>
.vp{font-family:'Inter',sans-serif;font-size:48px;color:#eef0f7;display:flex;gap:.02em}
.vp span{font-variation-settings:'wght' 100;transition:font-variation-settings .08s linear}
</style>
<script>
const p=document.querySelector('.vp');
p.innerHTML=[...p.textContent].map(c=>'<span>'+c+'</span>').join('');
const letters=[...p.querySelectorAll('span')];
const R=120;
addEventListener('mousemove',e=>{
  letters.forEach(s=>{
    const r=s.getBoundingClientRect();
    const dx=e.clientX-(r.left+r.width/2), dy=e.clientY-(r.top+r.height/2);
    const d=Math.hypot(dx,dy);
    const w=Math.round(100+(1-Math.min(d/R,1))*800);
    s.style.fontVariationSettings="'wght' "+w;
  });
});
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='position:relative;display:grid;place-items:center;overflow:hidden';
    s.innerHTML='<style>'
      +'.vp-wrap{font-family:Inter,system-ui,sans-serif;font-size:38px;font-weight:600;color:#eef0f7;display:flex;line-height:1}'
      +'.vp-wrap span{display:inline-block;transition:transform .08s linear,color .15s linear}'
      +'.vp-cur{position:absolute;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle,#7b5cff,rgba(123,92,255,0));pointer-events:none;transform:translate(-50%,-50%);filter:blur(1px)}'
      +'</style>'
      +'<div class="vp-wrap">'+[...'PROXIMITY'].map(c=>'<span>'+c+'</span>').join('')+'</div>'
      +'<div class="vp-cur"></div>';
    el.appendChild(s);
    const letters=[...s.querySelectorAll('.vp-wrap span')];
    const cur=s.querySelector('.vp-cur');
    const cur_w=letters.map(()=>200);
    const R=110;
    let raf,t0=performance.now(),running=true;
    function loop(){
      if(!running)return;
      const t=(performance.now()-t0)/1000;
      const W=s.clientWidth,H=s.clientHeight;
      // cursor simulado: barrido horizontal con seno + leve vertical
      const cx=W*(0.5+0.42*Math.sin(t*0.9));
      const cy=H*(0.5+0.12*Math.sin(t*1.7));
      cur.style.left=cx+'px';cur.style.top=cy+'px';
      const box=s.getBoundingClientRect();
      letters.forEach((sp,i)=>{
        const r=sp.getBoundingClientRect();
        const lx=r.left-box.left+r.width/2, ly=r.top-box.top+r.height/2;
        const d=Math.hypot(cx-lx,cy-ly);
        const target=100+(1-Math.min(d/R,1))*800;
        cur_w[i]+=(target-cur_w[i])*0.15;
        const w=Math.round(cur_w[i]);
        const k=(w-100)/800;
        // simulamos peso variable con grosor de texto + escala + acento
        sp.style.fontWeight=String(Math.round(w/100)*100);
        sp.style.transform='scale('+(1+k*0.18)+')';
        sp.style.color=k>0.45?'#7b5cff':'#eef0f7';
        sp.style.textShadow=k>0.6?'0 0 12px rgba(123,92,255,.6)':'none';
      });
      raf=requestAnimationFrame(loop);
    }
    loop();
    return{stop(){running=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
