/** @type {import('../types.js').Effect} */
const effect = {
  id:'art-rainy-window', title:'Rainy Window', cat:'CSS Art',
  tags:['css','lluvia','rain','window','cristal','gotas','drops'],
  desc:'Gotas y regueros de lluvia resbalando sobre un cristal con desenfoque, en CSS animado.',
  meta:['radial-gradient','keyframes','CSS'],
  prompt:`Crea un cristal lluvioso solo con CSS sobre un fondo oscuro azulado.
Usa un contenedor con fondo de gradiente nocturno. Encima coloca muchas "gotas": elementos alargados creados con radial-gradient (brillo en una esquina para simular reflejo de luz) que caen.
Anima cada gota con @keyframes que mueven translateY de arriba hacia abajo, variando scaleY y opacidad, con distintos delays y duraciones para que parezca lluvia aleatoria.
Agrega un blur sutil (filter:blur) para el efecto empañado del cristal. Sin JS.`,
  code:`.window {
  width: 240px; height: 180px; border-radius: 14px; overflow: hidden;
  background: linear-gradient(160deg, #0a1430, #122046 60%, #07101f);
  position: relative; filter: blur(.3px);
}
.drop {
  position: absolute; top: -20px;
  width: 6px; height: 18px; border-radius: 50%;
  background: radial-gradient(circle at 35% 25%, rgba(255,255,255,.9), rgba(123,92,255,.45) 60%, transparent);
  animation: rwFall linear infinite;
}
@keyframes rwFall {
  0%   { transform: translateY(-20px) scaleY(.6); opacity:0; }
  10%  { opacity:.9; }
  100% { transform: translateY(200px) scaleY(1.5); opacity:0; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    let drops='';
    for(let i=0;i<26;i++){
      const left=(Math.random()*94+2).toFixed(1);
      const dur=(Math.random()*1.6+1.4).toFixed(2);
      const delay=(Math.random()*-3).toFixed(2);
      const w=(Math.random()*4+3).toFixed(1);
      const h=(Math.random()*16+10).toFixed(1);
      drops+='<i class="rwd" style="left:'+left+'%;width:'+w+'px;height:'+h+'px;animation-duration:'+dur+'s;animation-delay:'+delay+'s"></i>';
    }
    s.innerHTML='<style>@keyframes rwFall{0%{transform:translateY(-22px) scaleY(.6);opacity:0}10%{opacity:.9}100%{transform:translateY(190px) scaleY(1.5);opacity:0}}.rwd{position:absolute;top:-20px;border-radius:50%;background:radial-gradient(circle at 35% 25%,rgba(255,255,255,.92),rgba(0,224,198,.4) 55%,transparent);animation:rwFall linear infinite}</style><div style="width:236px;height:176px;border-radius:14px;overflow:hidden;background:linear-gradient(160deg,#0a1430,#122046 60%,#07101f);position:relative;filter:blur(.3px)">'+drops+'</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
