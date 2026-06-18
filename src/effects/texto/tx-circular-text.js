/** @type {import('../types.js').Effect} */
const effect = {
  id:'tx-circular-text', title:'Circular Text', cat:'Texto',
  tags:['circular','rotate','badge','sello','tipografía','ring','loop'],
  desc:'Texto dispuesto en círculo, cada letra rotada hacia el centro, girando de forma continua como un sello.',
  meta:['transform rotate','radius','Loop'],
  prompt:`Crea un texto circular tipo sello/badge que rota en bucle.
Elementos: un contenedor cuadrado relativo. Por cada letra crea un <span> en position:absolute centrado (left/top 50%), y aplícale transform: rotate(angulo) translateY(-radio), donde angulo = i * (360 / nLetras). Así cada letra queda sobre la circunferencia mirando hacia fuera; transform-origin en el centro del contenedor.
Anima el contenedor con @keyframes rotate 360deg infinite linear (~12s) para que todo el anillo gire.
Detalle de marca: usa una fuente de peso medio, color claro, y opcionalmente un punto/estrella separador entre frases. Centra un icono o punto acento en el medio.`,
  code:`<div class="circ"><span class="ring"></span><span class="dot"></span></div>
<style>
.circ{position:relative;width:160px;height:160px;animation:ct-spin 12s linear infinite}
.circ .ch{position:absolute;left:50%;top:50%;font:600 15px/1 'Inter',sans-serif;color:#eef0f7;
  transform-origin:0 0}
.dot{position:absolute;left:50%;top:50%;width:10px;height:10px;border-radius:50%;
  background:#7b5cff;transform:translate(-50%,-50%)}
@keyframes ct-spin{to{transform:rotate(360deg)}}
</style>
<script>
const t=' ANIMAI • EFFECTS CATALOG • ';
const ring=document.querySelector('.circ');
[...t].forEach((c,i)=>{
  const a=i*(360/t.length);
  const s=document.createElement('span');s.className='ch';s.textContent=c;
  s.style.transform='rotate('+a+'deg) translateY(-72px)';
  ring.appendChild(s);
});
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes ctxspin{to{transform:rotate(360deg)}}'
      +'.ctx-ring{position:relative;width:150px;height:150px;animation:ctxspin 12s linear infinite}'
      +'.ctx-ring .ctx-ch{position:absolute;left:50%;top:50%;font:600 14px/1 Inter,system-ui,sans-serif;color:#eef0f7;transform-origin:0 0}'
      +'.ctx-dot{position:absolute;left:50%;top:50%;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle,#7b5cff,#00e0c6);box-shadow:0 0 14px rgba(123,92,255,.6);transform:translate(-50%,-50%)}'
      +'</style>'
      +'<div class="ctx-ring"><span class="ctx-dot"></span></div>';
    el.appendChild(s);
    const ring=s.querySelector('.ctx-ring');
    const text=' ANIMAI • EFFECTS CATALOG •';
    const n=text.length, radius=66;
    [...text].forEach((c,i)=>{
      const a=i*(360/n);
      const sp=document.createElement('span');sp.className='ctx-ch';sp.textContent=c;
      // posiciona el origen en el centro, rota y empuja al radio
      sp.style.transform='rotate('+a+'deg) translate(-50%,-'+radius+'px)';
      ring.appendChild(sp);
    });
    return{stop(){el.innerHTML='';}};
  }
};
export default effect;
