/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-honeycomb', title:'Honeycomb', cat:'Loaders',
  tags:['css','loader','honeycomb','panal','hexagono','hexagon','pulse'],
  desc:'Siete hexágonos dispuestos en panal que pulsan en secuencia con fade ascendente.',
  meta:['clip-path','0 JS'],
  prompt:`Crea un loader de panal (honeycomb) con 7 hexágonos en puro CSS.
Cada hexágono es un div con clip-path:polygon (forma de hexágono) y color de acento.
Posiciona 7 hexágonos: 1 centro, y 6 alrededor formando el panal, usando position:absolute con transform translate.
Anima cada uno con @keyframes que vaya de opacity .15/scale .8 a opacity 1/scale 1 y vuelva, 2.1s infinite, con animation-delay escalonado (0,.3,.6,...) para crear una onda secuencial.
Sin JS.`,
  code:`.honeycomb { position: relative; width: 120px; height: 110px; }
.hex {
  position: absolute; width: 34px; height: 38px;
  clip-path: polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);
  background: #7b5cff; opacity:.15;
  animation: hc-pulse 2.1s ease-in-out infinite;
}
.hex:nth-child(1){ left:43px; top:0;  animation-delay:0s; }
.hex:nth-child(2){ left:80px; top:18px; animation-delay:.3s; }
.hex:nth-child(3){ left:80px; top:54px; animation-delay:.6s; }
.hex:nth-child(4){ left:43px; top:72px; animation-delay:.9s; }
.hex:nth-child(5){ left:6px;  top:54px; animation-delay:1.2s; }
.hex:nth-child(6){ left:6px;  top:18px; animation-delay:1.5s; }
.hex:nth-child(7){ left:43px; top:36px; animation-delay:1.8s; background:#00e0c6; }
@keyframes hc-pulse {
  0%,100% { opacity:.15; transform:scale(.8); }
  50%     { opacity:1;   transform:scale(1); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'+
      '.ldhc{position:relative;width:120px;height:110px}'+
      '.ldhc-hex{position:absolute;width:34px;height:38px;clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);background:#7b5cff;opacity:.15;animation:ldhcPulse 2.1s ease-in-out infinite}'+
      '.ldhc-hex:nth-child(1){left:43px;top:0;animation-delay:0s}'+
      '.ldhc-hex:nth-child(2){left:80px;top:18px;animation-delay:.3s}'+
      '.ldhc-hex:nth-child(3){left:80px;top:54px;animation-delay:.6s}'+
      '.ldhc-hex:nth-child(4){left:43px;top:72px;animation-delay:.9s}'+
      '.ldhc-hex:nth-child(5){left:6px;top:54px;animation-delay:1.2s}'+
      '.ldhc-hex:nth-child(6){left:6px;top:18px;animation-delay:1.5s}'+
      '.ldhc-hex:nth-child(7){left:43px;top:36px;animation-delay:1.8s;background:#00e0c6}'+
      '@keyframes ldhcPulse{0%,100%{opacity:.15;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}'+
      '</style>'+
      '<div class="ldhc"><div class="ldhc-hex"></div><div class="ldhc-hex"></div><div class="ldhc-hex"></div><div class="ldhc-hex"></div><div class="ldhc-hex"></div><div class="ldhc-hex"></div><div class="ldhc-hex"></div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
