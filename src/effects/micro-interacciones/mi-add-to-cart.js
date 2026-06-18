/** @type {import('../types.js').Effect} */
const effect = {
  id:'mi-add-to-cart', title:'Add to Cart', cat:'Micro-interacciones',
  tags:['cart','carrito','add','ecommerce','fly','badge','animation'],
  desc:'Un producto vuela en arco hacia el icono del carrito y el badge del contador incrementa con un pop (auto-demo).',
  meta:['CSS+JS','transform'],
  prompt:`Crea una micro-interaccion de "anadir al carrito".
Estructura: a la izquierda una tarjeta de producto (cuadrado con color/emoji), a la derecha un icono de carrito con un badge contador.
Al pulsar "Anadir": clona el producto (un div .fly) y lo anima volando en arco hasta el carrito usando transitions de transform (translate X/Y) + scale a 0 y opacity; al terminar incrementa el badge y dale un pop (@keyframes scale). Tambien hace un pequeno bounce al carrito.
Demo: lanza el ciclo con setInterval cada ~2.2s. Calcula el destino con getBoundingClientRect del producto y del carrito.`,
  code:`<div class="cartdemo">
  <div class="prod">★</div>
  <div class="cart">🛒<span class="cbadge">0</span></div>
</div>
<style>
.cartdemo{display:flex;align-items:center;gap:60px;position:relative}
.prod{width:54px;height:54px;border-radius:12px;display:grid;place-items:center;
  font-size:26px;background:linear-gradient(135deg,#7b5cff,#00e0c6);color:#fff}
.cart{position:relative;font-size:34px}
.cbadge{position:absolute;top:-6px;right:-12px;min-width:18px;height:18px;padding:0 4px;
  background:#7b5cff;color:#fff;border-radius:9px;font:700 11px system-ui;
  display:grid;place-items:center}
.cbadge.pop{animation:cartPop .35s ease}
.cart.bounce{animation:cartBounce .4s ease}
.fly{position:absolute;width:30px;height:30px;border-radius:8px;
  background:linear-gradient(135deg,#7b5cff,#00e0c6);
  transition:transform .7s cubic-bezier(.5,-0.3,.6,1),opacity .7s}
@keyframes cartPop{50%{transform:scale(1.5)}}
@keyframes cartBounce{50%{transform:translateY(-6px)}}
</style>
<scr` + `ipt>
const root=document.querySelector('.cartdemo'),prod=root.querySelector('.prod'),
  cart=root.querySelector('.cart'),badge=root.querySelector('.cbadge');
let n=0;
function add(){
  const a=prod.getBoundingClientRect(),b=cart.getBoundingClientRect(),r=root.getBoundingClientRect();
  const fly=document.createElement('div');fly.className='fly';
  fly.style.left=(a.left-r.left+12)+'px';fly.style.top=(a.top-r.top+12)+'px';
  root.appendChild(fly);
  requestAnimationFrame(()=>{
    fly.style.transform='translate('+(b.left-a.left)+'px,'+(b.top-a.top-20)+'px) scale(.2)';
    fly.style.opacity='0';
  });
  setTimeout(()=>{fly.remove();n++;badge.textContent=n;
    badge.classList.remove('pop');void badge.offsetWidth;badge.classList.add('pop');
    cart.classList.remove('bounce');void cart.offsetWidth;cart.classList.add('bounce');},700);
}
setInterval(add,2200);
</scr` + `ipt>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'.miCartDemo{display:flex;align-items:center;gap:50px;position:relative}'
      +'.miCartDemo .prod{width:50px;height:50px;border-radius:12px;display:grid;place-items:center;font-size:24px;color:#fff;background:linear-gradient(135deg,#7b5cff,#00e0c6)}'
      +'.miCartDemo .cart{position:relative;font-size:32px;line-height:1}'
      +'.miCartDemo .cbadge{position:absolute;top:-6px;right:-12px;min-width:18px;height:18px;padding:0 4px;background:#7b5cff;color:#fff;border-radius:9px;font:700 11px system-ui;display:grid;place-items:center}'
      +'.miCartDemo .cbadge.pop{animation:miCartPop .35s ease}'
      +'.miCartDemo .cart.bounce{animation:miCartBounce .4s ease}'
      +'.miCartDemo .fly{position:absolute;width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#7b5cff,#00e0c6);transition:transform .7s cubic-bezier(.5,-0.3,.6,1),opacity .7s;pointer-events:none}'
      +'@keyframes miCartPop{50%{transform:scale(1.5)}}'
      +'@keyframes miCartBounce{50%{transform:translateY(-6px)}}'
      +'</style><div class="miCartDemo"><div class="prod">★</div><div class="cart">🛒<span class="cbadge">0</span></div></div>';
    el.appendChild(s);
    const root=s.querySelector('.miCartDemo'),prod=root.querySelector('.prod'),
      cart=root.querySelector('.cart'),badge=root.querySelector('.cbadge');
    let n=0;const timers=new Set();
    function add(){
      const a=prod.getBoundingClientRect(),b=cart.getBoundingClientRect(),r=root.getBoundingClientRect();
      const fly=document.createElement('div');fly.className='fly';
      fly.style.left=(a.left-r.left+11)+'px';fly.style.top=(a.top-r.top+11)+'px';
      root.appendChild(fly);
      requestAnimationFrame(()=>{
        fly.style.transform='translate('+(b.left-a.left)+'px,'+(b.top-a.top-20)+'px) scale(.2)';
        fly.style.opacity='0';
      });
      const t=setTimeout(()=>{timers.delete(t);fly.remove();n++;badge.textContent=n;
        badge.classList.remove('pop');void badge.offsetWidth;badge.classList.add('pop');
        cart.classList.remove('bounce');void cart.offsetWidth;cart.classList.add('bounce');},700);
      timers.add(t);
    }
    add();const iv=setInterval(add,2200);
    return{stop(){clearInterval(iv);timers.forEach(t=>clearTimeout(t));el.innerHTML='';}};
  }
};
export default effect;
