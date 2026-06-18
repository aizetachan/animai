/** @type {import('../types.js').Effect} */
const effect = {
  id:'tex-pressure', title:'Text Pressure', cat:'Texto',
  tags:['pressure','presión','cursor','letras','escala','react bits','proximidad'],
  desc:'Las letras se ensanchan y crecen según la cercanía del cursor. Efecto "presión" muy de moda.',
  meta:['per-letter','distancia','Cursor'],
  prompt:`Crea el efecto "Text Pressure": cada letra reacciona a la cercanía del cursor, aumentando su peso/escala cuanto más cerca está el ratón.
Calcula la distancia del cursor al centro de cada letra y mapéala inversamente a font-weight, scale o letter-spacing. Las letras cercanas se "hinchan" y las lejanas vuelven a su estado base.
Tipografía cinética interactiva para heros. Popularizado por React Bits.`,
  code:`// Text Pressure — cada letra reacciona a la distancia del cursor
letters.forEach(span => {
  const r = span.getBoundingClientRect()
  const cx = r.left + r.width/2, cy = r.top + r.height/2
  const d = Math.hypot(mouseX - cx, mouseY - cy)
  const k = Math.max(0, 1 - d / 200)   // 1 = pegado al cursor
  span.style.fontWeight = 300 + k * 600
  span.style.transform = \`scale(\${1 + k * 0.4})\`
})`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<div id="tp" style="font-size:30px;font-weight:400;color:#7b5cff;display:flex"></div>';
    el.appendChild(s);const tp=s.querySelector('#tp');const spans=[];'PRESSURE'.split('').forEach(ch=>{const sp=document.createElement('span');sp.textContent=ch;sp.style.cssText='display:inline-block;transition:transform .15s,font-weight .15s';tp.appendChild(sp);spans.push(sp);});
    let mx=-999,my=-999,a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;mx=e.clientX;my=e.clientY;};el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;a+=.04;if(!hover){const b=el.getBoundingClientRect();mx=b.left+b.width*(.5+Math.cos(a)*.4);my=b.top+b.height*.5;}
      spans.forEach(sp=>{const r=sp.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2;const d=Math.hypot(mx-cx,my-cy);const k=Math.max(0,1-d/160);sp.style.fontWeight=Math.round(300+k*600);sp.style.transform='scale('+(1+k*.45).toFixed(2)+')';sp.style.color=k>.3?'#00e0c6':'#7b5cff';});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
