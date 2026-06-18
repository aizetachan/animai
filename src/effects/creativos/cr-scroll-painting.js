import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cr-scroll-painting', title:'Scroll Painting', cat:'Creativos',
  tags:['pergamino','scroll','清明上河图','handscroll','pintura','reveal','china'],
  desc:'Pergamino horizontal de pintura china (清明上河图) que se desvela panorámicamente al avanzar.',
  meta:['canvas','handscroll','auto-demo'],
  prompt:`Recrea un pergamino horizontal estilo 清明上河图 ("A lo largo del río en el Festival Qingming") que se desvela al avanzar.
Estructura: una "pintura" panorámica ancha (varias veces el ancho del viewport) compuesta por capas (cielo, montañas lejanas, río, árboles, edificios, figuras). El viewport es una ventana estrecha que recorre la pintura de izquierda a derecha.
Algoritmo: progreso p de 0 a 1 (en una app real ligado al scroll). offsetX = p * (anchoPintura - anchoViewport). Dibuja cada capa con un factor de parallax distinto (capas lejanas se mueven menos). Añade bordes de rollo de madera a izquierda/derecha que enmarcan la escena.
Timing: animación lineal de p en bucle ida y vuelta (~12s por barrido) con pequeña pausa en los extremos. Tinta sobre fondo sepia.`,
  code:`// Handscroll reveal (清明上河图) — viewport estrecho que recorre una pintura ancha
// p: 0->1 ligado al scroll. offsetX = p * (paintingW - viewW)
const offsetX = p * (paintingW - viewW)
layers.forEach(L => {
  const px = -offsetX * L.parallax              // capas lejanas: parallax<1
  ctx.save(); ctx.translate(px, 0); L.draw(ctx); ctx.restore()
})
// drawScene: cielo sepia, montañas (curvas), río (sin), árboles + casas + figuras repartidas`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    // escena procedimental determinista (semilla fija)
    let seed=1337;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
    const W=()=>o.W(),H=()=>o.H();
    const SCALE=3.2; // pintura = 3.2x el ancho del viewport
    // pre-generar elementos a lo largo del eje x (0..1)
    const hills=[],trees=[],houses=[],figs=[];
    for(let i=0;i<14;i++)hills.push({u:rnd(),h:.18+rnd()*.16,w:.12+rnd()*.1});
    for(let i=0;i<26;i++)trees.push({u:rnd(),s:.5+rnd()*.7});
    for(let i=0;i<12;i++)houses.push({u:rnd(),w:.03+rnd()*.025,h:.06+rnd()*.05,roof:rnd()>.5});
    for(let i=0;i<34;i++)figs.push({u:rnd(),s:.5+rnd()*.6});
    let p=0,dir=1,hold=0,raf,run=true;
    function scene(){
      const w=W(),h=H();
      const paintW=w*SCALE, viewW=w*.78, marginX=w*.11;
      const offX=p*(paintW-viewW);
      // marco pergamino
      x.fillStyle='#1a140e';x.fillRect(0,0,w,h);
      // ventana de pintura
      x.save();
      x.beginPath();x.rect(marginX,8,viewW,h-16);x.clip();
      // fondo sepia con gradiente
      const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#e8d9b8');g.addColorStop(.55,'#dcc9a0');g.addColorStop(1,'#cdb586');
      x.fillStyle=g;x.fillRect(marginX,0,viewW,h);
      const mapU=(u,par)=>marginX + u*paintW - offX*par;
      // montañas lejanas (parallax .35)
      x.fillStyle='rgba(120,100,70,.35)';
      hills.forEach(hl=>{const cx=mapU(hl.u,.35),bw=hl.w*paintW,bh=hl.h*h,baseY=h*.62;
        x.beginPath();x.moveTo(cx-bw,baseY);x.quadraticCurveTo(cx,baseY-bh,cx+bw,baseY);x.fill();});
      // río (parallax .55) banda sinuosa
      x.save();x.beginPath();x.moveTo(marginX,h*.66);
      for(let xx=marginX;xx<=marginX+viewW;xx+=10){const u=(xx-marginX+offX*.55)/paintW;const yy=h*.66+Math.sin(u*22)*h*.03;x.lineTo(xx,yy);}
      x.lineTo(marginX+viewW,h);x.lineTo(marginX,h);x.closePath();
      const rg=x.createLinearGradient(0,h*.6,0,h);rg.addColorStop(0,'rgba(90,110,120,.45)');rg.addColorStop(1,'rgba(60,80,95,.6)');x.fillStyle=rg;x.fill();x.restore();
      // árboles (parallax .8)
      x.strokeStyle='#5a4a32';x.fillStyle='rgba(70,95,55,.75)';
      trees.forEach(t=>{const tx=mapU(t.u,.8),ty=h*.58,th=h*.12*t.s;
        x.lineWidth=2;x.beginPath();x.moveTo(tx,ty);x.lineTo(tx,ty-th);x.stroke();
        x.beginPath();x.arc(tx,ty-th,h*.045*t.s,0,6.28);x.fill();});
      // casas (parallax 1.0)
      houses.forEach(hs=>{const hx=mapU(hs.u,1),hw=hs.w*paintW,hh=hs.h*h,by=h*.6;
        x.fillStyle='#9a7a52';x.fillRect(hx,by-hh,hw,hh);
        x.fillStyle='#5a3a22';x.beginPath();x.moveTo(hx-3,by-hh);x.lineTo(hx+hw/2,by-hh-hh*.5);x.lineTo(hx+hw+3,by-hh);x.closePath();x.fill();});
      // figuras (parallax 1.15) puntitos de tinta
      x.fillStyle='#2a2014';
      figs.forEach(f=>{const fx=mapU(f.u,1.15),fy=h*.6+Math.sin(f.u*30)*4,fh=h*.03*f.s;
        x.beginPath();x.arc(fx,fy-fh,fh*.4,0,6.28);x.fill();x.fillRect(fx-1,fy-fh*.6,2,fh*.6);});
      x.restore();
      // rollos de madera laterales
      const roll=(rx)=>{const rg2=x.createLinearGradient(rx,0,rx+marginX,0);rg2.addColorStop(0,'#3a2a18');rg2.addColorStop(.5,'#6b4a28');rg2.addColorStop(1,'#3a2a18');x.fillStyle=rg2;x.fillRect(rx,4,marginX,h-8);x.fillStyle='#caa86a';x.fillRect(rx+marginX*.4,4,3,h-8);};
      roll(0);roll(w-marginX);
    }
    (function loop(){if(!run)return;
      if(hold>0)hold--;else{p+=dir*.0016;if(p>=1){p=1;dir=-1;hold=70;}if(p<=0){p=0;dir=1;hold=70;}}
      scene();raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
