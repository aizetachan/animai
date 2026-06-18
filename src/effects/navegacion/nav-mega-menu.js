import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'nav-mega-menu', title:'Mega Menu Reveal', cat:'Navegación',
  tags:['mega menu','dropdown','columnas','stagger','panel','desplegar'],
  desc:'Un panel ancho baja desde la barra con columnas de enlaces escalonadas. El mega menú moderno.',
  meta:['dropdown','stagger','Panel'],
  prompt:`Crea un "mega menu": al hover sobre un ítem de la navbar, un panel ancho desciende suavemente (height/opacity o translateY) mostrando varias columnas de enlaces que aparecen escalonadas.
El panel se ancla a la navbar; usa transición de altura/opacidad para abrirlo y stagger en las columnas/links. Cierra al salir.
Para sitios con mucha estructura: SaaS, e-commerce, documentación.`,
  code:`/* Mega menu reveal */
.mega { opacity: 0; transform: translateY(-10px); pointer-events: none; transition: .35s; }
.nav-item:hover .mega { opacity: 1; transform: translateY(0); pointer-events: auto; }
.mega .col { opacity: 0; transition: .3s; }
.nav-item:hover .mega .col:nth-child(n) { opacity: 1; transition-delay: calc(var(--i)*.06s); }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.012;const cyc=t%2.2;const open=cyc<1.6;const prog=open?Math.min(1,cyc/.4):Math.max(0,1-(cyc-1.6)/.4);
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      // navbar
      x.fillStyle='#12121e';x.fillRect(0,0,o.W(),26);const tabs=['Productos','Recursos','Precios'];x.font='600 11px Inter';x.textBaseline='middle';tabs.forEach((tb,i)=>{x.fillStyle=i===0?'#7b5cff':'#8a8ca3';x.fillText(tb,14+i*70,13);});
      // panel
      if(prog>.01){const ph=o.H()*.7*1;x.globalAlpha=prog;x.fillStyle='#16162a';const panelH=ph;x.fillRect(8,26,o.W()-16,panelH*prog);
        const colN=3,perCol=3;for(let c=0;c<colN;c++)for(let r=0;r<perCol;r++){const local=Math.max(0,Math.min(1,(prog-.2-c*.12)/.3));x.globalAlpha=prog*local;x.fillStyle=r===0?'#7b5cff':'#2a2a3e';const cw=(o.W()-16-16)/colN;x.fillRect(16+c*cw,40+r*18,cw*.7,r===0?9:7);}x.globalAlpha=1;}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
