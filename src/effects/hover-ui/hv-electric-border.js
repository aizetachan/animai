/** @type {import('../types.js').Effect} */
const effect = {
  id:'hv-electric-border', title:'Electric Border', cat:'Hover & UI',
  tags:['electric','border','rayos','svg','turbulence','filter','energía'],
  desc:'Borde de tarjeta recorrido por rayos eléctricos animados con un filtro SVG de turbulencia.',
  meta:['SVG filter','feTurbulence','feDisplacementMap'],
  prompt:`Crea una tarjeta cuyo borde tenga rayos eléctricos animados al hacer hover.
Técnica: define un filtro SVG con feTurbulence (type=fractalNoise, baseFrequency baja ~0.02, numOctaves 2) seguido de feDisplacementMap que distorsiona el trazo del borde, generando un aspecto de electricidad.
Anima la turbulencia: usa <animate> sobre el atributo baseFrequency o seed para que el ruido cambie en bucle (~2s), o anima un offset que desplace el patrón.
Dibuja el borde con un rect (o el propio border de la tarjeta) y aplícale el filtro. Añade dos capas: una nítida (acento #7b5cff) y otra con blur para el glow (#00e0c6). El borde queda quieto en reposo y se activa el filtro al hover.
Timings: ciclo de seed/baseFrequency ~2-3s loop infinito.`,
  code:`<div class="card">
  <svg class="elec" viewBox="0 0 200 130" preserveAspectRatio="none">
    <defs>
      <filter id="ed" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="2" result="n">
          <animate attributeName="seed" from="1" to="20" dur="2.4s" repeatCount="indefinite"/>
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="9"/>
      </filter>
    </defs>
    <rect x="3" y="3" width="194" height="124" rx="14" fill="none"
      stroke="#7b5cff" stroke-width="2" filter="url(#ed)"/>
  </svg>
  Hover me
</div>
<style>.card{position:relative;width:200px;height:130px;display:grid;place-items:center;color:#fff}
.elec{position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity .25s}
.card:hover .elec{opacity:1}</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#06060c';
    s.innerHTML='<style>'
      +'.hveb{position:relative;width:200px;height:128px;display:grid;place-items:center;border-radius:16px;background:radial-gradient(circle at 30% 20%,#16162a,#0a0a14);color:#fff;font:700 15px/1 system-ui,sans-serif;letter-spacing:.5px}'
      +'.hveb svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}'
      +'.hveb .glow{filter:url(#hvebF) blur(4px)}'
      +'</style>'
      +'<div class="hveb">'
      +'<svg viewBox="0 0 200 128" preserveAspectRatio="none">'
      +'<defs><filter id="hvebF" x="-30%" y="-30%" width="160%" height="160%">'
      +'<feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="3" result="n">'
      +'<animate attributeName="seed" from="1" to="24" dur="2.6s" repeatCount="indefinite"/>'
      +'<animate attributeName="baseFrequency" values="0.018;0.03;0.018" dur="3.2s" repeatCount="indefinite"/>'
      +'</feTurbulence>'
      +'<feDisplacementMap in="SourceGraphic" in2="n" scale="10"/>'
      +'</filter></defs>'
      +'<rect class="glow" x="4" y="4" width="192" height="120" rx="15" fill="none" stroke="#00e0c6" stroke-width="2.5" filter="url(#hvebF) blur(5px)"/>'
      +'<rect x="4" y="4" width="192" height="120" rx="15" fill="none" stroke="#7b5cff" stroke-width="2" filter="url(#hvebF)"/>'
      +'</svg>'
      +'<span>ELECTRIC</span>'
      +'</div>';
    el.appendChild(s);
    return{stop(){el.innerHTML='';}};
  }
};
export default effect;
