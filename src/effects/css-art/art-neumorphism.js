/** @type {import('../types.js').Effect} */
const effect = {
  id:'art-neumorphism', title:'Neumorphism', cat:'CSS Art',
  tags:['css','neumorphism','soft ui','boton','button','sombra','0 js'],
  desc:'Botón soft-UI (neumorfismo) que alterna entre relieve extruido y hundido mediante doble box-shadow clara y oscura.',
  meta:['box-shadow','0 JS'],
  prompt:`Crea un botón estilo neumorfismo (soft UI).
Usa un fondo gris-azulado plano (#262a3a aprox) idéntico al de la tarjeta. El botón es un círculo o rectángulo redondeado con el MISMO color de fondo y un doble box-shadow: una sombra oscura abajo-derecha y una luz clara arriba-izquierda, dando sensación de relieve extruido.
Para el estado "pulsado" invierte las sombras a inset (hundido). Anímalo con @keyframes que alterna entre el relieve y el inset (0%->extruido, 50%->pulsado, 100%->extruido) en bucle. Sin JS.`,
  code:`/* Neumorphism toggle - puro CSS */
.neu { background:#262a3a; padding:40px; border-radius:20px; }
.neu .btn {
  width:90px; aspect-ratio:1; border-radius:24px; background:#262a3a;
  animation:neu-press 2.4s ease-in-out infinite;
}
@keyframes neu-press {
  0%,100% { box-shadow:-8px -8px 16px #2f3550, 8px 8px 16px #14161f; }
  50%     { box-shadow:inset -8px -8px 16px #2f3550, inset 8px 8px 16px #14161f; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#262a3a;border-radius:10px';
    s.innerHTML=`<style>
      @keyframes artNeu{
        0%,100%{box-shadow:-8px -8px 16px #2f3550, 8px 8px 16px #14161f}
        50%{box-shadow:inset -8px -8px 16px #2f3550, inset 8px 8px 16px #14161f}
      }
      @keyframes artNeuGlow{0%,100%{color:#7b5cff}50%{color:#00e0c6}}
      .neuBtn{width:84px;aspect-ratio:1;border-radius:24px;background:#262a3a;display:grid;place-items:center;animation:artNeu 2.4s ease-in-out infinite}
      .neuBtn svg{width:34px;height:34px;animation:artNeuGlow 2.4s ease-in-out infinite}
    </style><div class="neuBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6"/><path d="M5.5 6.5a8 8 0 1 0 13 0"/></svg></div>`;
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
