/** @type {import('../types.js').Effect} */
const effect = {
  id:'cd-infinite-marquee', title:'Infinite Marquee', cat:'CSS Moderno',
  tags:['marquee','marquesina','scroll','infinito','loop','logos','texto'],
  desc:'Cinta de texto/logos que se desplaza en bucle infinito sin costuras. La marquee moderna CSS.',
  meta:['translateX','seamless','Loop'],
  prompt:`Crea una marquee (marquesina) infinita y sin costuras en CSS: una fila de contenido que se desplaza horizontalmente en bucle perfecto.
Duplica el contenido dos veces dentro de un track y anima translateX de 0 a -50% en bucle lineal; como la segunda mitad es copia de la primera, el loop es invisible. Pausa al hover opcional.
Para tiras de logos de clientes, testimonios o claims en movimiento.`,
  code:`/* Marquee infinita sin costuras (contenido duplicado) */
.track {
  display: flex; width: max-content;
  animation: marquee 18s linear infinite;
}
.marquee:hover .track { animation-play-state: paused; }
@keyframes marquee { to { transform: translateX(-50%); } }
/* .track contiene el set de items DOS veces */`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;overflow:hidden';
    const words=['DISEÑO','◆','MOTION','◆','CÓDIGO','◆','AI','◆'];let inner='';for(let k=0;k<2;k++)words.forEach(w=>inner+='<span style="padding:0 18px;font-size:20px;font-weight:800;color:'+(w==='◆'?'#00e0c6':'#eef0f7')+'">'+w+'</span>');
    s.innerHTML='<style>@keyframes mq{to{transform:translateX(-50%)}}</style><div style="display:flex;width:max-content;animation:mq 12s linear infinite;white-space:nowrap">'+inner+'</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
