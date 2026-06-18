/** @type {import('../types.js').Effect} */
const effect = {
  id:'svg-dash-spinner', title:'Dash Array Spinner', cat:'SVG',
  tags:['svg','spinner','loader','dasharray','dashoffset','trazo','rotación'],
  desc:'Aro SVG con stroke-dasharray/dashoffset animado: un loader de trazo que gira y respira.',
  meta:['SVG','stroke-dasharray','stroke-dashoffset','rotate'],
  prompt:`Crea un spinner circular SVG basado en trazo (estilo Material/CircularProgress).
Dibuja un <circle> sin relleno con stroke. La circunferencia es C = 2*PI*r.
Pon stroke-dasharray = "<arco> <hueco>" donde la suma es C; un solo arco visible (p.ej. 25%-80% de C).
Anima dos cosas a la vez: 1) rotación continua del grupo/círculo (transform rotate, ~1s lineal),
2) opcionalmente el largo del arco (dasharray) y el dashoffset para que el arco se contraiga y expanda (efecto "respirar").
Parámetros: r=42, stroke-width 6-8, stroke-linecap round, velocidad de giro ~0.9 rad por frame*dt.`,
  code:`// HTML
// <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42"
//   fill="none" stroke="#7b5cff" stroke-width="8" stroke-linecap="round"/></svg>
const C = 2 * Math.PI * 42;            // circunferencia
circle.style.strokeDasharray = C;
let t = 0;
function loop(){
  t += 0.016;
  const arc = (0.15 + 0.35 * (0.5 + 0.5*Math.sin(t*2))); // 15%..85% visible
  circle.style.strokeDasharray = (C*arc) + ' ' + (C*(1-arc));
  circle.style.strokeDashoffset = -C * (t*0.3 % 1);      // desplaza el arco
  circle.parentNode.style.transform = 'rotate(' + (t*180) + 'deg)';
  requestAnimationFrame(loop);
}
loop();
// CSS equivalente: animation: spin 1s linear infinite + dash 1.5s ease-in-out infinite`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<svg viewBox="0 0 100 100" width="42%" style="overflow:visible"><g id="dsg" style="transform-origin:50px 50px"><circle id="dsc" cx="50" cy="50" r="42" fill="none" stroke="#7b5cff" stroke-width="8" stroke-linecap="round"/></g></svg>';
    el.appendChild(s);
    const g=s.querySelector('#dsg'),c=s.querySelector('#dsc');
    const C=2*Math.PI*42;
    let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=0.016;
      const arc=0.15+0.35*(0.5+0.5*Math.sin(t*2.2));
      c.style.strokeDasharray=(C*arc).toFixed(1)+' '+(C*(1-arc)).toFixed(1);
      c.style.strokeDashoffset=(-C*((t*0.3)%1)).toFixed(1);
      c.setAttribute('stroke',(0.5+0.5*Math.sin(t*1.1))>0.5?'#7b5cff':'#00e0c6');
      g.style.transform='rotate('+(t*200)+'deg)';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
