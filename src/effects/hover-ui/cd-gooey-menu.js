/** @type {import('../types.js').Effect} */
const effect = {
  id:'cd-gooey-menu', title:'Gooey Menu', cat:'Hover & UI',
  tags:['gooey','menu','fab','codrops','blob','botones','metaball'],
  desc:'Un botón flotante que expulsa otros botones con efecto líquido gooey al abrirse. FAB metaball.',
  meta:['SVG goo filter','FAB','Codrops'],
  prompt:`Recrea el "Gooey Menu" de Codrops: un botón principal (FAB) que, al activarse, expulsa varios sub-botones que se separan de él con un efecto líquido (metaball/goo), como gotas que se desprenden.
Aplica el filtro SVG goo (blur + colormatrix de contraste) al contenedor; anima los sub-botones desde el centro hacia sus posiciones. El filtro hace que la separación parezca líquida.
Para menús de acción flotantes con encanto.`,
  code:`/* Gooey menu — filtro goo + botones que se expulsan del FAB */
<filter id="goo">
  <feGaussianBlur stdDeviation="10" result="blur"/>
  <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"/>
</filter>
/* los sub-botones animan de translate(0) a sus posiciones radiales */`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<svg width="0" height="0"><filter id="goom"><feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b"/><feColorMatrix in="b" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7"/></filter></svg><div id="gm" style="position:relative;width:120px;height:120px;filter:url(#goom)"></div>';
    el.appendChild(s);const gm=s.querySelector('#gm');const main=document.createElement('div');main.style.cssText='position:absolute;left:50%;top:50%;width:34px;height:34px;margin:-17px;border-radius:50%;background:#7b5cff';gm.appendChild(main);
    const subs=[];for(let i=0;i<4;i++){const d=document.createElement('div');d.style.cssText='position:absolute;left:50%;top:50%;width:24px;height:24px;margin:-12px;border-radius:50%;background:#7b5cff;transition:transform .5s cubic-bezier(.5,1.5,.4,1)';gm.appendChild(d);subs.push(d);}
    let open=false,raf,run=true,t=0;
    function set(){subs.forEach((d,i)=>{const a=i/4*6.283-1.57;const r=open?42:0;d.style.transform='translate('+Math.cos(a)*r+'px,'+Math.sin(a)*r+'px)';});}
    (function loop(){if(!run)return;t++;if(t%70===0){open=!open;set();}raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
