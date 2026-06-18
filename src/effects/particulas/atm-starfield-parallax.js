import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'atm-starfield-parallax', title:'Starfield Parallax', cat:'Partículas',
  tags:['starfield','estrellas','parallax','capas','espacio','deriva','profundidad'],
  desc:'Estrellas en capas que derivan a distinta velocidad creando profundidad espacial. Deriva suave (no warp).',
  meta:['Canvas 2D','layers','Espacio'],
  prompt:`Crea un campo de estrellas con parallax: tres capas de estrellas (lejana, media, cercana) que se desplazan lentamente a distinta velocidad, las cercanas más rápidas y grandes, dando profundidad espacial.
Cada capa tiene su tamaño/velocidad/brillo; desplaza las estrellas y reposiciónalas al salir. A diferencia del warp, aquí la deriva es lenta y contemplativa.
Fondo espacial relajante para heros nocturnos, sci-fi suave, landing pages.`,
  code:`// Starfield parallax — capas a distinta velocidad
layers.forEach(layer => {
  layer.stars.forEach(s => {
    s.x -= layer.speed                      // lejanas: lento; cercanas: rápido
    if (s.x < 0) s.x = W
    ctx.globalAlpha = layer.brightness
    ctx.fillRect(s.x, s.y, layer.size, layer.size)
  })
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const layers=[{sp:.1,sz:1,br:.4,n:40},{sp:.3,sz:1.5,br:.7,n:25},{sp:.6,sz:2.2,br:1,n:14}];
    layers.forEach(L=>{L.stars=[];for(let i=0;i<L.n;i++)L.stars.push({x:Math.random()*o.W(),y:Math.random()*o.H()});});
    let raf,run=true;
    (function loop(){if(!run)return;x.fillStyle='#06060f';x.fillRect(0,0,o.W(),o.H());layers.forEach(L=>{x.globalAlpha=L.br;x.fillStyle='#cdd5ff';L.stars.forEach(s=>{s.x-=L.sp;if(s.x<0){s.x=o.W();s.y=Math.random()*o.H();}x.fillRect(s.x,s.y,L.sz,L.sz);});});x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
