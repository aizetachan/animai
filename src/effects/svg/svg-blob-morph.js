/** @type {import('../types.js').Effect} */
const effect = {
  id:'svg-blob-morph', title:'Blob Background', cat:'SVG',
  tags:['svg','blob','fondo','morph','orgánico','mancha','animado'],
  desc:'Mancha SVG orgánica que muta de forma sin parar. El blob de fondo decorativo omnipresente.',
  meta:['SVG path','morph','Decorativo'],
  prompt:`Crea un blob SVG orgánico que muta de forma continuamente como decoración de fondo.
Genera un path cerrado con curvas de Bézier a partir de N puntos en un círculo con radios que varían suavemente con seno+tiempo (o interpola entre varios blobs pregenerados).
Rellénalo con un gradiente de marca. Úsalo grande, difuminado y semitransparente detrás del contenido.`,
  code:`// Blob SVG orgánico animado (genera el path por frame)
function blobPath(cx, cy, r, t, points = 6) {
  let d = ''
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2
    const rad = r * (1 + Math.sin(a * 3 + t) * 0.15)
    const x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad
    d += (i === 0 ? 'M' : 'L') + x + ' ' + y
  }
  return d + 'Z'  // mejor con curvas Q/C para suavizar
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#0a0a14';
    s.innerHTML='<svg viewBox="-100 -100 200 200" width="80%"><defs><linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b5cff"/><stop offset="1" stop-color="#00e0c6"/></linearGradient></defs><path id="bl" fill="url(#bg1)"/></svg>';
    el.appendChild(s);const path=s.querySelector('#bl');const n=8;let t=0,raf,run=true;
    function build(){let pts=[];for(let i=0;i<n;i++){const a=i/n*6.283;const r=60*(1+Math.sin(a*3+t)*.14+Math.cos(a*2-t*.7)*.1);pts.push([Math.cos(a)*r,Math.sin(a)*r]);}
      let d='M'+pts[0][0].toFixed(1)+' '+pts[0][1].toFixed(1);for(let i=0;i<n;i++){const c=pts[i],nx=pts[(i+1)%n];const mx=(c[0]+nx[0])/2,my=(c[1]+nx[1])/2;d+=' Q'+c[0].toFixed(1)+' '+c[1].toFixed(1)+' '+mx.toFixed(1)+' '+my.toFixed(1);}return d+'Z';}
    (function loop(){if(!run)return;t+=.02;path.setAttribute('d',build());raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
