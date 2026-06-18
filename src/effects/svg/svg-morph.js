/** @type {import('../types.js').Effect} */
const effect = {
  id:'svg-morph', title:'Shape Morph', cat:'SVG',
  tags:['svg','morph','forma','blob','morphsvg','gsap','transición'],
  desc:'Una forma se transforma fluidamente en otra, como MorphSVGPlugin. Iconos que cambian de estado.',
  meta:['SVG','interpolación','Loop'],
  prompt:`Morphing entre formas SVG (equivalente a MorphSVGPlugin de GSAP).
Define 2+ paths con el MISMO número de puntos e interpola sus coordenadas con un easing (o usa flubber.js para paths dispares).
Úsalo para iconos que cambian de estado (play<->pause, menu<->close) o blobs decorativos que mutan. Loop con yoyo.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<svg viewBox="-60 -60 120 120" width="60%"><path id="mp" fill="#7b5cff"/></svg>';
    el.appendChild(s);const path=s.querySelector('#mp');
    const A=[42,38,46,36,44,40,48,38],B=[30,52,28,50,34,48,30,54],n=8;
    let t=0,dir=1,raf,run=true;
    function build(rs){let d='';for(let i=0;i<n;i++){const a=i/n*6.283,a2=(i+1)/n*6.283,r=rs[i],r2=rs[(i+1)%n];
      const x=Math.cos(a)*r,y=Math.sin(a)*r,x2=Math.cos(a2)*r2,y2=Math.sin(a2)*r2;
      const mx=Math.cos(a+.39)*(r+r2)/2*1.08,my=Math.sin(a+.39)*(r+r2)/2*1.08;
      if(i===0)d+='M'+x.toFixed(1)+' '+y.toFixed(1);d+=' Q'+mx.toFixed(1)+' '+my.toFixed(1)+' '+x2.toFixed(1)+' '+y2.toFixed(1);}return d+'Z';}
    (function loop(){if(!run)return;t+=dir*.012;if(t>=1)dir=-1;if(t<=0)dir=1;const e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;const rs=A.map((v,i)=>v+(B[i]-v)*e);path.setAttribute('d',build(rs));path.setAttribute('fill',e>.5?'#00e0c6':'#7b5cff');raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
