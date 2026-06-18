import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'nav-tab-bar-mobile', title:'Mobile Tab Bar', cat:'Navegación',
  tags:['tab bar','mobile','iconos','indicador','app','bottom','activo'],
  desc:'Barra de pestañas móvil donde el icono activo salta y un indicador se desliza. Bottom nav de app.',
  meta:['active jump','indicator','Mobile'],
  prompt:`Crea una bottom tab bar de app móvil: varios iconos donde, al seleccionar uno, el icono activo "salta" (bounce + color), su etiqueta aparece, y un indicador (pill o punto) se desliza hasta él.
Anima el icono activo con scale/translateY (spring), la etiqueta con width/opacity, y el indicador con transform. Los inactivos vuelven a gris.
Para apps móviles y PWAs con navegación inferior.`,
  code:`/* Mobile tab bar — icono activo salta + indicador desliza */
.tab.active .icon { transform: translateY(-4px) scale(1.15); color: #7b5cff; }
.tab.active .label { max-width: 60px; opacity: 1; }
.indicator { transform: translateX(var(--active-x)); transition: transform .4s cubic-bezier(.5,1.5,.4,1); }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const N=4;const icons=['●','■','▲','★'];let act=0,raf,run=true,t=0,curX=0;
    (function loop(){if(!run)return;t++;if(t%70===0)act=(act+1)%N;x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const barY=o.H()-34;x.fillStyle='#12121e';x.fillRect(0,barY,o.W(),34);const seg=o.W()/N;const targetX=act*seg+seg/2;curX+=(targetX-curX)*.2;
      x.fillStyle='#7b5cff';x.fillRect(curX-14,barY,28,3);
      for(let i=0;i<N;i++){const cx=i*seg+seg/2;const active=i===act;const jump=active?Math.max(0,Math.sin(Math.min(1,(t%70)/12)*3.14))*5:0;x.fillStyle=active?'#7b5cff':'#5a5c72';x.font=(active?'16':'14')+'px Inter';x.textAlign='center';x.textBaseline='middle';x.fillText(icons[i],cx,barY+15-jump);}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
