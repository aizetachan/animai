/** @type {import('../types.js').Effect} */
const effect = {
  id:'ui-evervault', title:'Evervault Card', cat:'UI Components',
  tags:['evervault','encrypted','matrix','hover','aceternity','código','reveal'],
  desc:'Tarjeta con lluvia de caracteres encriptados que se revela bajo el cursor. La Evervault Card de Aceternity.',
  meta:['Aceternity UI','mask radial','Hover'],
  prompt:`Recrea la Evervault Card de Aceternity: una tarjeta cubierta de caracteres aleatorios (estilo encriptado) que solo se revelan en un círculo que sigue al cursor, con un gradiente de color debajo.
Se hace con un fondo de texto random + una máscara radial (radial-gradient como mask) centrada en la posición del ratón, sobre un gradiente cónico/lineal de color.
Para secciones de seguridad/cifrado/IA.`,
  code:`// Aceternity UI — Evervault Card (React + Framer Motion)
// Texto random como fondo, revelado por una máscara radial que sigue al mouse
const onMouseMove = (e) => {
  const { left, top } = ref.current.getBoundingClientRect()
  setMask({
    WebkitMaskImage: \`radial-gradient(circle 120px at \${e.clientX-left}px \${e.clientY-top}px, white, transparent)\`,
  })
  setText(generateRandomString(1500)) // re-randomiza los caracteres
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;overflow:hidden;background:#0a0a12;cursor:crosshair';
    s.innerHTML='<div id="grad" style="position:absolute;inset:0;background:linear-gradient(135deg,#7b5cff,#00e0c6,#ff5ca8);-webkit-mask-image:radial-gradient(circle 90px at 50% 50%,#000,transparent);mask-image:radial-gradient(circle 90px at 50% 50%,#000,transparent)"></div><div id="txt" style="position:absolute;inset:0;font-family:monospace;font-size:10px;line-height:11px;color:#2a2a3e;word-break:break-all;overflow:hidden;padding:4px;-webkit-mask-image:radial-gradient(circle 90px at 50% 50%,#000,transparent);mask-image:radial-gradient(circle 90px at 50% 50%,#000,transparent)"></div>';
    el.appendChild(s);const grad=s.querySelector('#grad'),txt=s.querySelector('#txt');const ch='01ABCDEF<>{}[]()=+*';
    function rnd(){let r='';for(let i=0;i<600;i++)r+=ch[Math.floor(Math.random()*ch.length)];return r;}txt.textContent=rnd();
    let a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();const m='radial-gradient(circle 90px at '+(e.clientX-b.left)+'px '+(e.clientY-b.top)+'px,#000,transparent)';grad.style.webkitMaskImage=m;grad.style.maskImage=m;txt.style.webkitMaskImage=m;txt.style.maskImage=m;if(Math.random()<.3)txt.textContent=rnd();};
    el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;if(!hover){a+=.02;const mx=50+Math.cos(a)*30,my=50+Math.sin(a*1.3)*30;const m='radial-gradient(circle 90px at '+mx+'% '+my+'%,#000,transparent)';grad.style.webkitMaskImage=m;grad.style.maskImage=m;txt.style.webkitMaskImage=m;txt.style.maskImage=m;}raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
