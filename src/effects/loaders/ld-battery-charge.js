/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-battery-charge', title:'Battery Charging', cat:'Loaders',
  tags:['css','loader','bateria','battery','carga','charging','0 js'],
  desc:'Batería que se rellena en bucle de vacío a lleno con un rayo de carga superpuesto.',
  meta:['keyframes','0 JS'],
  prompt:`Crea un loader de batería cargándose solo con CSS.
Un div rectangular con border redondeado (carcasa) y un pequeño "pin" a la derecha (pseudo-elemento o div). Dentro, una barra de relleno alineada abajo cuya height (o width) crece de 0% a 100% con @keyframes battery-fill ~2s ease-in-out infinite, cambiando el color hacia verde al llenarse.
Superpón un emoji o glifo de rayo (⚡) centrado que parpadea con opacity. Sin JS.`,
  code:`.battery {
  position: relative; width: 70px; height: 36px;
  border: 3px solid #7b5cff; border-radius: 6px; padding: 3px;
  display: flex; align-items: flex-end;
}
.battery::after {
  content:''; position:absolute; right:-7px; top:50%;
  transform: translateY(-50%); width:4px; height:14px;
  background:#7b5cff; border-radius:0 3px 3px 0;
}
.battery .fill {
  width: 100%; background:#00e0c6; border-radius: 3px;
  animation: bat-fill 2s ease-in-out infinite;
}
.battery .bolt {
  position:absolute; inset:0; display:grid; place-items:center;
  font-size:18px; animation: bat-blink 2s ease-in-out infinite;
}
@keyframes bat-fill {
  0% { height:0%; background:#ff5c7b; }
  100% { height:100%; background:#00e0c6; }
}
@keyframes bat-blink { 0%,100%{opacity:.3} 50%{opacity:1} }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes ldBatFill{0%{height:0%;background:#ff5c7b}100%{height:100%;background:#00e0c6}}'
      +'@keyframes ldBatBlink{0%,100%{opacity:.3}50%{opacity:1}}'
      +'</style>'
      +'<div style="position:relative;width:80px;height:42px;border:3px solid #7b5cff;border-radius:7px;padding:3px;display:flex;align-items:flex-end;box-sizing:border-box">'
      +'<div style="position:absolute;right:-8px;top:50%;transform:translateY(-50%);width:5px;height:16px;background:#7b5cff;border-radius:0 3px 3px 0"></div>'
      +'<div style="width:100%;background:#00e0c6;border-radius:3px;animation:ldBatFill 2s ease-in-out infinite"></div>'
      +'<div style="position:absolute;inset:0;display:grid;place-items:center;font-size:20px;color:#fff;animation:ldBatBlink 2s ease-in-out infinite">⚡</div>'
      +'</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
