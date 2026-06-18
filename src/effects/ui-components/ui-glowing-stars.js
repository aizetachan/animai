import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'ui-glowing-stars', title:'Glowing Stars', cat:'UI Components',
  tags:['stars','estrellas','brillo','glow','aceternity','fondo','twinkle'],
  desc:'Rejilla de estrellas que parpadean y brillan aleatoriamente. El Glowing Stars Background de Aceternity.',
  meta:['Aceternity UI','grid','Twinkle'],
  prompt:`Recrea el Glowing Stars Background de Aceternity: una rejilla regular de puntos donde, aleatoriamente, algunos se iluminan y crecen (glow) y vuelven a apagarse.
Cada celda tiene una probabilidad por intervalo de "encenderse" con transición de opacidad y un box-shadow de glow.
Fondo oscuro. Bueno para secciones premium/IA.`,
  code:`// Aceternity UI — Glowing Stars (React)
const GlowingStars = ({ cols = 18, rows = 8 }) => {
  const [glow, setGlow] = useState({})
  useEffect(() => {
    const id = setInterval(() => {
      const i = Math.floor(Math.random() * cols * rows)
      setGlow((g) => ({ ...g, [i]: true }))
      setTimeout(() => setGlow((g) => ({ ...g, [i]: false })), 1200)
    }, 200)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="grid" style={{ gridTemplateColumns: \`repeat(\${cols},1fr)\` }}>
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div key={i} className={glow[i] ? 'bg-violet-400 shadow-glow' : 'bg-neutral-700'} />
      ))}
    </div>
  )
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const cols=18,rows=8;const cells=[];for(let i=0;i<cols*rows;i++)cells.push({g:0});
    let raf,run=true,c=0;
    (function loop(){if(!run)return;c++;if(c%6===0){const i=Math.floor(Math.random()*cells.length);cells[i].g=1;}
      x.fillStyle='#0a0a12';x.fillRect(0,0,o.W(),o.H());const cw=o.W()/cols,ch=o.H()/rows;
      cells.forEach((cl,i)=>{cl.g*=.95;const cxp=(i%cols)*cw+cw/2,cyp=Math.floor(i/cols)*ch+ch/2;const base=.18;const a=base+cl.g*.8;if(cl.g>.1){x.shadowBlur=10*cl.g;x.shadowColor='#7b5cff';}x.fillStyle='rgba('+(cl.g>.1?'157,134,255':'90,92,114')+','+a+')';x.beginPath();x.arc(cxp,cyp,1.5+cl.g*2,0,6.28);x.fill();x.shadowBlur=0;});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
