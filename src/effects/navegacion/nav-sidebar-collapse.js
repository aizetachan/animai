import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'nav-sidebar-collapse', title:'Sidebar Collapse', cat:'Navegación',
  tags:['sidebar','colapsar','expandir','iconos','labels','menú lateral','app'],
  desc:'Una barra lateral que colapsa a solo iconos y expande mostrando etiquetas. Sidebar de app/dashboard.',
  meta:['width','labels','Dashboard'],
  prompt:`Crea una sidebar que colapsa/expande: en estado colapsado muestra solo iconos (ancho estrecho); al expandir, crece el ancho y aparecen las etiquetas deslizando junto a cada icono.
Anima el width del contenedor y la opacity+translateX de los labels (con un pequeño stagger). El item activo mantiene un indicador. Útil controlado por un botón o hover.
Para dashboards, paneles de admin y apps con navegación lateral.`,
  code:`/* Sidebar collapse */
.sidebar { width: 64px; transition: width .35s cubic-bezier(.4,0,.2,1); }
.sidebar.expanded { width: 220px; }
.label { opacity: 0; transform: translateX(-8px); transition: .3s; white-space: nowrap; }
.sidebar.expanded .label { opacity: 1; transform: translateX(0); }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const items=[['◉','Inicio'],['▤','Proyectos'],['◆','Equipo'],['⚙','Ajustes']];let w=0,t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.01;const exp=(t%2)<1;const target=exp?1:0;w+=(target-w)*.12;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const sw=40+w*(o.W()*.6-40);x.fillStyle='#12121e';x.fillRect(0,0,sw,o.H());
      items.forEach((it,i)=>{const y=22+i*30;const active=i===0;x.fillStyle=active?'#7b5cff':'#8a8ca3';x.font='16px Inter';x.textAlign='center';x.textBaseline='middle';x.fillText(it[0],20,y);if(w>.05){x.globalAlpha=w;x.textAlign='left';x.font='600 12px Inter';x.fillStyle=active?'#eef0f7':'#8a8ca3';x.fillText(it[1],44,y);x.globalAlpha=1;}if(active){x.fillStyle='#7b5cff';x.fillRect(0,y-10,3,20);}});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
