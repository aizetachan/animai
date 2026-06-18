/** @type {import('../types.js').Effect} */
const effect = {
  id:'svg-path-morph-icons', title:'Icon Path Morph', cat:'SVG',
  tags:['svg','icon','morph','menu','search','path','transición','toggle'],
  desc:'Un icono SVG que muta su path entre dos formas (menú ↔ búsqueda) en bucle suave.',
  meta:['SVG','interpolación','path','Loop'],
  prompt:`Morph entre DOS iconos SVG hechos de líneas, interpolando coordenadas punto a punto.
Truco clave: representa ambos iconos con el MISMO número de subtrazos y puntos para poder interpolar 1:1.
Aquí el icono "menú" son 3 líneas horizontales; la lupa es un círculo (aproximado por un polígono) + mango.
Modela cada estado como un array de N puntos de control; interpola con lerp y un easing inOut (yoyo).
Reconstruye el atributo d en cada frame: "M x y L x y ..." por subtrazo.
Para casos reales usa flubber.js (interpolate) que normaliza paths dispares automáticamente.
Parámetros: N puntos por estado, easing easeInOutCubic, color #7b5cff -> #00e0c6 según fase.`,
  code:`// flubber-style manual: dos estados con mismo nº de puntos
const lerp=(a,b,t)=>a+(b-a)*t;
function mix(A,B,t){ return A.map((p,i)=>[lerp(p[0],B[i][0],t), lerp(p[1],B[i][1],t)]); }
function toPath(pts, segs){ // segs = [start,end) indices por subtrazo
  let d='';
  for(const [s,e] of segs){ d+='M'+pts[s][0].toFixed(1)+' '+pts[s][1].toFixed(1);
    for(let i=s+1;i<e;i++) d+='L'+pts[i][0].toFixed(1)+' '+pts[i][1].toFixed(1); }
  return d;
}
// MENU: 3 barras (2 pts c/u) -> SEARCH: aro (poligono) + mango
let t=0,dir=1;
function loop(){
  t+=dir*0.012; if(t>=1)dir=-1; if(t<=0)dir=1;
  const e = t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; // easeInOutCubic
  path.setAttribute('d', toPath(mix(MENU,SEARCH,e), SEGS));
  requestAnimationFrame(loop);
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<svg viewBox="0 0 100 100" width="46%"><path id="pmi" fill="none" stroke="#7b5cff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    el.appendChild(s);const path=s.querySelector('#pmi');
    // 3 subtrazos. Subtrazo0: 8 pts (barra sup -> aro). Subtrazo1: 2 pts (barra med -> mango). Subtrazo2: 8 pts (barra inf -> aro 2a mitad)
    // Para simplicidad: aro = poligono de 12 pts en subtrazo0; barra med->mango; subtrazo2 colapsa.
    const N=12, cx=42, cy=42, R=22;
    const ring=[]; for(let i=0;i<=N;i++){const a=i/N*6.283;ring.push([cx+Math.cos(a)*R, cy+Math.sin(a)*R]);}
    // MENU: 3 barras horizontales. Replicamos puntos para igualar conteos.
    const barSup=[]; for(let i=0;i<=N;i++)barSup.push([20+i/N*60, 30]);
    const barInf=[]; for(let i=0;i<=N;i++)barInf.push([20+i/N*60, 70]);
    const MENU_RING=barSup, SEARCH_RING=ring;
    const MENU_MID=[[20,50],[80,50]];           // barra central
    const SEARCH_MID=[[57,57],[78,78]];          // mango de la lupa
    const MENU_BOT=barInf, SEARCH_BOT=ring.map(p=>[p[0],p[1]]); // colapsa sobre el aro
    const mix=(A,B,t)=>A.map((p,i)=>[p[0]+(B[i][0]-p[0])*t, p[1]+(B[i][1]-p[1])*t]);
    function poly(pts){let d='M'+pts[0][0].toFixed(1)+' '+pts[0][1].toFixed(1);for(let i=1;i<pts.length;i++)d+='L'+pts[i][0].toFixed(1)+' '+pts[i][1].toFixed(1);return d;}
    let t=0,dir=1,raf,run=true;
    (function loop(){if(!run)return;t+=dir*0.011;if(t>=1)dir=-1;if(t<=0)dir=1;
      const e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
      const d=poly(mix(MENU_RING,SEARCH_RING,e))+poly(mix(MENU_MID,SEARCH_MID,e))+poly(mix(MENU_BOT,SEARCH_BOT,e));
      path.setAttribute('d',d);
      path.setAttribute('stroke',e>.5?'#00e0c6':'#7b5cff');
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
