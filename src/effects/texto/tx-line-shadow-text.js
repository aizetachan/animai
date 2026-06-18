/** @type {import('../types.js').Effect} */
const effect = {
  id:'tx-line-shadow-text', title:'Line Shadow Text', cat:'Texto',
  tags:['shadow','line','text-shadow','angle','3d','typography','loop'],
  desc:'Texto con una larga sombra lineal cuyo ángulo se anima de forma continua.',
  meta:['text-shadow','rotación de ángulo','CSS+JS'],
  prompt:`Recrea un "line shadow text": un titular grueso con una sombra larga y maciza (como una proyección 3D) cuyo ángulo gira continuamente alrededor del texto.
Elementos: un h1/span con font-weight alto y color claro. La sombra se construye con un text-shadow encadenado de muchos pasos (p.ej. 1px 1px, 2px 2px, ... Npx Npx) en un mismo color oscuro/acento, creando un trazo solido en una dirección.
Técnica: para animar el ángulo, recalcula en cada frame el text-shadow con offsets x=cos(theta)*k, y=sin(theta)*k para k=1..N, con theta girando. Alternativamente con CSS usa un pseudo-elemento desplazado. Aquí gira theta con rAF.
Timings: una vuelta completa del ángulo ~6s, depth (N) ~10-16 capas. Sombra en #7b5cff o #00e0c6 sobre fondo oscuro.`,
  code:`<h1 class="lst">Animai</h1>
<style>.lst{font:900 64px system-ui;color:#eef0f7}</style>
<script>
const el=document.querySelector('.lst'),N=14,col='#7b5cff';let a=0,raf;
function loop(){a+=0.012;const dx=Math.cos(a),dy=Math.sin(a);let sh=[];
  for(let k=1;k<=N;k++)sh.push((dx*k).toFixed(1)+'px '+(dy*k).toFixed(1)+'px 0 '+col);
  el.style.textShadow=sh.join(',');raf=requestAnimationFrame(loop);}
loop();
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#0e0e16;overflow:hidden';
    s.innerHTML='<style>.lst-t{font:900 48px system-ui,sans-serif;color:#eef0f7;letter-spacing:1px}</style><div class="lst-t">Animai</div>';
    el.appendChild(s);
    const t=s.querySelector('.lst-t');
    const N=14,col='#7b5cff';let a=0,raf,run=true;
    function loop(){
      if(!run)return;
      a+=0.012;
      const dx=Math.cos(a),dy=Math.sin(a);
      const sh=[];
      for(let k=1;k<=N;k++){
        const c=k<N*0.5?col:'#00e0c6';
        sh.push((dx*k).toFixed(1)+'px '+(dy*k).toFixed(1)+'px 0 '+c);
      }
      t.style.textShadow=sh.join(',');
      raf=requestAnimationFrame(loop);
    }
    loop();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
