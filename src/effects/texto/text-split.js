/** @type {import('../types.js').Effect} */
const effect = {
  id:'text-split', title:'Split Reveal', cat:'Texto',
  tags:['texto','reveal','stagger','entrada','letras','splittext','gsap'],
  desc:'Las letras aparecen una a una desde abajo con desenfoque. El reveal de SplitText de GSAP.',
  meta:['CSS + JS','Stagger','Por letra'],
  prompt:`Crea un "split text reveal" por letra/palabra (equivalente al SplitText de GSAP).
Envuelve cada carácter en <span> y anímalo: translateY(100%)+opacity 0+blur(8px) -> estado final, con delay escalonado (~30ms por índice).
Dispara al entrar en viewport. Pon aria-label en el contenedor para lectores de pantalla.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.innerHTML='<style>@keyframes rv{from{opacity:0;transform:translateY(70%);filter:blur(8px)}to{opacity:1;transform:none;filter:none}} .rvL{display:inline-block;animation:rv .7s cubic-bezier(.2,.8,.2,1) both}</style><div style="height:100%;display:grid;place-items:center"><div id="rv" style="font-size:30px;font-weight:800;letter-spacing:-.01em"></div></div>';
    el.appendChild(s);const box=s.querySelector('#rv');let to,run=true;
    (function go(){const txt='Design in motion';box.innerHTML='';[...txt].forEach((ch,i)=>{const sp=document.createElement('span');sp.className='rvL';sp.style.animationDelay=(i*.04)+'s';sp.textContent=ch===' '?'\u00A0':ch;box.appendChild(sp);});if(run)to=setTimeout(go,3200);})();
    return{stop(){run=false;clearTimeout(to);el.innerHTML='';}};
  }
};
export default effect;
