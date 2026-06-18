/** @type {import('../types.js').Effect} */
const effect = {
  id:'txt-vertical-ticker', title:'Vertical News Ticker', cat:'Texto',
  tags:['ticker','vertical','noticias','rotar','subir','loop','lista'],
  desc:'Ítems que suben en bucle mostrando uno cada vez, como un teletipo vertical. News ticker.',
  meta:['translateY','loop','Ticker'],
  prompt:`Crea un "ticker vertical": una ventana de una línea donde los mensajes/ítems suben uno tras otro en bucle (el actual sale por arriba mientras entra el siguiente por abajo), con una breve pausa en cada uno.
Una pila de líneas con overflow:hidden; anima translateY en pasos de la altura de línea, con pausa entre pasos. Loop infinito (duplica el primero al final).
Para titulares, anuncios rotativos, estados o highlights.`,
  code:`/* Vertical ticker (sube en pasos con pausa) */
.ticker-track {
  animation: scroll 8s steps(4) infinite; /* 4 ítems */
}
@keyframes scroll {
  /* cada paso translateY(-100%) con pausa via steps + easing */
  to { transform: translateY(-400%); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<div style="display:flex;align-items:center;gap:10px"><span style="background:#ff5ca8;color:#fff;font-size:10px;font-weight:800;padding:3px 8px;border-radius:4px;letter-spacing:.05em">LIVE</span><div id="tk" style="height:24px;overflow:hidden;width:170px"></div></div>';
    el.appendChild(s);const tk=s.querySelector('#tk');const items=['Nuevo proyecto lanzado','+12% de conversión','Reseña 5★ recibida','3 clientes nuevos'];const track=document.createElement('div');track.style.cssText='transition:transform .5s cubic-bezier(.5,1.4,.4,1)';items.concat(items[0]).forEach(it=>{const d=document.createElement('div');d.textContent=it;d.style.cssText='height:24px;line-height:24px;color:#eef0f7;font-size:13px;font-weight:600;white-space:nowrap';track.appendChild(d);});tk.appendChild(track);
    let i=0,raf,run=true,t=0;
    (function loop(){if(!run)return;t++;if(t%55===0){i++;track.style.transition='transform .5s cubic-bezier(.5,1.4,.4,1)';track.style.transform='translateY(-'+(i*24)+'px)';if(i>=items.length){setTimeout(()=>{track.style.transition='none';i=0;track.style.transform='translateY(0)';},520);}}raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
