/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-dna-helix', title:'DNA Helix', cat:'Loaders',
  tags:['css','loader','dna','adn','helix','helice','puntos','senoidal'],
  desc:'Dos hileras de puntos que oscilan en contrafase dibujando una doble helice de ADN en movimiento.',
  meta:['transform','0 JS'],
  prompt:`Crea un loader de doble helice de ADN con dos hileras de puntos.
Coloca una fila horizontal de columnas (ej. 8-10). Cada columna contiene dos puntos (circulos pequenos): el punto A y el punto B.
Cada par se anima verticalmente con un @keyframes que mueve el punto A con transform:translateY siguiendo una onda (arriba->centro->abajo->centro) y escala su tamano/opacidad segun la profundidad; el punto B hace lo mismo en contrafase (mitad del ciclo desplazado). Para el efecto helice, cada columna tiene un animation-delay incremental (paso ~0.12s) de modo que la onda recorre las columnas.
Duracion ~1.5s, ease-in-out, infinite. Los puntos del frente se ven mas grandes y opacos que los del fondo. Solo CSS, sin JS.`,
  code:`.dna { display: flex; gap: 6px; height: 50px; align-items: center; }
.dna .col { position: relative; width: 6px; height: 100%; }
.dna .dot {
  position: absolute; left: 0; width: 6px; height: 6px; border-radius: 50%;
  top: 50%; margin-top: -3px;
}
.dna .a { background: #7b5cff; animation: dna-a 1.5s ease-in-out infinite; }
.dna .b { background: #00e0c6; animation: dna-b 1.5s ease-in-out infinite; }
/* cada columna con delay incremental para que la onda viaje */
.dna .col:nth-child(n) .dot { animation-delay: calc(var(--i) * 0.12s); }
@keyframes dna-a {
  0%,100% { transform: translateY(-16px) scale(.5); opacity:.4; }
  50%     { transform: translateY(16px)  scale(1);  opacity:1; }
}
@keyframes dna-b {
  0%,100% { transform: translateY(16px)  scale(1);  opacity:1; }
  50%     { transform: translateY(-16px) scale(.5); opacity:.4; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    const N=9;
    let cols='';
    for(let i=0;i<N;i++){
      const d=(i*0.12).toFixed(2);
      cols+='<span class="ldDnaCol"><i class="ldDnaDot ldDnaA" style="animation-delay:'+d+'s"></i><i class="ldDnaDot ldDnaB" style="animation-delay:'+d+'s"></i></span>';
    }
    s.innerHTML='<style>'+
      '.ldDnaWrap{display:flex;gap:7px;height:52px;align-items:center}'+
      '.ldDnaCol{position:relative;width:7px;height:100%}'+
      '.ldDnaDot{position:absolute;left:0;width:7px;height:7px;border-radius:50%;top:50%;margin-top:-3.5px}'+
      '.ldDnaA{background:#7b5cff;box-shadow:0 0 8px #7b5cff;animation:ldDnaA 1.5s ease-in-out infinite}'+
      '.ldDnaB{background:#00e0c6;box-shadow:0 0 8px #00e0c6;animation:ldDnaB 1.5s ease-in-out infinite}'+
      '@keyframes ldDnaA{0%,100%{transform:translateY(-16px) scale(.5);opacity:.4}50%{transform:translateY(16px) scale(1);opacity:1}}'+
      '@keyframes ldDnaB{0%,100%{transform:translateY(16px) scale(1);opacity:1}50%{transform:translateY(-16px) scale(.5);opacity:.4}}'+
      '</style>'+
      '<div class="ldDnaWrap">'+cols+'</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
