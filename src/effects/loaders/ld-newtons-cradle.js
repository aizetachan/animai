/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-newtons-cradle', title:"Newton's Cradle", cat:'Loaders',
  tags:['css','loader','newton','cradle','pendulo','pendulum','fisica'],
  desc:'Péndulo de Newton: las bolas de los extremos se balancean transfiriendo el impulso.',
  meta:['transform-origin','0 JS'],
  prompt:`Crea un péndulo de Newton (Newton's cradle) en puro CSS.
Cinco "pivotes" en fila, cada uno un div con transform-origin arriba (la cuerda) y una bola con ::after en la parte inferior.
Solo se animan el primero y el último pivote balanceándose con rotate. El primer pivote: @keyframes que va de rotate(0) sube a rotate(-45deg) y vuelve; el último: de rotate(0) a rotate(45deg) y vuelve, en contrafase, con timing que simule la transferencia de impulso (las del medio quietas). Duración ~1.2s infinite. Sin JS.`,
  code:`.cradle { position: relative; width: 150px; height: 90px; display:flex; }
.pivot {
  position: relative; width: 30px; height: 70px;
  transform-origin: top center; display:flex; justify-content:center;
}
.pivot::after {
  content:''; position:absolute; bottom:0; width:1px; height:60px;
  background:#888;
}
.ball {
  position:absolute; bottom:-14px; width:28px; height:28px; border-radius:50%;
  background: radial-gradient(circle at 35% 30%, #cdbcff, #7b5cff);
}
.pivot:first-child { animation: nc-left 1.2s ease-in-out infinite; }
.pivot:last-child  { animation: nc-right 1.2s ease-in-out infinite; }
@keyframes nc-left {
  0%,50%,100% { transform: rotate(0); }
  25% { transform: rotate(-48deg); }
}
@keyframes nc-right {
  0%,50%,100% { transform: rotate(0); }
  75% { transform: rotate(48deg); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    let balls='';
    for(let i=0;i<5;i++){balls+='<div class="ldnc-piv"><span class="ldnc-cord"></span><span class="ldnc-ball"></span></div>';}
    s.innerHTML='<style>'+
      '.ldnc{position:relative;width:150px;height:90px;display:flex}'+
      '.ldnc-piv{position:relative;width:30px;height:70px;transform-origin:top center;display:flex;justify-content:center}'+
      '.ldnc-cord{position:absolute;bottom:0;width:1px;height:60px;background:#888}'+
      '.ldnc-ball{position:absolute;bottom:-14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#cdbcff,#7b5cff)}'+
      '.ldnc-piv:first-child{animation:ldncLeft 1.2s ease-in-out infinite}'+
      '.ldnc-piv:last-child{animation:ldncRight 1.2s ease-in-out infinite}'+
      '@keyframes ldncLeft{0%,50%,100%{transform:rotate(0)}25%{transform:rotate(-48deg)}}'+
      '@keyframes ldncRight{0%,50%,100%{transform:rotate(0)}75%{transform:rotate(48deg)}}'+
      '</style>'+
      '<div class="ldnc">'+balls+'</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
