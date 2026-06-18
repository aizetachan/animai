import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'d3-fold-card', title:'Unfolding Card', cat:'3D / R3F',
  tags:['fold','unfold','desplegar','3d','tarjeta','abrir','origami'],
  desc:'Una tarjeta que se despliega en 3D revelando su contenido, como abrir una carta. Origami digital.',
  meta:['rotateX','preserve-3d','Fold'],
  prompt:`Crea una tarjeta que se "despliega" en 3D: parte plegada (un panel rotado 90° en X, oculto) y al activarse se abre rotando a 0°, revelando el contenido, como desdoblar una carta o un menú origami.
Usa transform-origin en el borde de pliegue y rotateX de -90° a 0° con perspective. Encadena varios pliegues para un efecto acordeón 3D.
Para reveals de contenido, tarjetas de invitación, menús expandibles con encanto.`,
  code:`/* Unfolding card (3D) */
.panel { transform-origin: top; transform: rotateX(-90deg); transition: transform .6s; }
.open .panel { transform: rotateX(0deg); }
/* perspective en el contenedor; varios paneles = acordeón origami */`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.012;const cyc=t%2.4;const open=cyc<1.8;const p=open?Math.min(1,cyc/.6):Math.max(0,1-(cyc-1.8)/.5);
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,topY=o.H()*.28,pw=110,ph=34;
      // panel fijo superior
      x.fillStyle='#7b5cff';x.fillRect(cx-pw/2,topY,pw,ph);x.fillStyle='#fff';x.font='bold 13px Inter';x.textAlign='center';x.textBaseline='middle';x.fillText('Abrir ▼',cx,topY+ph/2);
      // panel que se despliega (escala vertical simula rotateX)
      const e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;const fold=Math.sin(e*Math.PI/2);x.save();x.translate(cx,topY+ph);x.scale(1,fold);x.fillStyle='#16162a';x.fillRect(-pw/2,0,pw,ph*1.6);x.fillStyle='rgba(255,255,255,'+e+')';x.font='11px Inter';x.fillText('Contenido oculto',0,ph*.8);x.restore();
      // sombra de pliegue
      x.fillStyle='rgba(0,0,0,'+(1-fold)*.3+')';x.fillRect(cx-pw/2,topY+ph,pw,3);
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
