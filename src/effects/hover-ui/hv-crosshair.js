/** @type {import('../types.js').Effect} */
const effect = {
  id:'hv-crosshair', title:'Crosshair', cat:'Hover & UI',
  tags:['crosshair','mira','cursor','lines','retícula','aim','target'],
  desc:'Mira tipo crosshair que sigue al cursor con líneas que cruzan hasta los bordes y coordenadas.',
  meta:['cursor','lines','transform'],
  prompt:`Crea un cursor personalizado tipo "crosshair" (mira) que sigue al puntero dentro de un contenedor.
Elementos: dos líneas finas (1px) en position:absolute, una horizontal a todo el ancho y otra vertical a todo el alto, más un círculo pequeño en el centro de la mira. Opcional: una etiqueta con las coordenadas X/Y.
Técnica: oculta el cursor nativo (cursor:none). En mousemove obtén la posición relativa al contenedor; mueve la línea horizontal con top=y, la vertical con left=x, y centra el círculo con transform:translate(-50%,-50%) en (x,y). Color de acento #7b5cff con un leve glow (box-shadow). Al salir, atenúa todo con opacity 0.
Timings: usa transition corta (~80ms) en las líneas para un seguimiento suave. La etiqueta muestra round(x), round(y).`,
  code:`<div class="ch"><div class="ch-h"></div><div class="ch-v"></div><div class="ch-dot"></div><span class="ch-xy"></span></div>
<style>
.ch{position:relative;width:100%;height:100%;cursor:none;overflow:hidden}
.ch-h{position:absolute;left:0;width:100%;height:1px;background:#7b5cff;box-shadow:0 0 6px #7b5cff;opacity:0;transition:top .08s,opacity .2s}
.ch-v{position:absolute;top:0;width:1px;height:100%;background:#7b5cff;box-shadow:0 0 6px #7b5cff;opacity:0;transition:left .08s,opacity .2s}
.ch-dot{position:absolute;width:18px;height:18px;border:1px solid #00e0c6;border-radius:50%;transform:translate(-50%,-50%);opacity:0;transition:opacity .2s}
.ch-xy{position:absolute;font:11px monospace;color:#00e0c6;opacity:0}
</style>
<script>
const box=document.querySelector('.ch'),h=box.querySelector('.ch-h'),v=box.querySelector('.ch-v'),d=box.querySelector('.ch-dot'),xy=box.querySelector('.ch-xy');
box.addEventListener('mousemove',e=>{const r=box.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  h.style.top=y+'px';v.style.left=x+'px';d.style.left=x+'px';d.style.top=y+'px';xy.style.left=(x+14)+'px';xy.style.top=(y+14)+'px';xy.textContent=Math.round(x)+', '+Math.round(y);
  [h,v,d,xy].forEach(n=>n.style.opacity=1);});
box.addEventListener('mouseleave',()=>[h,v,d,xy].forEach(n=>n.style.opacity=0));
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='position:relative;overflow:hidden;background:#0a0a14;cursor:none';
    s.innerHTML='<style>'
      +'.hvch-h{position:absolute;left:0;width:100%;height:1px;background:#7b5cff;box-shadow:0 0 6px #7b5cff;transition:top .08s ease-out}'
      +'.hvch-v{position:absolute;top:0;width:1px;height:100%;background:#7b5cff;box-shadow:0 0 6px #7b5cff;transition:left .08s ease-out}'
      +'.hvch-dot{position:absolute;width:18px;height:18px;border:1px solid #00e0c6;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 8px rgba(0,224,198,.5)}'
      +'.hvch-xy{position:absolute;font:11px monospace;color:#00e0c6;text-shadow:0 0 4px rgba(0,224,198,.6)}'
      +'.hvch-grid{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(123,92,255,.12),transparent 70%)}'
      +'</style>'
      +'<div class="hvch-grid"></div><div class="hvch-h"></div><div class="hvch-v"></div><div class="hvch-dot"></div><span class="hvch-xy"></span>';
    el.appendChild(s);
    const h=s.querySelector('.hvch-h'),v=s.querySelector('.hvch-v'),d=s.querySelector('.hvch-dot'),xy=s.querySelector('.hvch-xy');
    let a=0,raf,run=true;
    (function loop(){
      if(!run)return;
      a+=.022;
      const W=el.clientWidth,H=el.clientHeight;
      const x=W*(.5+Math.cos(a)*.34), y=H*(.5+Math.sin(a*1.6)*.34);
      h.style.top=y+'px';v.style.left=x+'px';
      d.style.left=x+'px';d.style.top=y+'px';
      xy.style.left=(x+14)+'px';xy.style.top=(y+14)+'px';
      xy.textContent=Math.round(x)+', '+Math.round(y);
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
