/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-pacman', title:'Pac-Man', cat:'Loaders',
  tags:['css','loader','pacman','dots','retro','game','0 js'],
  desc:'Un Pac-Man que abre y cierra la boca mientras una hilera de puntos avanza hacia él.',
  meta:['border-triangles','keyframes','0 JS'],
  prompt:`Crea un loader de Pac-Man.
El Pac-Man se dibuja con dos semicírculos (borders gruesos con border-radius) cuya parte superior e inferior abren/cierran con @keyframes (rotación de los bordes). A su derecha, varios puntos con animación de translateX que los hace "entrar" hacia la boca con delays escalonados.`,
  code:`.pac { position:relative; width:64px; height:32px; }
.pac .top, .pac .bot { width:0; height:0; border:16px solid #7b5cff; border-radius:50%; position:absolute; }
.pac .top { border-bottom-color:transparent; animation: pTop .6s linear infinite; }
.pac .bot { border-top-color:transparent; top:0; animation: pBot .6s linear infinite; }
.pac i { position:absolute; top:13px; left:48px; width:7px; height:7px; border-radius:50%; background:#00e0c6; animation: pDot 1.2s linear infinite; }
@keyframes pTop { 0%,100%{ transform:rotate(0) } 50%{ transform:rotate(-35deg) } }
@keyframes pBot { 0%,100%{ transform:rotate(0) } 50%{ transform:rotate(35deg) } }
@keyframes pDot { from{ transform:translateX(20px); opacity:1 } to{ transform:translateX(-44px); opacity:1 } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    let dots='';for(let i=0;i<3;i++)dots+=`<i style="position:absolute;top:13px;left:50px;width:8px;height:8px;border-radius:50%;background:#00e0c6;animation:ldPDot 1.2s linear infinite;animation-delay:${-i*0.4}s"></i>`;
    s.innerHTML=`<style>@keyframes ldPTop{0%,100%{transform:rotate(0)}50%{transform:rotate(-35deg)}}@keyframes ldPBot{0%,100%{transform:rotate(0)}50%{transform:rotate(35deg)}}@keyframes ldPDot{from{transform:translateX(16px)}to{transform:translateX(-46px)}}</style>`+
      `<div style="position:relative;width:64px;height:32px">`+
      `<div style="width:0;height:0;border:16px solid #7b5cff;border-radius:50%;border-bottom-color:transparent;position:absolute;transform-origin:50% 100%;animation:ldPTop .6s linear infinite"></div>`+
      `<div style="width:0;height:0;border:16px solid #7b5cff;border-radius:50%;border-top-color:transparent;position:absolute;top:0;transform-origin:50% 0;animation:ldPBot .6s linear infinite"></div>`+
      `${dots}</div>`;
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
