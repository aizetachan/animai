import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-page-wipe', title:'Page Transition Wipe', cat:'CSS Moderno',
  tags:['transition','wipe','cortina','página','reveal','view transitions'],
  desc:'Una cortina cubre y revela al cambiar de "página". Transición de página tipo View Transitions.',
  meta:['clip/translate','overlay','Transición'],
  prompt:`Crea una transición de página tipo "wipe/cortina": al navegar, un panel de color barre la pantalla cubriendo el contenido viejo y, al retirarse por el otro lado, revela el nuevo.
Implementa con un overlay full-screen animado (translateX o clip-path) que entra, cambias el contenido oculto, y sale. La View Transitions API nativa hace esto entre páginas reales.
Para SPAs y portfolios con cambios de sección cinematográficos.`,
  code:`// Page transition wipe (View Transitions API)
document.startViewTransition(() => {
  renderNewPage()      // el navegador anima el cambio automáticamente
})
/* o manual: un overlay con clip-path / translateX que barre la pantalla */
@keyframes wipe { 0%{transform:translateX(-100%)} 50%{transform:translateX(0)} 100%{transform:translateX(100%)} }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const pages=[{c:'#7b5cff',t:'Inicio'},{c:'#00e0c6',t:'Proyectos'},{c:'#ff5ca8',t:'Contacto'}];
    let cur=0,nxt=1,p=0,phase='idle',raf,run=true,timer=0;
    (function loop(){if(!run)return;timer++;if(phase==='idle'&&timer%70===0){phase='wipe';p=0;}
      x.fillStyle=pages[cur].c;x.fillRect(0,0,o.W(),o.H());x.fillStyle='rgba(255,255,255,.95)';x.font='800 22px Inter,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(pages[cur].t,o.W()/2,o.H()/2);
      if(phase==='wipe'){p+=.04;const panelX=p<.5?(-1+p*2)*o.W():0;const panelX2=p>=.5?(p-.5)*2*o.W():0;x.fillStyle=pages[nxt].c;if(p<.5){x.save();x.translate((p*2-1)*o.W(),0);x.fillRect(0,0,o.W(),o.H());x.restore();}else{x.fillRect(0,0,o.W(),o.H());x.fillStyle='rgba(255,255,255,.95)';x.fillText(pages[nxt].t,o.W()/2,o.H()/2);x.save();x.fillStyle=pages[nxt].c;x.translate((p-.5)*2*o.W(),0);x.fillRect(0,0,o.W(),o.H());x.restore();}
        if(p>=1){cur=nxt;nxt=(nxt+1)%pages.length;phase='idle';}}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
