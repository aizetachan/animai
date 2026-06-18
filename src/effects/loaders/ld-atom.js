/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-atom', title:'Atom Orbit', cat:'Loaders',
  tags:['css','loader','atom','orbit','átomo','electrones','0 js'],
  desc:'Un núcleo con tres elipses orbitales rotadas; los electrones giran por las órbitas.',
  meta:['ellipse','rotate','0 JS'],
  prompt:`Crea un loader tipo átomo.
Un núcleo central (punto) y 3 elipses (divs con border y border-radius:50% achatadas) rotadas a 0/60/120deg. Cada órbita lleva un electrón (pseudo-elemento) que recorre la elipse con una animación de rotación. Combina rotate de las órbitas con el giro de electrones. ~1s infinite.`,
  code:`.atom { width:64px; aspect-ratio:1; position:relative; }
.atom .orbit { position:absolute; inset:0; border:2px solid rgba(123,92,255,.4); border-radius:50%; transform: rotate(0) ; }
.atom .orbit:nth-child(2){ transform: rotate(60deg); }
.atom .orbit:nth-child(3){ transform: rotate(120deg); }
/* electrón girando por cada órbita */
.atom .e { position:absolute; top:50%; left:-4px; width:8px; height:8px; border-radius:50%; background:#00e0c6; animation: at 1s linear infinite; }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    let orbits='';for(let i=0;i<3;i++){orbits+=`<div style="position:absolute;inset:0;border:2px solid rgba(123,92,255,.35);border-radius:50%;transform:rotate(${i*60}deg);height:24px;top:18px"><span style="position:absolute;top:50%;left:-4px;margin-top:-4px;width:8px;height:8px;border-radius:50%;background:#00e0c6;animation:ldAt 1s linear infinite;animation-delay:${-i*0.33}s"></span></div>`;}
    s.innerHTML=`<style>@keyframes ldAt{to{transform:rotate(360deg)}}@keyframes ldAtSpin{to{transform:rotate(-360deg)}}</style>`+
      `<div style="width:60px;height:60px;position:relative;animation:ldAtSpin 6s linear infinite"><span style="position:absolute;top:50%;left:50%;width:10px;height:10px;margin:-5px;border-radius:50%;background:#7b5cff;box-shadow:0 0 8px #7b5cff"></span>${orbits}</div>`;
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
