/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-bouncing-ball', title:'Bouncing Ball', cat:'Loaders',
  tags:['css','loader','ball','bounce','pelota','squash','física','0 js'],
  desc:'Una pelota que bota con squash & stretch y una sombra que se achata al impactar.',
  meta:['translateY','scale','shadow','0 JS'],
  prompt:`Crea un loader de pelota que bota con física creíble.
La pelota hace translateY con timing ease (cubic-bezier que acelera al caer) y, al tocar el suelo, un scale(1.2,0.8) de squash. Una sombra (elipse oscura) cambia de scale/opacity sincronizada con la altura. Loop ~0.6s.`,
  code:`.bb { position:relative; width:60px; height:60px; }
.bb .ball { width:22px; height:22px; border-radius:50%; background:#7b5cff; margin:0 auto; animation: bbY .5s cubic-bezier(.6,.05,.9,.4) infinite alternate; }
.bb .sh { width:24px; height:6px; border-radius:50%; background:rgba(0,0,0,.4); margin:2px auto 0; animation: bbS .5s ease infinite alternate; }
@keyframes bbY { 0%{ transform:translateY(0) scale(1) } 95%{ transform:translateY(34px) scale(1) } 100%{ transform:translateY(34px) scale(1.2,.8) } }
@keyframes bbS { 0%{ transform:scale(.6); opacity:.3 } 100%{ transform:scale(1); opacity:.6 } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes ldBbY{0%{transform:translateY(0) scale(1)}92%{transform:translateY(34px) scale(1)}100%{transform:translateY(36px) scale(1.25,.75)}}@keyframes ldBbS{0%{transform:scale(.55);opacity:.25}100%{transform:scale(1);opacity:.55}}</style>'+
      '<div style="position:relative;width:60px;height:64px">'+
      '<div style="width:22px;height:22px;border-radius:50%;background:#7b5cff;margin:0 auto;transform-origin:bottom;animation:ldBbY .5s cubic-bezier(.6,.05,.9,.4) infinite alternate"></div>'+
      '<div style="width:26px;height:6px;border-radius:50%;background:rgba(0,0,0,.45);margin:4px auto 0;animation:ldBbS .5s ease infinite alternate"></div>'+
      '</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
