/** @type {import('../types.js').Effect} */
const effect = {
  id:'svg-line-annotation', title:'Line Annotation', cat:'SVG',
  tags:['svg','annotation','underline','subrayado','circle','rough-notation','dibujado'],
  desc:'Subrayado y circulo dibujados a mano sobre texto, estilo rough-notation, en bucle.',
  meta:['SVG path','stroke-dashoffset','annotation'],
  prompt:`Replica el efecto "rough-notation": resaltar texto con marcas dibujadas a mano (subrayado, circulo, recuadro)
que se "dibujan" animadas y desaparecen en bucle.
Tecnica:
1) Genera el path de la marca con un ligero wobble (jitter aleatorio en los puntos) para que parezca hecho a mano,
   o usa filtro feTurbulence+feDisplacementMap.
2) Anima el trazado con stroke-dasharray = longitud total y stroke-dashoffset de longitud->0 (efecto "draw on").
   Usa path.getTotalLength() para medir. Para borrarlo, lleva dashoffset de 0->longitud.
3) Para el subrayado: una linea bajo el texto con 1-2 pasadas ligeramente desviadas.
   Para el circulo: una elipse abierta que rodea la palabra (path tipo arco que se solapa al cerrar).
Encadena underline -> circle -> reset en loop.`,
  code:`// rough-notation casero: dibuja una marca animando stroke-dashoffset
const path = svg.querySelector('#mark')
const len = path.getTotalLength()
path.style.strokeDasharray = len
path.style.strokeDashoffset = len           // oculto
// draw on:
path.animate(
  [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
  { duration: 700, fill: 'forwards', easing: 'ease-in-out' }
)
// subrayado a mano: path con jitter
function underline(x1,x2,y){
  const j=()=>(Math.random()-.5)*4
  return 'M'+x1+' '+(y+j())+' C '+(x1+(x2-x1)/3)+' '+(y+j())+
         ', '+(x1+2*(x2-x1)/3)+' '+(y+j())+', '+x2+' '+(y+j())
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='background:#0a0a14;display:grid;place-items:center;width:100%;height:100%';
    s.innerHTML='<svg width="100%" height="100%" viewBox="0 0 260 200">'
      +'<text x="130" y="80" text-anchor="middle" font-family="system-ui,sans-serif" '
      +'font-size="30" font-weight="700" fill="#eef">Animai</text>'
      +'<text x="130" y="140" text-anchor="middle" font-family="system-ui,sans-serif" '
      +'font-size="20" font-weight="600" fill="#cdd">efectos</text>'
      +'<path id="ul" fill="none" stroke="#7b5cff" stroke-width="4" stroke-linecap="round"/>'
      +'<path id="ci" fill="none" stroke="#00e0c6" stroke-width="3" stroke-linecap="round"/>'
      +'</svg>';
    el.appendChild(s);
    const ul=s.querySelector('#ul'),ci=s.querySelector('#ci');
    const j=()=>(Math.random()-.5)*4;
    function underlinePath(){
      const x1=70,x2=190,y=90;
      return 'M'+x1+' '+(y+j())+' C '+(x1+40)+' '+(y+j())+', '+(x2-40)+' '+(y+j())+', '+x2+' '+(y+j());
    }
    function circlePath(){
      // arco abierto que rodea "efectos", trazado a mano
      const cx=130,cy=132,rx=78,ry=22;let d='';
      const start=-0.3;
      for(let i=0;i<=24;i++){
        const a=start+ (i/24)*(Math.PI*2+0.5);
        const x=cx+Math.cos(a)*rx+j(), y=cy+Math.sin(a)*ry+j();
        d+=(i===0?'M':'L')+x.toFixed(1)+' '+y.toFixed(1);
      }
      return d;
    }
    let raf,run=true,anim;
    function setup(p){const len=p.getTotalLength();p.style.strokeDasharray=len;p.style.strokeDashoffset=len;return len;}
    function draw(p,len,delay,dir){
      return p.animate(
        dir>0?[{strokeDashoffset:len},{strokeDashoffset:0}]:[{strokeDashoffset:0},{strokeDashoffset:len}],
        {duration:700,delay,fill:'forwards',easing:'ease-in-out'});
    }
    function cycle(){
      if(!run)return;
      ul.setAttribute('d',underlinePath());
      ci.setAttribute('d',circlePath());
      const lu=setup(ul),lc=setup(ci);
      draw(ul,lu,0,1);
      const a=draw(ci,lc,800,1);
      a.onfinish=()=>{
        if(!run)return;
        setTimeout(()=>{
          if(!run)return;
          draw(ul,lu,0,-1);draw(ci,lc,0,-1).onfinish=()=>{if(run)setTimeout(cycle,300);};
        },900);
      };
    }
    cycle();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
