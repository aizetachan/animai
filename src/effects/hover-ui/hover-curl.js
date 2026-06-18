/** @type {import('../types.js').Effect} */
const effect = {
  id:'hover-curl', title:'Page Curl', cat:'Hover & UI',
  tags:['curl','esquina','hover.css','papel','doblez','tarjeta'],
  desc:'La esquina de la tarjeta se dobla como una página al hover. Detalle skeuomórfico de Hover.css.',
  meta:['gradient corner','Hover','Skeuo'],
  prompt:`Recrea el efecto "Curl" de Hover.css: una esquina del elemento parece doblarse como una página.
Se hace con un ::before en la esquina usando un linear-gradient diagonal (de transparente a sombra a color de "reverso") que crece de 0 a ~25px al hover, con box-shadow para profundidad.
Detalle juguetón para cards de producto o notas.`,
  code:`/* Hover.css — Curl Top Right */
.hvr-curl::before {
  content: ''; position: absolute; right: 0; top: 0;
  width: 0; height: 0; background: #fff;
  background: linear-gradient(225deg, #fff 45%, #aaa 50%, #7b5cff 56%);
  box-shadow: -1px 1px 2px rgba(0,0,0,.3);
  transition: width .3s, height .3s;
}
.hvr-curl:hover::before { width: 25px; height: 25px; }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>.crl{position:relative;width:150px;height:100px;border-radius:12px;background:linear-gradient(135deg,#1e1e3a,#2c2c54);overflow:hidden;display:grid;place-items:center;color:#eef0f7;font-weight:700}.crl::before{content:"";position:absolute;right:0;top:0;width:0;height:0;background:linear-gradient(225deg,#0a0a12 45%,#5a5c72 50%,#7b5cff 56%);box-shadow:-2px 2px 4px rgba(0,0,0,.4);transition:width .3s,height .3s;border-bottom-left-radius:6px}.crl:hover::before,.crl.auto::before{width:30px;height:30px}.crl.auto::before{animation:crlauto 2.6s ease-in-out infinite}@keyframes crlauto{0%,100%{width:0;height:0}50%{width:32px;height:32px}}</style><div class="crl auto">Curl</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
